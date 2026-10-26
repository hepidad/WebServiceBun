# WebServiceBun

A modern web service application built with the **Bun** ecosystem. This project demonstrates a **Web Service-style** architecture (separating Client and Server) using Bun, Elysia, Nunjucks, and SQLite, replicating the architecture of [c004-webservice](https://github.com/hepidad/c004-webservice).

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
│   ├── cars.db           # Database File
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

## Accessing the API

The **Server** (`http://localhost:5012`) is the REST API. The **Client** never touches the database directly — it calls this same API. You can call the Server yourself using an API client like [Bruno](https://www.usebruno.com/) or the `curl` command line tool.

Make sure the Server is running first:

```bash
cd Server
bun run index.ts
# -> WebService Server running at localhost:5012
```

### API Endpoints

| Method | Path     | Body (JSON)                                      | Description                              |
|--------|----------|--------------------------------------------------|------------------------------------------|
| GET    | `/`      | —                                                | Health check, returns `Server Ready`     |
| GET    | `/read`  | —                                                | Returns all cars as JSON                 |
| GET    | `/cars`  | —                                                | Returns all cars as JSON (same as above) |
| POST   | `/cars`  | `carname`, `carbrand`, `carmodel`, `carprice`    | Creates a car, returns the updated list  |
| DELETE | `/cars`  | `carname`                                        | Deletes a car by name, returns the list  |

> **Note:** When calling the Server directly, use the lowercase field names (`carname`, `carbrand`, `carmodel`, `carprice`). All values are stored as text.

### Accessing with Bruno

1. Open Bruno and create a new **Collection** (e.g. `WebServiceBun API`).
2. (Optional) Create an **Environment** with a variable `baseUrl = http://localhost:5012` so you can reuse it across requests.
3. Add the following requests:

**Health check**
```
GET {{baseUrl}}/
```

**Read all cars**
```
GET {{baseUrl}}/cars
```

**Create a car** — set Body type to **JSON**:
```
POST {{baseUrl}}/cars
```
```json
{
  "carname": "Supra",
  "carbrand": "Toyota",
  "carmodel": "A90",
  "carprice": "80000"
}
```

**Delete a car** — set Body type to **JSON**:
```
DELETE {{baseUrl}}/cars
```
```json
{
  "carname": "Supra"
}
```

Example of a Bruno `.bru` request file (save inside your collection folder):

```
meta {
  name: Create Car
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/cars
  body: json
  auth: none
}

body:json {
  {
    "carname": "Supra",
    "carbrand": "Toyota",
    "carmodel": "A90",
    "carprice": "80000"
  }
}
```

### Accessing with cURL

**Health check**
```bash
curl http://localhost:5012/
# -> Server Ready
```

**Read all cars**
```bash
curl http://localhost:5012/cars
# Tip: pipe to jq for pretty output
curl -s http://localhost:5012/cars | jq
```

**Create a car**
```bash
curl -X POST http://localhost:5012/cars \
  -H "Content-Type: application/json" \
  -d '{
    "carname": "Supra",
    "carbrand": "Toyota",
    "carmodel": "A90",
    "carprice": "80000"
  }'
```

**Delete a car**
```bash
curl -X DELETE http://localhost:5012/cars \
  -H "Content-Type: application/json" \
  -d '{"carname": "Supra"}'
```

Both endpoints return the full, updated list of cars as JSON after a create or delete.

## Learning Goals

This project helps students understand:
1.  **Decoupled Architecture**: Separating Frontend (Presentation) from Backend (Data & Logic).
2.  **REST API**: Building and consuming JSON APIs.
3.  **HTTP Requests**: Using `fetch` to send GET, POST, DELETE requests between services.
4.  **CORS**: Handling Cross-Origin Resource Sharing between different ports.

## License

MIT
