# Stock Broker Client Web Dashboard - Backend

This is the backend part of the Stock Broker Client Web Dashboard, built with Node.js and Socket.io. The backend handles user authentication, stock subscription, and real-time stock price updates.

## Features

- **User Authentication:** Users can log in with their email and password. Passwords are hashed for security.
- **Stock Subscription:** Users can subscribe to five supported stocks (`GOOG`, `TSLA`, `AMZN`, `META`, `NVDA`).
- **Real-time Updates:** Sends real-time stock price updates to all connected clients.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- npm (Node package manager)

### Installation

1. Clone the repository or download the source code.

    ```bash
    git clone <repository_url>
    cd stock-dashboard
    ```

2. Install the required npm packages.

    ```bash
    npm install
    ```

3. Start the Node.js server.

    ```bash
    node index.js
    ```

### Files

- `index.js`: The main server file that sets up the Express server, handles API routes, and manages Socket.io connections.

### API Endpoints

- **POST `/login`**
    - **Description:** Logs in a user or creates a new user if the email does not exist.
    - **Request Body:**
      ```json
      {
          "email": "user@example.com",
          "password": "password123"
      }
      ```
    - **Response:**
      ```json
      {
          "userId": "user-unique-id"
      }
      ```

- **POST `/subscribe`**
    - **Description:** Subscribes a user to a stock.
    - **Request Body:**
      ```json
      {
          "userId": "user-unique-id",
          "stock": "GOOG"
      }
      ```
    - **Response:**
      - Success: `200 OK`
      - Error: `400 Bad Request`

### Real-time Updates

- The backend uses Socket.io to send real-time stock price updates to all connected clients.
- Stock prices are simulated and updated every second.

### Code Overview

#### server.js

- Sets up an Express server to handle HTTP requests.
- Uses Socket.io for real-time communication.
- Stores user data and subscriptions in-memory (for development purposes).
- Simulates real-time stock prices and broadcasts updates to all clients.
