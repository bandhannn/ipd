// import express from "express";
// import bodyParser from "body-parser";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Server } from "socket.io";
// import { createServer } from "http";

// dotenv.config();
// import pkg from 'pg';
// const { Pool } = pkg;


// const app = express();
// const server = createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(bodyParser.json());
// app.use(cors());

// // PostgreSQL connection setup
// const pool = new Pool({
//     user: "postgres", // PostgreSQL username
//     host: "localhost",
//     database: "postgres", // Your database name
//     password: "Akshay2407@", // PostgreSQL password
//     port: 5432,
// });

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(403).json({ message: "No token provided" });
//     }

//     jwt.verify(token, "your_secret_key", (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid token" });
//         }
//         req.user = user; // Attach the user info to the request
//         next();
//     });
// };

// // API to handle user signup
// app.post("/signup", async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const result = await pool.query(
//             "INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
//             [username, email, hashedPassword]
//         );

//         res.status(201).json({ 
//             message: "User registered successfully", 
//             user: result.rows[0] 
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error registering user" });
//     }
// });


// // API to handle user login
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         const user = result.rows[0];
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }
//         // Generate JWT
//         const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", { expiresIn: "1h" });
//         res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error logging in" });
//     }
// });

// // API to get the user info (requires authentication)
// app.get("/user-info", authenticateToken, async (req, res) => {
//     try {
//         const { email } = req.user; // Extract email from JWT token payload
//         const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json(result.rows[0]); // Return the user information
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching user information" });
//     }
// });

// app.put("/update-profile", async (req, res) => {
//     const { email, primaryDomain, studyTime, year, groupSize } = req.body;

//     try {
//         const result = await pool.query(
//             `UPDATE users 
//             SET primary_domain = $1, preferred_study_time = $2, year_of_study = $3, group_size_prefrence = $4
//             WHERE email = $5 RETURNING *`,
//             [primaryDomain, studyTime, year, groupSize, email]
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error updating profile" });
//     }
// });

// // Fetch user details
// app.get("/user/:email", async (req, res) => {
//     const { email } = req.params;
//     try {
//         const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching user" });
//     }
// });

// // Fetch user's chat groups
// app.get("/groups/:email", async (req, res) => {
//     const { email } = req.params;
//     try {
//         const user = await pool.query("SELECT primary_domain, rating FROM users WHERE email = $1", [email]);
//         if (!user.rows.length) return res.status(404).json({ message: "User not found" });
        
//         const { primary_domain, rating } = user.rows[0];
//         const groups = await pool.query(
//             "SELECT username FROM users WHERE primary_domain = $1 AND rating = $2", 
//             [primary_domain, rating]
//         );
//         res.json(groups.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching groups" });
//     }
// });

// // Real-time chat with Socket.io
// io.on("connection", (socket) => {
//     console.log("User connected: " + socket.id);

//     socket.on("join_room", (room) => {
//         socket.join(room);
//     });

//     socket.on("send_message", async ({ room, message, sender }) => {
//         await pool.query("INSERT INTO messages (room, sender, message) VALUES ($1, $2, $3)", [room, sender, message]);
//         io.to(room).emit("receive_message", { sender, message });
//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected: " + socket.id);
//     });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import pkg from "pg";
import multer from "multer";
import path from "path";

dotenv.config();
const { Pool } = pkg;

const app = express();
const server = createServer(app);
const io = new Server(server,
     { 
        cors: 
        { 
            origin: "http://localhost:5173",
            methods: ["GET", "POST"] 
        } 
    });

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      },
  });

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection setup
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Akshay2407@", // Replace with your actual password
    port: 5432,
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, "your_secret_key", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = user; // Attach user info to request
        next();
    });
};

// ✅ **Signup (unchanged)**
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// ✅ **Login (unchanged)**
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// ✅ **Get User Info (unchanged)**
app.get("/user-info", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user information" });
    }
});

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const { group, sender } = req.body;
    if (!sender) {
        return res.status(400).json({ message: "Sender is required" });
      }
    try {
        await pool.query("INSERT INTO messages (primary_domain, sender, message) VALUES ($1, $2, $3)", [group, sender, fileUrl]);
        res.json({ fileUrl });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
    }
    
  
    
  });

// ✅ **Update Profile (unchanged)**
app.put("/update-profile", async (req, res) => {
    const { email, primaryDomain, studyTime, year, groupSize } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
            SET primary_domain = $1, preferred_study_time = $2, year_of_study = $3, group_size_prefrence = $4
            WHERE email = $5 RETURNING *`,
            [primaryDomain, studyTime, year, groupSize, email]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// ✅ **Fetch User's Group ID**
app.get("/user-group/:email", async (req, res) => {
    const { email } = req.params;
    if(!email) return res.status(400).json({ message: "Email is required" });
    try {
        const result = await pool.query("SELECT group_id FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json({ groupId: result.rows[0].group_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user group" });
    }
});

// ✅ **Fetch Messages for a Group**
app.get("/chat/:groupId", async (req, res) => {
    const { groupId } = req.params;
    try {
        const messages = await pool.query(
            "SELECT sender, message, created_at FROM messages WHERE group_id = $1 ORDER BY created_at ASC",
            [groupId]
        );
        res.json(messages.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching messages" });
    }
});

// ✅ **Store Messages in Database**
app.post("/chat", async (req, res) => {
    const { groupId, sender, message } = req.body;
    try {
        if (!sender) {
            console.error("Sender is null or undefined");
            return;
        }
        await pool.query(
            "INSERT INTO messages (group_id, sender, message, created_at) VALUES ($1, $2, $3, NOW())",
            [groupId, sender, message]
        );
        io.to(groupId).emit("message", { sender, message });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving message" });
    }
});

// ✅ **Real-Time Chat with Socket.io**
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`User joined group ${groupId}`);
    });

    socket.on("sendMessage", async ({ groupId, sender, message }) => {
        try {
            await pool.query(
                "INSERT INTO messages (group_id, sender, message, created_at) VALUES ($1, $2, $3, NOW())",
                [groupId, sender, message]
            );
            io.to(groupId).emit("message", { sender, message });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
