const express = require("express");
const { body, validationResult } = require("express-validator");
const mongodb = require("mongodb");
const MONGODB_PASSWORD = require("./private/password");
const MongoClient = mongodb.MongoClient;
const URI = `mongodb+srv://nodejs:${MONGODB_PASSWORD}@nodejs-api.ghercv6.mongodb.net/users?retryWrites=true&w=majority`;
const app = express();
const port = 3000;

const FIRST_NAME_MIN_LEN = 2;
const FIRST_NAME_MAX_LEN = 20;
const LAST_NAME_MIN_LEN = 2;
const LAST_NAME_MAX_LEN = 20;

app.use(express.json());

app.get("/", (req, res) => {
  const client = new MongoClient(URI);

  async function run() {
    try {
      await client.connect();
      const database = client.db("test");
      const movies = database.collection("users");
      const query = {};
      const options = {};
      const cursor = await movies.find(query, options).toArray();

      if (!cursor) {
        console.log("No documents found!");
      }

      res.json(cursor);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.post(
  "/",
  body("firstName").isLength({
    min: FIRST_NAME_MIN_LEN,
    max: FIRST_NAME_MAX_LEN,
  }),
  body("lastName").isLength({ min: LAST_NAME_MIN_LEN, max: LAST_NAME_MAX_LEN }),
  body("email").isEmail(),
  body("phone").isMobilePhone("da-DK"),
  body("password").isStrongPassword(), // Default: min length 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    const client = new MongoClient(URI);

    async function insertUser() {
      try {
        await client.connect();

        const database = client.db("test");
        const users = database.collection("users");

        const doc = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          password: password,
        };

        const result = await users.insertOne(doc);

        res.status(200).send("User was inserted");
      } finally {
        await client.close();
      }
    }

    insertUser();
  }
);

app.put("/", (req, res) => {
  res.send("Put request");
});

app.delete("/", (req, res) => {
  res.send("Delete request");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
