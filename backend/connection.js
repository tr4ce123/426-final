import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();


const connectionString = process.env.CONNECTION_STRING;
const client = new MongoClient(connectionString);

let conn;

try {
    conn = await client.connect();
} catch (e) {
    console.log(e);
}

let db = conn.db("426database");

export default db;