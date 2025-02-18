import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import fs from 'fs';
import pkg from "pg";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import pdfParse from 'pdf-parse';
import { pipeline } from '@xenova/transformers';

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

    
// // Ensure `uploads/` directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({  storage });

// Serve static files from `uploads/`
app.use("/uploads", express.static(uploadDir));


app.use(cors());
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Akshay2407@", // Replace with your actual password
    port: 5432,
});



  // **Get Group Members**
app.get('/group-members/:groupId', async (req, res) => {
    try {
      const { groupId } = req.params;
      const result = await pool.query('SELECT username, email FROM users WHERE group_id = $1', [groupId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching group members:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// Get active groups with member count
// Get active groups with their primary domain and member count
app.get('/active-groups/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        // Fetch primary domain from groups table
        const groupResult = await pool.query(
            'SELECT primary_domain FROM groups WHERE group_id = $1',
            [groupId]
        );

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const primaryDomain = groupResult.rows[0].primary_domain;

        // Fetch member count using existing group-members route
        const membersResult = await pool.query(
            'SELECT COUNT(*) as member_count FROM users WHERE group_id = $1',
            [groupId]
        );

        const memberCount = membersResult.rows[0].member_count;

        res.json({
            primary_domain: primaryDomain,
            member_count: memberCount
        });

    } catch (error) {
        console.error('Error fetching group data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Get user profile information
app.get('/user-profile/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query(
            'SELECT username, email,group_id, preferred_study_time, year_of_study,rating FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
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

//Function to summarize text

async function summarizeText(text) {
    try {
        // Summarize the text
        const summarizer = await pipeline('summarization', 'Xenova/bart-large-cnn');
        const summary = await summarizer(text, { max_length: 150, min_length: 50 });
        return summary[0].summary_text;
    } catch (error) {
        console.error('Error summarizing text:', error);
        return 'Summary generation failed.';
    }
}

app.get("/group-preferred-study-time/:email", async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Get the user's group_id using their email
        const groupResult = await pool.query(
            "SELECT group_id FROM users WHERE email = $1",
            [userEmail]
        );

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const groupId = groupResult.rows[0].group_id;

        // Count occurrences of each preferred_study_time in the same group
        const studyTimeResult = await pool.query(
            `SELECT preferred_study_time, COUNT(*) as count
             FROM users
             WHERE group_id = $1
             GROUP BY preferred_study_time
             ORDER BY count DESC
             LIMIT 1`,
            [groupId]
        );

        if (studyTimeResult.rows.length === 0) {
            return res.status(404).json({ error: "No preferred study time found" });
        }

        const preferredStudyTime = studyTimeResult.rows[0].preferred_study_time;

        res.json({ preferredStudyTime });
    } catch (error) {
        console.error("Error fetching preferred study time:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: 'File not uploaded' });

//         const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
//         const { group, sender } = req.body;
//         let summary = null;
//         console.log('Uploaded file:', req.file.path);

//         // If the uploaded file is a PDF, extract and summarize the text
//         if (req.file.mimetype === 'application/pdf') {
//             const pdfPath = path.resolve(req.file.path); // Ensure correct path
//             console.log('Checking if file exists:', req.file.path);
//             if (!fs.existsSync(pdfPath)) {
//                 return res.status(400).json({ error: 'Uploaded file not found' });
//             }
//             const pdfData = await pdfParse(fs.readFileSync(pdfPath));
//             const extractedText = pdfData.text;
//             if (extractedText.length > 50) {
//                 summary = await summarizeText(extractedText);
//             }
//         }

//         // Insert into database
//         await pool.query(
//             'INSERT INTO messages (group_id, sender, message, summary) VALUES ($1, $2, $3, $4)',
//             [group, sender, fileUrl, summary]
//         );

//         // Emit the message to the group
//         const newMessage = { groupId: group, sender, message: fileUrl, summary };
//         io.to(group).emit("message", newMessage);  // Notify frontend in real-time

//         res.json({ fileUrl, summary });
//     } catch (error) {
//         console.error('File upload error:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });


// ✅ **Update Profile & Assign Group Automatically**

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File not uploaded' });

        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        const { group, sender } = req.body;
        if (!group || !sender) return res.status(400).json({ error: 'Missing group or sender' });

        let summary = null;
        const createdAt = new Date().toISOString();

        // Save initial message without summary
        const insertResult = await pool.query(
            'INSERT INTO messages (group_id, sender, message, summary, created_at) VALUES ($1, $2, $3, NULL, $4) RETURNING id',
            [group, sender, fileUrl, createdAt]
        );

        const messageId = insertResult.rows[0].id;

        // Emit message immediately (without summary)
        const newMessage = { id: messageId, groupId: group, sender, message: fileUrl, summary: null, created_at: createdAt };
        io.to(group).emit("message", newMessage);

        // If it's a PDF, process asynchronously
        if (req.file.mimetype === 'application/pdf') {
            setTimeout(async () => {
                try {
                    const pdfData = await pdfParse(fs.readFileSync(req.file.path));
                    const extractedText = pdfData.text;
                    if (extractedText.length > 50) {
                        summary = await summarizeText(extractedText);
                    }

                    // Update database with summary
                    await pool.query('UPDATE messages SET summary = $1 WHERE id = $2', [summary, messageId]);

                    // Emit updated message with summary
                    io.to(group).emit("message", { ...newMessage, summary });

                } catch (error) {
                    console.error("Error processing PDF:", error);
                }
            }, 500);
        }

        res.json({ fileUrl });

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put("/update-profile", async (req, res) => {
    const { email, primaryDomain, studyTime, year, groupSize } = req.body;

    try {
        // Fetch user info
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if a group exists for the primary domain
        let groupResult = await pool.query("SELECT group_id FROM groups WHERE primary_domain = $1", [primaryDomain]);

        let groupId;
        if (groupResult.rows.length > 0) {
            // Group exists, get the group ID
            groupId = groupResult.rows[0].group_id;
        } else {
            // No group exists, create a new one
            groupId = uuidv4();
            await pool.query("INSERT INTO groups (group_id, primary_domain) VALUES ($1, $2)", [groupId, primaryDomain]);
            console.log(`New group created: ${groupId} for ${primaryDomain}`);
        }

        // Update user profile and assign group ID
        const result = await pool.query(
            `UPDATE users 
            SET primary_domain = $1, preferred_study_time = $2, year_of_study = $3, group_size_prefrence = $4, group_id = $5
            WHERE email = $6 RETURNING *`,
            [primaryDomain, studyTime, year, groupSize, groupId, email]
        );

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
// io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("joinGroup", (groupId) => {
//         socket.join(groupId);
//         console.log(`User joined group ${groupId}`);
//     });

//     socket.on("sendMessage", async ({ groupId, sender, message }) => {
//         try {
//             await pool.query(
//                 "INSERT INTO messages (group_id, sender, message, created_at) VALUES ($1, $2, $3, NOW())",
//                 [groupId, sender, message]
//             );
//             io.to(groupId).emit("message", { sender, message });
//         } catch (error) {
//             console.error("Error saving message:", error);
//         }
//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });



io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Joining a group
    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`User joined group ${groupId}`);
    });

    // Sending a message
    socket.on("sendMessage", async ({ groupId, sender, message }) => {
        if (!groupId || !sender || !message) return;

        try {
            const createdAt = new Date().toISOString();

            // Store message in DB
            const insertResult = await pool.query(
                "INSERT INTO messages (group_id, sender, message, created_at) VALUES ($1, $2, $3, $4) RETURNING id",
                [groupId, sender, message, createdAt]
            );

            const messageId = insertResult.rows[0].id;
            const newMessage = { id: messageId, groupId, sender, message, summary: null, created_at: createdAt };

            // Emit message to all in group
            io.to(groupId).emit("message", newMessage);

        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // User disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


// Fetch 10 quiz questions based on the user's primary domain
app.get('/get-quiz/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        // Get user's primary domain
        const userQuery = await pool.query('SELECT primary_domain FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        
        const userDomain = userQuery.rows[0].primary_domain;
        
        // Fetch 10 random quiz questions for that domain
        const quizQuery = await pool.query(
            'SELECT id, question, option_a, option_b, option_c, option_d,correct_option FROM quiz_questions WHERE domain = $1 ORDER BY RANDOM() LIMIT 10',
            [userDomain]
        );
        
        res.json(quizQuery.rows);
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Submit quiz and update user rating
app.post("/submit-quiz", async (req, res) => {
    try {
        console.log("Request body received:", req.body);

        const { email, answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid answers format" });
        }

        // Fetch correct answers and corresponding options
        const questionIds = answers.map(a => a.questionId);
        const correctAnswersQuery = await pool.query(
            "SELECT id, correct_option FROM quiz_questions WHERE id = ANY($1)",
            [questionIds]
        );

        const correctAnswers = correctAnswersQuery.rows.reduce((acc, row) => {
            acc[row.id] = row.correct_option; // Store only correct option (A, B, C, or D)
            return acc;
        }, {});

        // Calculate score (5 points per correct answer)
        let score = 0;
        answers.forEach(({ questionId, selectedOption }) => {
            if (correctAnswers[questionId] === selectedOption) {
                score += 5;
            }
        });

        // Update user's rating
        await pool.query("UPDATE users SET rating = rating + $1 WHERE email = $2", [score, email]);

        res.json({ message: "Quiz submitted successfully", score });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



const PORT =  5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
