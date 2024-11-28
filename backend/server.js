import db from "./connection.js";
import express from "express";
import cors from "cors";
const app = express();
const port = 8080;

let collection = await db.collection("test");

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.get("/", (req, res) => {
    console.log("Hello World");
    res.send("Hi");
})

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
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})