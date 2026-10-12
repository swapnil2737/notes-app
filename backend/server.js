import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './config/database.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 6001;

// CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, uptime pingers)
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.endsWith(".tech")
        ) {
            return callback(null, true);
        }

        // Permissive fallback so testing domain changes won't be blocked
        return callback(null, true);
    },
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (for Render verification & ping monitors)
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Margin API is running" });
});

// Routes
app.use("/api/notes", notesRoutes);

// Database connectivity & start server
dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});


