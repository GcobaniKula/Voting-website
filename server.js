const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize the Express app
const app = express();

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML form
app.use(express.static(path.join(__dirname, 'public')));

// Create and open SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            surname TEXT,
            sex TEXT,
            province TEXT,
            city TEXT,
            postal TEXT,
            address TEXT,
            national TEXT,
            locally TEXT
        )`);
    }
});

// POST endpoint to handle form submissions
app.post('/data', (req, res) => {
    const { name, surname, id, sex, province, city, postal, address, national, locally } = req.body;

    // Check if ID already exists
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (row) {
            // ID exists
            res.status(400).send('Duplicate entry: ID number already exists.');
        } else {
            // Insert new user data
            db.run(`INSERT INTO users (id, name, surname, sex, province, city, postal, address, national, locally) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, name, surname, sex, province, city, postal, address, national, locally], function(err) {
                    if (err) {
                        res.status(500).send('Error inserting data.');
                    } else {
                        res.status(200).send('Form data successfully stored.');
                    }
                });
        }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
