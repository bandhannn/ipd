import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;


const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection setup
const pool = new Pool({
    user: "postgres", // PostgreSQL username
    host: "localhost",
    database: "postgres", // Your database name
    password: "Akshay2407@", // PostgreSQL password
    port: 5432,
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, "your_secret_key", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user; // Attach the user info to the request
        next();
    });
};

// API to handle user signup
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            user: result.rows[0] 
        });

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
        const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// API to get the user info (requires authentication)
app.get("/user-info", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user; // Extract email from JWT token payload
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]); // Return the user information
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user information" });
    }
});

app.put("/update-profile", async (req, res) => {
    const { email, primaryDomain, studyTime, year, groupSize } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
            SET primary_domain = $1, preferred_study_time = $2, year_of_study = $3, group_size_prefrence = $4
            WHERE email = $5 RETURNING *`,
            [primaryDomain, studyTime, year, groupSize, email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Fetch user details
app.get("/user/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Fetch user's chat groups
app.get("/groups/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await pool.query("SELECT primary_domain, rating FROM users WHERE email = $1", [email]);
        if (!user.rows.length) return res.status(404).json({ message: "User not found" });
        
        const { primary_domain, rating } = user.rows[0];
        const groups = await pool.query(
            "SELECT username FROM users WHERE primary_domain = $1 AND rating = $2", 
            [primary_domain, rating]
        );
        res.json(groups.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching groups" });
    }
});

// Real-time chat with Socket.io
io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
    });

    socket.on("send_message", async ({ room, message, sender }) => {
        await pool.query("INSERT INTO messages (room, sender, message) VALUES ($1, $2, $3)", [room, sender, message]);
        io.to(room).emit("receive_message", { sender, message });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
