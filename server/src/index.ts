import express, {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import authRoutes from "./routes/auth.routes";
import leaveRoutes from "./routes/leave.routes";
import { ApiError } from "./utils/ApiError";

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Simple rate limiting implementation
const requestCounts: { [key: string]: { count: number; resetTime: number } } =
  {};

// Rate limiting function
function checkRateLimit(req: Request): boolean {
  const ip = req.ip || "0.0.0.0";
  const path = req.path;
  const key = `${ip}:${path}`;
  const now = Date.now();

  // Reset counts if it's been more than 1 minute
  if (!requestCounts[key] || requestCounts[key].resetTime < now) {
    requestCounts[key] = { count: 0, resetTime: now + 60 * 1000 };
  }

  requestCounts[key].count += 1;

  // Limit to 15 requests per minute per path
  return requestCounts[key].count <= 15;
}

// Apply rate limiting to API routes
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  if (!checkRateLimit(req)) {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
    });
    return;
  }
  next();
});

// CORS configuration with specific options
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Global error handling middleware - Express recognizes error middleware by the 4 arguments
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
