import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import doctorRoutes from "./routes/doctor.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
