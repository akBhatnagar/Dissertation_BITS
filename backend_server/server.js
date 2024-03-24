const express = require('express');
const cors = require('cors');
const app = express();
const friends = require('./friends.json');
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

  // Close the database connection
  db.close();

});

app.use('/getFriends', async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).send({ error: "Missing parameter: userId" });
  }
  console.log("Fetching list of friends for the user id: " + req.body.userId);
  // let friendList = friends[req.body.userId];
  // console.log(friendList);
  let friendList = await getFriends(req.body.userId);
  console.log("Returning list of friends");
  // if (!friendList) friendList = [];
  return res.status(200).send({ friendList: friendList });
});

async function getFriends(userId) {

  var getFriendsQuery = `SELECT u.email, u.name, u.id
                        FROM users u
                        JOIN friends f ON u.id = f.friendId
                        WHERE f.userId = ?;
  `

  db.all(getFriendsQuery, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(results);
    return results;
  });
}

app.use('/login/v1', (req, res) => {
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
        console.log('Login successful, token: ', token);
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

app.use('/checkToken', function (req, res) {
  let user = getUserFromToken(req.query.token);
  if (user) {
    return res.status(200).send({ user: user });
  } else {
    return res.status(401).send({ error: 'Invalid token' });
  }
});

function startServer() {
  var port = process.env.PORT || 8080;
  app.listen(port);
  console.log("Server started and ready to listen on " + port);
}

function getUserFromToken(token) {
  // This is a very simple way to implement tokens. In reality, you would likely use a database
  // to store your users along with their tokens. The token here is simply a random string that
  // we are using as our unique identifier for the user.
  return token ? { "name": `User ${Math.floor(Math.random() * 100)}` } : null;
}

startServer();

// const testFunc = () => {
//   getFriends(1);
// }
// testFunc();