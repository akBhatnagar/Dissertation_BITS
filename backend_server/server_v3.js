const express = require('express');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();

const db_path = '/Users/akshay/Documents/EMS_DB';

app.use(cors())
app.use(express.json());

const db = new sqlite3.Database(db_path);

// Login and signup APIs

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

// Friend related APIs

app.post('/addFriend', (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;

    if (!userId || !friendId) {
        return res.status(401).send({ error: "Missing data" })
    }

    if (userId === friendId) {
        return res.status(400).json({ error: 'You cannot add yourself as a friend.' });
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

app.post('/removeFriend', (req, res) => {
    const { userId, friendId } = req.body;

    const deleteQuery = `DELETE FROM friends WHERE userId = ? AND friendId = ?`;
    db.run(deleteQuery, [userId, friendId], (err) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send('Error removing friend');
        }
        return res.json({ message: 'Friend removed successfully' });
    });
});

app.post('/getFriends', (req, res) => {
    const { userId } = req.body;

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

app.get('/searchFriendById', (req, res) => {
    const id = req.body.id;

    try {
        db.all('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
            if (err) {
                res.status(500).send('Error executing query: ' + err.message);
            }
            return res.status(200).json(rows[0]);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/searchFriendByName', (req, res) => {
    const name = req.body.name;
    try {
        const searchQuery = "SELECT * FROM users WHERE name like '%" + name + "%'";
        console.log(searchQuery);
        db.all(searchQuery, (err, rows) => {
            if (err) {
                res.status(500).send('Error executing query: ' + err.message);
            }
            if (rows.length > 0) {
                return res.status(200).json(rows);
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Category and Tags related APIs

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
                categories.push({ id: row.id, name: row.name });
            });
            return res.status(200).send({
                categories: categories
            });
        }
    });
});

app.post('/addCategory', (req, res) => {
    const categoryName = req.body.categoryName;
    try {
        const insertQuery = "INSERT INTO tags (name) VALUES ( '" + categoryName + "')";
        console.log(insertQuery);
        db.run(insertQuery, (err) => {
            if (err) {
                res.status(500).send({ error: err.message });
            }
            return res.status(200).send({
                categoryName: categoryName, message: "Category added successfully"
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Groups related APIs

app.post('/addGroup', (req, res) => {
    const { name, userIds } = req.body;

    const addGroupQuery = `INSERT INTO groups (name, userIds) VALUES (?, ?)`;

    db.run(addGroupQuery, [name, userIds], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({ message: 'Group added successfully', groupId: this.lastID });
    });
});

app.delete('/deleteGroup', (req, res) => {
    const groupId = req.body.groupId;

    // Assuming 'groups' table has column 'id'
    const deleteGroupQuery = `DELETE FROM groups WHERE id = ?`;

    db.run(deleteGroupQuery, [groupId], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.json({ message: 'Group deleted successfully' });
    });
});

app.post('/groups', (req, res) => {

    const { userId } = req.body;

    const getGroupsQuery = 'SELECT * FROM groups';
    db.all(getGroupsQuery, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const filteredGroups = rows.filter((group) => {
            const userIdsArray = group.userIds.split(',').map((id) => parseInt(id.trim()));
            return userIdsArray.includes(parseInt(userId));
        });

        res.json({ groups: filteredGroups });
    });
});

app.post('/groups/users', (req, res) => {
    const groupId = req.body.groupId;

    const getGroupUsersQuery = `SELECT userIds FROM groups WHERE id = ?`;

    db.get(getGroupUsersQuery, [groupId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const userIds = row.userIds.split(',').map(id => parseInt(id));

        const getUsersQuery = `SELECT email, name, id FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`;

        db.all(getUsersQuery, userIds, (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({ users: rows });
        });
    });
});

app.get('/searchGroupByName', (req, res) => {
    const groupName = req.body.name;

    // Assuming 'groups' table has columns 'id' and 'name'
    const searchGroupQuery = `SELECT id, name, userIds FROM groups WHERE name LIKE '%' || ? || '%'`;

    db.all(searchGroupQuery, [groupName], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ groups: rows });
    });
});

// Expense related APIs

app.get('/getExpenseById', (req, res) => {
    const expenseId = req.body.id;

    const getExpenseQuery = 'SELECT * FROM expenses WHERE id = ?';
    db.get(getExpenseQuery, [expenseId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ expense: row });
    });
});

app.post('/addExpense', (req, res) => {
    const { userId, friendId, categoryId, amount, description, date } = req.body;

    const addExpenseQuery = 'INSERT INTO expenses (userId, friendId, categoryId, amount, description, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(addExpenseQuery, [userId, friendId, categoryId, amount, description, date], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({ message: 'Expense added successfully', expenseId: this.lastID });
    });
});

app.delete('/deleteExpense', (req, res) => {
    const expenseId = req.body.id;

    const deleteExpenseQuery = 'DELETE FROM expenses WHERE id = ?';
    db.run(deleteExpenseQuery, [expenseId], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    });
});

app.put('/editExpense', (req, res) => {
    const { id, userId, friendId, categoryId, amount, description, date } = req.body;

    const editExpenseQuery = 'UPDATE expenses SET userId = ?, friendId = ?, categoryId = ?, amount = ?, description = ?, date = ? WHERE id = ?';
    db.run(editExpenseQuery, [userId, friendId, categoryId, amount, description, date, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense updated successfully' });
    });
});

app.get('/getExpensesByDate', (req, res) => {
    const { startDate, endDate } = req.body;

    const getExpensesQuery = 'SELECT * FROM expenses WHERE date BETWEEN ? AND ?';
    db.all(getExpensesQuery, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ expenses: rows });
    });
});

app.post('/getExpensesByFriend', (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;

    const getExpenseByFriendIdQuery = `
        SELECT expenses.id, expenses.userId, expenses.categoryId, expenses.friendId, expenses.amount, expenses.description, expenses.date, tags.name AS categoryName
        FROM expenses
        JOIN tags ON expenses.categoryId = tags.id
        WHERE userId = ? AND friendId = ?`;

    db.all(getExpenseByFriendIdQuery, [userId, friendId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ expenses: rows });
    });
});


// Shared expenses (Group expense) related APIs

app.post('/getSharedExpenseById', (req, res) => {
    const id = req.body.id;
    const query = 'SELECT * FROM shared_expenses WHERE id = ?';
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        if (!row) {
            return res.status(404).send({ error: 'Shared Expense not found' });
        }
        res.send(row);
    });
});

app.post('/addSharedExpense', (req, res) => {
    const { groupId, amount, description, date } = req.body;
    const query = 'INSERT INTO shared_expenses (groupId, amount, description, date) VALUES (?, ?, ?, ?)';
    db.run(query, [groupId, amount, description, date], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        res.status(201).send({ message: 'Shared Expense added successfully', id: this.lastID });
    });
});

app.delete('/deleteSharedExpense', (req, res) => {
    const id = req.body.id;
    const query = 'DELETE FROM shared_expenses WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        if (this.changes === 0) {
            return res.status(404).send({ error: 'Shared Expense not found' });
        }
        res.send({ message: 'Shared Expense deleted successfully' });
    });
});

app.put('/editSharedExpense', (req, res) => {
    const id = req.body.id;
    const { groupId, amount, description, date } = req.body;
    const query = 'UPDATE shared_expenses SET groupId = ?, amount = ?, description = ?, date = ? WHERE id = ?';
    db.run(query, [groupId, amount, description, date, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        if (this.changes === 0) {
            return res.status(404).send({ error: 'Shared Expense not found' });
        }
        res.send({ message: 'Shared Expense updated successfully' });
    });
});

app.post('/getSharedExpensesByDate', (req, res) => {
    const { startDate, endDate } = req.body;
    const query = 'SELECT * FROM shared_expenses WHERE date BETWEEN ? AND ?';
    db.all(query, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        res.send(rows);
    });
});

app.post('/getSharedExpensesByGroupId', (req, res) => {
    const groupId = req.body.groupId;
    const query = 'SELECT * FROM shared_expenses WHERE groupId = ?';
    db.all(query, [groupId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        res.send(rows);
    });
});

// Settled expenses related APIs

// Add settled expense
app.post('/addSettledExpense', (req, res) => {
    const { userId, friendId, amount, categoryId, description, date } = req.body;
    const settledOnDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const addSettledExpenseQuery = 'INSERT INTO settled_expense (userId, friendId, amount, categoryId, description, date, settledOn) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(addSettledExpenseQuery, [userId, friendId, amount, categoryId, description, date, settledOnDate], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Settled expense added successfully', id: this.lastID });
    });
});

// Settle all expenses between a user and a friend
app.post('/settleAllExpenses', (req, res) => {
    const { userId, friendId } = req.body;

    const getExpensesQuery = 'SELECT * FROM expenses WHERE userId = ? AND friendId = ?';
    db.all(getExpensesQuery, [userId, friendId], async (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Insert settled expenses into settled_expense table
        const insertSettledExpenseQuery = 'INSERT INTO settled_expense (userId, friendId, amount, categoryId, description, date) VALUES (?, ?, ?, ?, ?, ?)';
        for (const expense of rows) {
            const { userId, friendId, amount, categoryId, description, date } = expense;
            db.run(insertSettledExpenseQuery, [userId, friendId, amount, categoryId, description, date], (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        }

        // Delete settled expenses from expenses table
        const deleteExpensesQuery = 'DELETE FROM expenses WHERE userId = ? AND friendId = ?';
        db.run(deleteExpensesQuery, [userId, friendId], (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Expenses settled successfully' });
        });
    });
});

// Get all settled expenses between a user and a friend with category name from tags table
app.post('/getSettledExpensesBetween', (req, res) => {
    const { userId, friendId } = req.body;

    const getSettledExpensesQuery = `
        SELECT s.id, s.userId, s.friendId, s.amount, t.name AS categoryName, s.description, s.date, s.settledOn
        FROM settled_expense s
        INNER JOIN tags t ON s.categoryId = t.id
        WHERE s.userId = ? AND s.friendId = ?
    `;
    db.all(getSettledExpensesQuery, [userId, friendId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ settledExpenses: rows });
    });
});

app.post('/deleteSettledExpense', (req, res) => {
    const expenseId = req.body.expenseId;

    const deleteSettledExpenseQuery = 'DELETE FROM settled_expense WHERE id = ?';
    db.run(deleteSettledExpenseQuery, [expenseId], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Settled expense deleted successfully' });
    });
});



// Feedback related API

app.post('/addFeedback', (req, res) => {
    const { email, name, phoneNumber, message } = req.body.formData;
    const timestamp = new Date().toISOString(); // Get current timestamp
    const query = 'INSERT INTO feedback (name, email, message, timestamp, phoneNumber) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [name, email, message, timestamp, phoneNumber], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        res.status(201).send({ message: 'Feedback added successfully', id: this.lastID });
    });
});


function startServer() {
    var port = process.env.PORT || 8080;
    app.listen(port);
    console.log("Server started and ready to listen on " + port);
}

startServer();