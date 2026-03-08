import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { cors } from '@elysiajs/cors';

/**
 * ==============================================================================
 * WEBSERVICE BUN - SERVER (API)
 * ==============================================================================
 * This is the Backend API part of the Web Service architecture.
 * It is responsible for:
 * 1. Managing the Database (SQLite)
 * 2. Providing REST API endpoints (GET, POST, DELETE) for the Client
 * 3. Handling data validation and business logic
 * 
 * Tech Stack:
 * - Bun: Runtime
 * - Elysia: Web Framework
 * - Bun:SQLite: Native Database
 */

// --- 1. CONFIGURATION ---
const PORT = 5012; // Matching the port from the reference repo (carsweb-server.py)

// --- 2. DATABASE SETUP ---
const db = new Database('cars.db');

// Create Table
db.query(`
    CREATE TABLE IF NOT EXISTS TBCarsWeb (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carname TEXT,
        carbrand TEXT,
        carmodel TEXT,
        carprice TEXT
    )
`).run();

// Prepared Statements (for performance and security)
const queries = {
    getAll: db.query('SELECT * FROM TBCarsWeb'),
    insert: db.query('INSERT INTO TBCarsWeb (carname, carbrand, carmodel, carprice) VALUES ($name, $brand, $model, $price) RETURNING *'),
    deleteByName: db.query('DELETE FROM TBCarsWeb WHERE carname = $name'),
    getByName: db.query('SELECT * FROM TBCarsWeb WHERE carname = $name')
};

// --- 3. ELYSIA SERVER ---
const app = new Elysia()
    // Enable CORS to allow requests from the Client (running on a different port)
    .use(cors())

    // Middleware: Log requests
    .onRequest(({ request }) => {
        console.log(`[API] ${request.method} ${request.url}`);
    })

    // --- ROOT ENDPOINT ---
    .get('/', () => "Server Ready")

    // --- READ ALL CARS ---
    // GET /read (or /cars in RESTful style, we'll support both to match reference)
    .get('/read', () => {
        return queries.getAll.all();
    })
    
    .get('/cars', () => {
        return queries.getAll.all();
    })

    // --- CREATE CAR ---
    // POST /cars
    .post('/cars', ({ body, error }) => {
        const { carname, carbrand, carmodel, carprice } = body as any;

        try {
            const newCar = queries.insert.get({
                $name: carname,
                $brand: carbrand,
                $model: carmodel,
                $price: carprice
            });
            
            // Return the updated list (as per reference implementation logic)
            return queries.getAll.all();
        } catch (e) {
            return error(500, "Failed to create car");
        }
    })

    // --- DELETE CAR ---
    // DELETE /cars
    .delete('/cars', ({ body, error }) => {
        const { carname } = body as any;
        
        try {
            queries.deleteByName.run({ $name: carname });
            
            // Return the updated list
            return queries.getAll.all();
        } catch (e) {
            return error(500, "Failed to delete car");
        }
    })

    .listen(PORT);

console.log(`WebService Server running at ${app.server?.hostname}:${app.server?.port}`);
