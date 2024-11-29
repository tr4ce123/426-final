import db from "./connection.js";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
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

app.post("/catch-pokemon", async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        
        const pokemonCollection = await db.collection("pokemon");
        const userPokemonCollection = await db.collection("user_pokemon_catches");
        
        const lastCatch = await userPokemonCollection.findOne({ username });
        const currentTime = new Date();
        
        if (lastCatch && (currentTime - lastCatch.lastCatchTime) < 1 * 60 * 1000) {
            const remainingCooldown = Math.ceil((1 * 60 * 1000 - (currentTime - lastCatch.lastCatchTime)) / 1000);
            return res.status(429).send({ 
                message: "Cooldown is active", 
                cooldown: remainingCooldown 
            });
        }
        
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 898) + 1}`);
        const pokemonData = pokemonResponse.data;
        
        const pokemonToSave = {
            username,
            pokemonId: pokemonData.id,
            name: pokemonData.name,
            imageUrl: pokemonData.sprites.front_default,
            catchTimestamp: currentTime
        };
        
        await pokemonCollection.insertOne(pokemonToSave);
        
        await userPokemonCollection.updateOne(
            { username },
            { $set: { lastCatchTime: currentTime } },
            { upsert: true }
        );
        
        res.status(200).send({
            pokemon: {
                id: pokemonData.id,
                name: pokemonData.name,
                imageUrl: pokemonData.sprites.front_default
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error catching Pokemon" });
    }
});

app.get("/pokedex", async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        
        const pokemonCollection = await db.collection("pokemon");
        const userPokemon = await pokemonCollection.find({ username }).toArray();
        
        res.status(200).send({ pokedex: userPokemon });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching Pokedex" });
    }
});

app.get("/catch-cooldown", async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        
        const userPokemonCollection = await db.collection("user_pokemon_catches");
        
        const lastCatch = await userPokemonCollection.findOne({ username });
        
        if (!lastCatch) {
            return res.status(200).send({ cooldown: 0 });
        }
        
        const currentTime = new Date();
        const timeSinceLastCatch = currentTime - lastCatch.lastCatchTime;
        
        if (timeSinceLastCatch >= 1 * 60 * 1000) {
            return res.status(200).send({ cooldown: 0 });
        }
        
        const remainingCooldown = Math.ceil((1 * 60 * 1000 - timeSinceLastCatch) / 1000);
        
        res.status(200).send({ cooldown: remainingCooldown });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error checking cooldown" });
    }
});

app.get("/pokemon-details/:pokemonId", async (req, res) => {
    try {
        const { pokemonId } = req.params;
        
        const pokemonDetailsCollection = await db.collection("pokemon_details_cache");
        const cachedPokemon = await pokemonDetailsCollection.findOne({ id: parseInt(pokemonId) });
        
        if (cachedPokemon) {
            return res.status(200).send(cachedPokemon);
        }
        
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = pokemonResponse.data;
        
        const simplifiedPokemonData = {
            id: pokemonData.id,
            name: pokemonData.name,
            height: pokemonData.height,
            weight: pokemonData.weight,
            types: pokemonData.types.map(type => type.type.name),
            stats: pokemonData.stats.map(stat => ({
                name: stat.stat.name,
                base_stat: stat.base_stat
            })),
            sprites: {
                front_default: pokemonData.sprites.front_default,
                back_default: pokemonData.sprites.back_default
            }
        };
        
        await pokemonDetailsCollection.updateOne(
            { id: pokemonData.id },
            { $set: simplifiedPokemonData },
            { upsert: true }
        );
        
        res.status(200).send(simplifiedPokemonData);
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        res.status(500).send({ message: "Error fetching Pokemon details" });
    }
});