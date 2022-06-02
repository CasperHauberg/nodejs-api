const express = require("express");
const app = express();
const port = 3000;

const FIRST_NAME_MIN_LEN = 2;
const FIRST_NAME_MAX_LEN = 20;
const LAST_NAME_MIN_LEN = 2;
const LAST_NAME_MAX_LEN = 20;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Does this work?</h1>");
});

app.post("/", (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  if (!firstName) {
    res.status(400).send("firstName is required.");
  }

  if (firstName.length < FIRST_NAME_MIN_LEN) {
    res
      .status(400)
      .send(`Firstname must be smaller than ${FIRST_NAME_MIN_LEN} characters`);
  }

  if (firstName.length > FIRST_NAME_MAX_LEN) {
    res
      .status(400)
      .send(`Firstname must be greater than ${FIRST_NAME_MAX_LEN} characters`);
  }

  if (!lastName) {
    res.status(400).send("lastName is required.");
  }

  if (lastName.length < LAST_NAME_MIN_LEN) {
    res
      .status(400)
      .send(`Lastname must be smaller than ${LAST_NAME_MIN_LEN} characters`);
  }

  if (lastName.length > LAST_NAME_MAX_LEN) {
    res
      .status(400)
      .send(`Lastname must be greater than ${LAST_NAME_MAX_LEN} characters`);
  }

  if (!email) {
    res.status(400).send("Email is required.");
  }

  if (!phoneNumber) {
    res.status(400).send("Phone number is required.");
  }

  if (!password) {
    res.status(400).send("Password is required.");
  }

  res.status(200).send("User was succesfully uploaded");
});

app.put("/", (req, res) => {
  res.send("Put request");
});

app.delete("/", (req, res) => {
  res.send("Delete request");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
