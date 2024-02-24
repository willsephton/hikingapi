const express = require('express');
const mysql = require('mysql');
console.log(mysql.version,"heifhsiefosef");
const bodyParser = require('body-parser');

const app = express();

// MySQL Connection Configuration
const db = mysql.createConnection({
  host: 'mysql', // docker-compose service name
  user: 'username',
  password: 'password',
  database: 'obstructions',
  insecureAuth : true
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());

// Routes
// Example: Get all users
app.get('/obstructions', (req, res) => {
  const sql = 'SELECT * FROM obstructions';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// Example: Create a new user
app.post('/createObstruction', (req, res) => {
  const { type, longitude, latitude, date, trail } = req.body;
  const sql = 'INSERT INTO obstructions (type, longitude, latitude, date, trail) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [type, longitude, latitude, date, trail], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Obstruction created successfully', id: result.insertId });
  });
});



// Route to set up the database schema
app.get('/setup-database', (req, res) => {
  // SQL query to create the obstructions table
  const createObstructionsTable = `
    CREATE TABLE IF NOT EXISTS obstructions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(255) NOT NULL,
      longitude DECIMAL(10, 6) NOT NULL,
      latitude DECIMAL(10, 6) NOT NULL,
      date DATE NOT NULL,
      trail VARCHAR(255) NOT NULL
    )
  `;

  // Execute the SQL query
  db.query(createObstructionsTable, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Database setup completed' });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
