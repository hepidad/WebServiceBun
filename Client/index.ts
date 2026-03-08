import { Elysia, t } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import nunjucks from 'nunjucks';

/**
 * ==============================================================================
 * WEBSERVICE BUN - CLIENT (Frontend)
 * ==============================================================================
 * This is the Frontend Client part of the Web Service architecture.
 * Unlike the Monolith, this application DOES NOT connect to the database directly.
 * Instead, it communicates with the Backend Server via HTTP Requests (REST API).
 * 
 * Tech Stack:
 * - Bun: Runtime
 * - Elysia: Web Framework (handling frontend routes)
 * - Nunjucks: Template Engine (rendering HTML)
 * - fetch: Native HTTP Client (built into Bun)
 */

// --- 1. CONFIGURATION ---
const PORT = 5011; // Matching the port from the reference repo (carsweb-client.py)
const API_URL = 'http://localhost:5012'; // The address of our Backend Server
const appType = 'Web Service Bun';

// --- 2. TEMPLATE ENGINE SETUP ---
nunjucks.configure('templates', { autoescape: true });

const render = (template: string, data: object = {}) => {
    return nunjucks.render(template, { 
        appType, 
        url_for: (route: string) => {
            const routes: Record<string, string> = {
                'createcar': '/createcar',
                'readcar': '/readcar',
                'updatecar': '/updatecar',
                'deletecar': '/deletecar',
                'searchcar': '/searchcar',
                'createcarsave': '/createcarsave',
                'deletecarsave': '/deletecarsave',
                'help': '/help'
            };
            return routes[route] || '#';
        },
        ...data 
    });
};

// --- 3. ELYSIA CLIENT ---
const app = new Elysia()
    .use(staticPlugin({
        assets: 'static',
        prefix: '/static'
    }))

    // --- HOME PAGE ---
    .get('/', () => {
        return new Response(render('index.html'), {
            headers: { 'Content-Type': 'text/html' }
        });
    })

    // --- READ CARS (Fetch from API) ---
    .get('/readcar', async () => {
        try {
            // Make an HTTP GET request to the Backend API
            const response = await fetch(`${API_URL}/cars`);
            const rows = await response.json();
            
            return new Response(render('readcar.html', { rows }), {
                headers: { 'Content-Type': 'text/html' }
            });
        } catch (error) {
            return new Response("Error connecting to backend server", { status: 500 });
        }
    })

    // --- CREATE CAR (Form) ---
    .get('/createcar', () => {
        return new Response(render('createcar.html'), {
            headers: { 'Content-Type': 'text/html' }
        });
    })

    // --- CREATE CAR (Submit to API) ---
    .post('/createcarsave', async ({ body }) => {
        const { carName, carBrand, carModel, carPrice } = body as any;
        
        // Prepare data for API
        const carData = {
            carname: carName,
            carbrand: carBrand,
            carmodel: carModel,
            carprice: carPrice
        };

        // Make an HTTP POST request to the Backend API
        await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });

        // Redirect to Read page
        return Response.redirect('/readcar');
    })

    // --- DELETE CAR (Form) ---
    .get('/deletecar', () => {
        return new Response(render('deletecar.html'), {
            headers: { 'Content-Type': 'text/html' }
        });
    })

    // --- DELETE CAR (Submit to API) ---
    .post('/deletecarsave', async ({ body }) => {
        const { carName } = body as any;

        // Make an HTTP DELETE request to the Backend API
        // Note: Reference implementation sends JSON body even for DELETE
        await fetch(`${API_URL}/cars`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carname: carName })
        });

        return Response.redirect('/readcar');
    })

    // --- PLACEHOLDERS ---
    .get('/updatecar', () => {
        return new Response(render('updatecar.html'), {
            headers: { 'Content-Type': 'text/html' }
        });
    })
    
    .get('/searchcar', () => {
        return new Response(render('searchcar.html'), {
            headers: { 'Content-Type': 'text/html' }
        });
    })

    .get('/help', () => "ini halaman Helps")

    .listen(PORT);

console.log(`WebClient running at ${app.server?.hostname}:${app.server?.port}`);
