import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express'
import { functions, inngest } from './config/inngest.js';
import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';
import orderRoutes from "./routes/order.route.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(clerkMiddleware())//register Clerk middleware to handle authentication
app.use("/api/inngest", serve({ client: inngest, functions }))//register Inngest middleware to handle incoming events
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

//make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
};

startServer();