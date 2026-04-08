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
|-- backend/
|   |-- controllers/
|   |   |-- orderController.js
|   |-- routes/
|   |   |-- orderRoutes.js
|   |-- db.js
|   |-- index.js
|   |-- schema.sql
|   |-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- OrderCard.jsx
|   |   |   |-- OrderForm.jsx
|   |   |   |-- OrderList.jsx
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- main.jsx
|   |   |-- index.css
|   |-- package.json
|   |-- vite.config.js
|-- README.md
```

## Features

- Add new order with customer name and item
- Fetch all orders sorted by latest first
- Show orders in 3 columns by status (Preparing, Ready, Completed)
- Move order to next stage with `Next` button
- Delete completed orders with `Delete` button
- Color-coded status badges (yellow, cyan, green)
- Loading and error handling in UI
- Empty state message when no orders exist
- Responsive card layout with hover effects

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

### Delete Order
- `DELETE /orders/:id`
- Deletes order **only if status is `Completed`**
- Returns `400` if trying to delete non-completed orders
- Returns deleted order row on success

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
git clone https://github.com/aditya-kurhade/Restaurant-Order-Tracker
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

Create `backend/.env`:

```env
DATABASE_URL=<your-neon-connection-string>
PORT=3000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Create table in Neon

Open Neon SQL Editor and run:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  item TEXT,
  status TEXT DEFAULT 'Preparing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Run backend

```bash
cd backend
npm start
```

Backend runs on `http://localhost:3000`.

### 5. Run frontend

```bash
cd ../frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

## How UI Works

- `OrderForm` submits `POST /orders` to create new order
- On successful create, form clears and list auto-refreshes
- `OrderList` fetches orders and groups by three columns
- `OrderCard` displays customer name, item, and color-coded status badge
- `Next` button moves order to next stage with `PUT /orders/:id`
- `Delete` button (visible only for completed orders) removes with `DELETE /orders/:id`
- After any action (create, update, delete), list reloads immediately
- UI shows loading states and error messages

## Troubleshooting

### 500 on `GET /orders` or `POST /orders`
**Cause:** `orders` table missing in Neon

**Fix:**
- Open Neon SQL Editor
- Run the schema SQL from above
- Refresh frontend

### 400 on `POST /orders`
**Cause:** Empty `customer_name` or `item` field

**Fix:**
- Fill both fields before submitting
- Form shows error message

### CORS error or request failing
**Cause:** Frontend using wrong backend URL

**Fix (Local):**
- Check `frontend/.env` has `VITE_API_URL=http://localhost:3000`
- Ensure backend is running on port 3000

**Fix (Deployed):**
- Check Vercel env var `VITE_API_URL` points to your Render backend URL
- Redeploy frontend if env changed

### Backend won't start locally
**Cause:** Missing dependencies or env variables

**Fix:**
- Run `npm install` in backend folder
- Create `backend/.env` with valid `DATABASE_URL`
- Check PostgreSQL connection

### Delete button not working
**Cause:** Order is not in "Completed" status

**Fix:**
- Delete button only shows for completed orders
- Click "Next" twice to move order to Completed first

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create Web Service on [Render](https://render.com)
3. Connect your GitHub repo
4. Set Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add Environment:
   - `DATABASE_URL`: Your Neon connection string
8. Deploy
9. Get your backend URL (e.g., `https://restaurant-order-tracker-3.onrender.com`)

### Frontend (Vercel)

1. Create Site on [Vercel](https://vercel.com)
2. Import your GitHub repo
3. Set Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL
7. Deploy

### Database (Neon)

- Run schema SQL in Neon SQL Editor (one-time setup)
- Neon connection string automatically used by backend

## Production Notes

- Always deploy backend first, get URL, then deploy frontend with that URL
- Never commit `.env` files; use platform env vars (Render, Vercel)
- Rotate database credentials regularly
- Monitor backend logs for errors
- Test all API endpoints after deployment
- Keep Neon connection string secure

## Scripts

### Backend
- `npm start` -> starts Express server

### Frontend
- `npm run dev` -> start Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview production build
- `npm run lint` -> lint frontend code

## Current Limitations

- No user authentication or multi-user support
- No order search or filtering
- No pagination (all orders on one page)
- Status can only move forward (Preparing → Ready → Completed)
- Delete only available for completed orders
- Basic form validation

## Next Suggestions

- Add user authentication (JWT)
- Add order search/filter by customer name
- Add pagination for large order lists
- Add email notifications on order status change
- Add order notes/comments
- Add order timestamps (preparation time, completion time)
- Add unit and integration tests
- Add success toast notifications
