const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();


app.set('view engine', 'ejs');

// MySQL Connection Configuration
const dbConfig = {
  host: 'mysql', // docker-compose service name
  user: 'username',
  password: 'password',
  database: 'obstructions',
  insecureAuth : true
};

let db;

function connectDatabase() {
  db = mysql.createConnection(dbConfig);

  // Attempt to connect to MySQL
  db.connect((err) => {
    if (err) {
      console.error('Failed to connect to MySQL:', err.message);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectDatabase, 5000);
    } else {
      console.log('Connected to MySQL');
      // Start server once MySQL connection is established
      startServer();
    }
  });

  // Handle MySQL connection errors
  db.on('error', (err) => {
    console.error('MySQL connection error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectDatabase(); // Reconnect if connection is lost
    } else {
      throw err;
    }
  });
}

// Function to start the Express server
function startServer() {
  // Middleware
  app.use(bodyParser.json());

  // Routes

  // View
app.get('/', (req,res)=> {
	res.render("index");
});


  // Get all users
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
}

// Start the application by connecting to the database
connectDatabase();
