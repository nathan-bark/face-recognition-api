const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require('./controllers/image')

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "nathanbark",
    password: "",
    database: "smart-brain",
  },
});

const app = express();

app.use(express.json());
app.use(cors());

const saltRounds = 0;
const salt = bcrypt.genSaltSync(saltRounds);

app.get("/", (req, res) => {
  res.send("success!");
});

app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt, salt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, () => {
  console.log("running!");
});