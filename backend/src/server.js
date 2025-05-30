import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(
  cors({
    origin: "https://baatcheet-app-1.onrender.com",  // <-- your frontend origin here
    credentials: true,
  })
);


      // process.env.NODE_ENV === "production"
      //   ? "https://baatcheet-ym27.onrender.com"
      //   : "http://localhost:5173",

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);



// Connect DB first, then start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
}

startServer();
