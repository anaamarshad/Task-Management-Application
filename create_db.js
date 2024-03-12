const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) console.error('Error opening database', err);
    else console.log('Database opened successfully');
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed BOOLEAN)");
});

// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose(); // Include SQLite dependency
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from the current directory

// const db = new sqlite.Database('./tasks.db'); // Corrected database instance

app.get('/tasks.db', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) return console.error(err.message);
        res.json(rows);
    });
});

app.post('/tasks.db', (req, res) => {
    const { text, completed } = req.body;
    db.run("INSERT INTO tasks (text, completed) VALUES (?, ?)", [text, completed], function(err) {
        if (err) return console.error(err.message);
        res.json({ id: this.lastID });
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`)); // Fix the typo here
