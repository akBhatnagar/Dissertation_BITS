const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json());

app.use('/login', (req, res) => {
  console.log("Received request for login");
  if (!req.body || !req.body.email || !req.body.password){
    return res.status(401).send({error: 'Missing email or password'});
  }
  const emailIsValid = req.body.email === "akshay@admin.com";
  const passwordIsValid = req.body.password === "admin";
  // Simple authentication based on a hardcoded email and password of the user
  if (emailIsValid && passwordIsValid){
    let token = Math.random().toString(36).substr(-8);
    console.log(`Logged in ${req.body.email} with token ${token}`);
    return res.status(200).send({token: token});
  } else {
    const errorMessage = emailIsValid ? "Invalid password" : "Invalid email";
    return res.status(401).send({error: errorMessage})
  }
});

// This is just an example to show how you can check the validity of a token
// In real life scenarios, this would probably be done by querying against a database
app.use('/checkToken', function(req, res) {
  let user = getUserFromToken(req.query.token);
  if (user) {
    return res.status(200).send({user: user});
  } else {
    return res.status(401).send({error: 'Invalid token'});
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
  return token ? {"name": `User ${Math.floor(Math.random() * 100)}`}: null;
}

startServer();