# Restaurant Order Tracker

A full-stack app to track restaurant orders through three stages:
- Preparing
- Ready
- Completed

## Tech Stack

### Frontend
- React (Vite)
- CSS (basic styling)
- Fetch API

### Backend
- Node.js
- Express
- PostgreSQL (`pg`)
- Neon database
- `cors`, `dotenv`

## Project Structure

```txt
Restaurant Order Tracker/
  backend/
    controllers/
      orderController.js
    routes/
      orderRoutes.js
    db.js
    index.js
    schema.sql
    package.json
  frontend/
    src/
      components/
        OrderCard.jsx
        OrderForm.jsx
        OrderList.jsx
      App.jsx
      App.css
      main.jsx
      index.css
    package.json
    vite.config.js
  README.md
```

## Features

- Add new order
- Fetch all orders
- Show orders in 3 columns by status
- Move order to next stage with `Next` button
- Disable `Next` when order is `Completed`
- Loading and error handling in UI
- Empty state (`No orders yet.`)

## Order Status Flow

Allowed transitions:
- Preparing -> Ready
- Ready -> Completed
- Completed -> no update

## Backend API

Base URL (local): `http://localhost:3000`

### Health
- `GET /`
- Response: `Server is running`

### Create Order
- `POST /orders`
- Body:

```json
{
  "customer_name": "Aditya",
  "item": "Paneer Tikka"
}
```

- Success: `201 Created`
- Returns created order row

### Get Orders
- `GET /orders`
- Returns all orders
- Sorted by `created_at DESC`

### Update Order Status
- `PUT /orders/:id`
- Moves to next status based on backend rules
- Returns updated order row

## Database Schema

Run this SQL in Neon SQL Editor:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  item TEXT,
  status TEXT DEFAULT 'Preparing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

You can also use:
- `backend/schema.sql`

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
PORT=3000
```

Notes:
- App uses `Pool` from `pg`
- SSL is enabled with:
  - `ssl: { rejectUnauthorized: false }`

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd "Restaurant Order Tracker"
```

Install backend deps:

```bash
cd backend
npm install
```

Install frontend deps:

```bash
cd ../frontend
npm install
```

### 2. Create env files

Create:
- `backend/.env`
- `frontend/.env`

Use the variable values from the section above.

### 3. Create table in Neon

Open Neon SQL Editor and run the schema SQL.

### 4. Run backend

```bash
cd backend
npm start
```

Backend runs on `http://localhost:3000`.

### 5. Run frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## How UI Works

- `OrderForm` sends `POST /orders`
- On successful create, app triggers list refresh
- `OrderList` fetches orders and groups by status
- `OrderCard` calls `PUT /orders/:id` on `Next`
- After update, list reloads and order moves to the next column

## Troubleshooting

### 500 on `/orders`
Cause:
- `orders` table missing in Neon

Fix:
- Run schema SQL in Neon SQL Editor

### 400 on `POST /orders`
Cause:
- Empty `customer_name` or `item`

Fix:
- Enter both fields in form

### CORS or wrong backend URL
Cause:
- Frontend points to wrong API URL

Fix:
- Check `frontend/.env`
- Ensure `VITE_API_URL` is correct

### DB connection issues
Cause:
- Invalid `DATABASE_URL`

Fix:
- Verify `backend/.env`
- Confirm Neon credentials and DB name

## Production / Deployment Notes

- Deploy backend first and get API URL
- Set frontend `VITE_API_URL` to deployed backend URL
- Keep Neon `DATABASE_URL` in backend environment variables
- Run `schema.sql` once on production database

## Scripts

### Backend
- `npm start` -> starts Express server

### Frontend
- `npm run dev` -> start Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview production build
- `npm run lint` -> lint frontend code

## Current Limitations

- No authentication
- No delete/edit order endpoints
- No pagination
- Basic error handling only

## Next Suggestions

- Add `.env.example` files in both frontend and backend
- Add a small `npm run dev` script for backend using nodemon
- Add endpoint tests (supertest/jest)
- Add form success toast/message
