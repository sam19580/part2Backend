const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

const users = {};
const supportedStocks = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];
let stockPrices = {
    'GOOG': 1000,
    'TSLA': 600,
    'AMZN': 2000,
    'META': 300,
    'NVDA': 500
};

setInterval(() => {
    for (let stock in stockPrices) {
        // Ensure stockPrices[stock] is treated as a number
        stockPrices[stock] = Number(stockPrices[stock]) + (Math.random() - 0.5) * 10;
        stockPrices[stock] = stockPrices[stock].toFixed(2);
    }
    io.emit('stockUpdate', stockPrices);
}, 1000);

app.use(express.static('public'));
app.use(express.json());

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        let user = Object.values(users).find(user => user.email === email);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ userId: user.id });
            } else {
                res.status(400).send('Invalid credentials');
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = uuidv4();
            users[userId] = { id: userId, email, password: hashedPassword, subscribedStocks: [] };
            res.json({ userId });
        }
    } else {
        res.status(400).send('Email and password are required');
    }
});

app.post('/subscribe', (req, res) => {
    const { userId, stock } = req.body;
    if (users[userId] && supportedStocks.includes(stock)) {
        users[userId].subscribedStocks.push(stock);
        res.status(200).send('Subscribed successfully');
    } else {
        res.status(400).send('Invalid user or stock');
    }
});

io.on('connection', (socket) => {
    socket.on('userConnected', (userId) => {
        if (users[userId]) {
            socket.join(userId);
            socket.emit('stockUpdate', stockPrices);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
