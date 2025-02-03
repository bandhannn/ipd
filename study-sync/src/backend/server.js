import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const {Pool} = pkg
// PostgreSQL connection setup
const pool = new Pool({
    user: process.env.PG_USER || "postgres", 
    host: process.env.PG_HOST || "localhost", 
    database: process.env.PG_DB || "postgres", 
    password: process.env.PG_PASSWORD || "Akshay2407@" , 
    port: process.env.PG_PORT || 5432,
});

// API to handle user signup
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// API to handle user login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY || "your_secret_key", { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// CORS configuration (important for Vite-React development)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all domains
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
