require('dotenv').config();

const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

pool.query('SELECT 1').then(() => {
  console.log('Connected to PostgreSQL');
}).catch((error) => {
  console.error('PostgreSQL connection error:', error.message);
});