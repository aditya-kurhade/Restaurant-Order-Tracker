CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  item TEXT,
  status TEXT DEFAULT 'Preparing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
