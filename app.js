const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { Loader } = require('@googlemaps/js-api-loader');

const app = express();

// MySQL Connection Configuration
const dbConfig = {
  host: 'mysql', // docker-compose service name
  user: 'username',
  password: 'password',
  database: 'obstructions',
  insecureAuth: true
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
  app.use('/scripts', express.static('scripts')); // Serve static files from 'scripts' directory

  // Routes
  app.set('view engine', 'ejs');

  app.get('/', (req, res) => {
    res.render('index');
  });

  // Get all obstructions
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

  // Create a new obstruction
  app.post('/createObstruction', (req, res) => {
    const { type, longitude, latitude, date, trail, approval } = req.body;
    const sql = 'INSERT INTO obstructions (type, longitude, latitude, date, trail, approval) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [type, longitude, latitude, date, trail, approval], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Obstruction created successfully', id: result.insertId });
    });
  });

  // Edit an existing obstruction
  app.post('/editObstruction/:id', (req, res) => {
    const { type, longitude, latitude, date, trail, approval } = req.body;
    const id = req.params.id;
    const sql = 'UPDATE obstructions SET type = ?, longitude = ?, latitude = ?, date = ?, trail = ?, approval = ? WHERE id = ?';
    db.query(sql, [type, longitude, latitude, date, trail, approval, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Obstruction not found' });
        return;
      }
      res.json({ message: 'Obstruction updated successfully', id: id });
    });
  });

  // Delete an obstruction
  app.delete('/deleteObstruction/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM obstructions WHERE id = ?';
    db.query(sql, id, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Obstruction not found' });
        return;
      }
      res.json({ message: 'Obstruction deleted successfully', id: id });
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
        date VARCHAR(255) NOT NULL,
        trail VARCHAR(255) NOT NULL,
        approval BOOLEAN DEFAULT false
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


//! User Database Stuff

const bcrypt = require('bcrypt');

// Route to set up the users table
app.get('/setup-database-users', (req, res) => {
  // SQL query to create the users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      admin BOOLEAN DEFAULT false
    )
  `;

  // Execute the SQL query
  db.query(createUsersTable, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Users table setup completed' });
  });
});


// Create a new user
app.post('/createUser', async (req, res) => {
  const { username, password, admin } = req.body;
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const sql = 'INSERT INTO users (username, password, admin) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, admin || false], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User created successfully', id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Retrieve user from the database by username
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const user = results[0];

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // Passwords match, user is authenticated
      res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // Get all users
 app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
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
