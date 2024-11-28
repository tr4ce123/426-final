import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const client = new MongoClient(connectionString);
let conn;

try {
    conn = await client.connect();
    console.log("Successfully connected to MongoDB.");
} catch (e) {
    console.error("Connection error:", e);
    process.exit(1);
}
  
let db;
try {
    db = conn.db("426database");
} catch (e) {
    console.error("Database selection error:", e);
    process.exit(1);
}

export default db;
