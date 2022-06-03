const express = require("express");
const { body, validationResult } = require("express-validator");
const mongodb = require("mongodb");
const MONGODB_PASSWORD = require("./private/password");
const MongoClient = mongodb.MongoClient;
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

    const client = new MongoClient(
      `mongodb+srv://nodejs:${MONGODB_PASSWORD}@nodejs-api.ghercv6.mongodb.net/users?retryWrites=true&w=majority`
    );

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

// app.post("/", (req, res) => {
//   const { firstName, lastName, email, phoneNumber, password } = req.body;

//   if (!firstName) {
//     res.status(400).send("firstName is required.");
//   }

//   if (firstName.length < FIRST_NAME_MIN_LEN) {
//     res
//       .status(400)
//       .send(`Firstname must be greater than ${FIRST_NAME_MIN_LEN} characters`);
//   }

//   if (firstName.length > FIRST_NAME_MAX_LEN) {
//     res
//       .status(400)
//       .send(`Firstname must be smaller than ${FIRST_NAME_MAX_LEN} characters`);
//   }

//   if (!lastName) {
//     res.status(400).send("lastName is required.");
//   }

//   if (lastName.length < LAST_NAME_MIN_LEN) {
//     res
//       .status(400)
//       .send(`Lastname must be greater than ${LAST_NAME_MIN_LEN} characters`);
//   }

//   if (lastName.length > LAST_NAME_MAX_LEN) {
//     res
//       .status(400)
//       .send(`Lastname must be smaller than ${LAST_NAME_MAX_LEN} characters`);
//   }

//   if (!email) {
//     res.status(400).send("Email is required.");
//   }

//   if (!phoneNumber) {
//     res.status(400).send("Phone number is required.");
//   }

//   if (phoneNumber.length !== PHONE_NUMBER_MAX_LEN) {
//     res.status(400).send(`Phone number must be ${PHONE_NUMBER_MAX_LEN} digits`);
//   }

//   if (!password) {
//     res.status(400).send("Password is required.");
//   }

//   res.status(200).send("User was succesfully uploaded");
// });

app.put("/", (req, res) => {
  res.send("Put request");
});

app.delete("/", (req, res) => {
  res.send("Delete request");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
