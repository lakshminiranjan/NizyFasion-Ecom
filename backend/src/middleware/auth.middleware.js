import { requireAuth } from '@clerk/express';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.js';

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

      let user = await User.findOne({ clerkId });

      // If user doesn't exist, create them
      if (!user) {
        const clerkUser = req.user;
        user = await User.create({
          clerkId,
          name: clerkUser?.fullName || clerkUser?.firstName || "User",
          email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
          imageUrl: clerkUser?.imageUrl || ""
        });
      }

      req.user = user;
      next();
    }
    catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
];


export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}