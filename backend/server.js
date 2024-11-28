import db from "./connection.js";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
const port = 8080;

let collection = await db.collection("test");
let userCollection = await db.collection("users");
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false 
}));

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).send({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword };
        await userCollection.insertOne(user);

        res.status(200).send({ message: "User successfully registered" });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Error registering user" });
    }
})

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userCollection.findOne({ username });
        if (!user) {
            return res.status(401).send({ message: "Invalid Credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d"});

        res.status(200).send({ message: "Login Successful", token});
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Error logging in" });
    }
});

app.get("/protected", async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).send({ message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userCollection.findOne(
        { username: decoded.username },
        { projection: { password: 0 } }
      );
      res.send({ message: "Access granted", user });
    } catch (e) {
      res.status(401).send({ message: "Invalid token" });
    }
  });
  
app.post("/", async (req, res) => {
    try {
        let newDoc = {
            name: req.body.name
        };
        let result = await collection.insertOne(newDoc);
        res.send(result).status(201);
    } catch (e) {
        console.error(e);
        res.status(500).send("Error adding");
    }
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});