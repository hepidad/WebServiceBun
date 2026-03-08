# WebServiceBun

A modern web service application built with the **Bun** ecosystem. This project demonstrates a **Microservices-style** architecture (separating Client and Server) using Bun, Elysia, Nunjucks, and SQLite, replicating the architecture of [c004-webservice](https://github.com/hepidad/c004-webservice).

## Architecture

This project is divided into two separate applications:

1.  **Server (Backend API)** - Port 5012
    *   Manages the SQLite database.
    *   Provides a REST API for CRUD operations.
    *   Built with Bun, Elysia, and Bun:SQLite.

2.  **Client (Frontend App)** - Port 5011
    *   Renders the UI using Nunjucks templates.
    *   Communicates with the Server via HTTP requests (fetch).
    *   Does NOT connect to the database directly.

## Tech Stack

*   **Runtime**: [Bun](https://bun.sh)
*   **Framework**: [ElysiaJS](https://elysiajs.com)
*   **Database**: [Bun:SQLite](https://bun.sh/docs/api/sqlite)
*   **Templating**: [Nunjucks](https://mozilla.github.io/nunjucks/)
*   **Styling**: Bootstrap (via static assets)

## Project Structure

```
WebServiceBun/
├── Server/               # Backend API
│   ├── index.ts          # API Server Logic
│   ├── carsweb.db        # Database File
│   └── ...
├── Client/               # Frontend Application
│   ├── index.ts          # Client Server Logic
│   ├── templates/        # HTML Templates
│   ├── static/           # CSS/JS Assets
│   └── ...
└── README.md
```

## Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/WebServiceBun.git
    cd WebServiceBun
    ```

2.  **Install Dependencies**:
    You need to install dependencies for **both** folders.

    ```bash
    cd Server
    bun install
    cd ../Client
    bun install
    ```

## Running the App

You need to run both the Server and the Client in separate terminals.

**Terminal 1 (Start the Server):**
```bash
cd Server
bun run index.ts
```
*The API Server will start at http://localhost:5012*

**Terminal 2 (Start the Client):**
```bash
cd Client
bun run index.ts
```
*The Client App will start at http://localhost:5011*

## Learning Goals

This project helps students understand:
1.  **Decoupled Architecture**: Separating Frontend (Presentation) from Backend (Data & Logic).
2.  **REST API**: Building and consuming JSON APIs.
3.  **HTTP Requests**: Using `fetch` to send GET, POST, DELETE requests between services.
4.  **CORS**: Handling Cross-Origin Resource Sharing between different ports.

## License

MIT
