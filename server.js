const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed BOOLEAN)");
});

app.get('/tasks.db', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

app.post('/tasks.db', (req, res) => {
    const { text, completed } = req.body;
    db.run("INSERT INTO tasks (text, completed) VALUES (?, ?)", [text, completed], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ id: this.lastID, text, completed });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
