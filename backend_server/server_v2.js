const express = require('express');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();

const db_path = '/Users/akshay/Documents/EMS_DB';

app.use(cors())
app.use(express.json());

const db = new sqlite3.Database(db_path);

app.post('/signup', (req, res) => {

    console.log("Signup request for user with request: " + req.body);

    userData = req.body;
    const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    db.run(insertQuery, [userData.name, userData.email, userData.password], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
    });
});

app.use('/login', (req, res) => {
    console.log("Received request for login v1");
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(401).send({ error: 'Missing email or password' });
    }

    let errorMessage = "";
    let responseToSend = {};

    const query = `SELECT * FROM users WHERE email = ?`;
    db.all(query, [req.body.email], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Something went wrong at the server end' });
        }
        if (rows.length > 0) {
            // User with the provided email exists
            const user = rows[0];
            // Compare the retrieved password with the input password
            if (user.password === req.body.password) {
                // Passwords match, login successful
                let token = Math.random().toString(36).substr(-8);
                console.log('Login successful');
                responseToSend = {
                    token: token,
                    name: user.name,
                    id: user.id
                };
                return res.status(200).send(responseToSend);
            } else {
                // Passwords do not match
                errorMessage = "Invalid password";
            }
        } else {
            // User with the provided email does not exist
            errorMessage = "Invalid email";
        }
        return res.status(401).send({ error: errorMessage });
    });

});

// API to add a friend
app.post('/addFriend', async (req, res) => {
    const { userId, friendId } = req.body;

    let userExist = await checkUserExists(userId);
    let friendExist = await checkUserExists(friendId);

    if (!userExist || !friendExist) {
        console.log("userExists: " + userExist + " friendExist: " + friendExist);
        return res.status(403).send({ error: 'User not found with the provided user and friend IDs' });
    }

    friendshipExist = await checkIfFriendshipExists(userId, friendId);
    if (friendshipExist) {
        return res.status(400).send("Friendship already exists");
    }

    const query = `INSERT INTO friends (userId, friendId) VALUES (?, ?)`;
    db.run(query, [userId, friendId], function (err) {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send('Error adding friend');
        }
        return res.json({ status: 200, message: 'Friend added successfully' });
    });
});

// API to remove a friend
app.post('/removeFriend', (req, res) => {
    const { userId, friendId } = req.body;

    userExist = checkUserExists(userId, (exists) => {
        console.log('User exists:', exists);
        if (!exists) {
            return res.status(403).send({ error: 'User not found with userId: ' + userId });
        }
    });

    userExist = checkUserExists(friendId, (exists) => {
        console.log('User exists:', exists);
        if (!exists) {
            return res.status(403).send({ error: 'User not found with userId: ' + userId });
        }
    });

    friendshipExist = checkIfFriendshipExists(userId, friendId, (exists) => {
        console.log('Friendship exists:', exists);
        if (exists) {
            return res.status(400).send("Friendship already exists");
        }
    });

    const deleteQuery = `DELETE FROM friends WHERE userId = ? AND friendId = ?`;
    db.run(deleteQuery, [userId, friendId], function (err) {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send('Error removing friend');
        }
        return res.json({ message: 'Friend removed successfully' });
    });
});

// API to get a user's friends
app.post('/getFriends', (req, res) => {
    const { userId } = req.body;

    userExist = checkUserExists(userId, (exists) => {
        console.log('User exists:', exists);
        if (!exists) {
            return res.status(403).send({ error: 'User not found with userId: ' + userId });
        }
    });

    const query = `SELECT u.id, u.name, u.email
                   FROM users u
                   JOIN friends f ON u.id = f.friendId
                   WHERE f.userId = ?`;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send('Error fetching friends');
        }
        return res.json(rows);
    });
});

app.get('/getCategories', (req, res) => {
    console.log("Received request for getting categories");

    const categories = [];

    const query = `SELECT * FROM tags`;
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Something went wrong at the server end' });
        }
        if (rows.length > 0) {
            rows.forEach(row => {
                categories.push(row.name);
            });
            return res.status(200).send({
                categories: categories
            });
        }
    });
});


// Utility methods

async function checkUserExists(userId) {
    if (!userId) {
        return false;
    }

    const query = `SELECT id FROM users WHERE id = ?`;
    try {
        const row = await db.get(query, [userId]);
        if (row.id) {
            console.log("Row exist for user " + userId + ": " + JSON.stringify(row));
            return true;
        };
        return false;
    } catch (err) {
        console.error('Error executing query: ' + err.message);
        return false;
    }
}

async function checkIfFriendshipExists(userId, friendId) {
    if (!userId || !friendId) {
        return false;
    }

    const query = `SELECT id FROM friends WHERE userId = ? AND friendId = ?`;
    try {
        const row = await db.get(query, [userId, friendId]);
        if (row.id) {
            console.log("Row exist for friendship" + JSON.stringify(row));
            return true;
        };
        return false;
    } catch (err) {
        console.error('Error executing query: ' + err.message);
        return false;
    }
}

function startServer() {
    var port = process.env.PORT || 8080;
    app.listen(port);
    console.log("Server started and ready to listen on " + port);
}

startServer();

// const testFunc = () => {
//   getFriends(1);
// }
// testFunc();