import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./configs/initDb.js";
import { sendResponse } from "./utils/response.util.js";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import { seedDatabase } from "./configs/seeder.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);

app.get("/", (_req, res) => {
  sendResponse(res, {
    message: "API is working...",
  });
});

async function startServer() {
  await initializeDatabase();
  await seedDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
