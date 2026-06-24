import { requireAuth, clerkClient } from '@clerk/express';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.js';

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId } = req.auth();
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      let user = await User.findOne({ clerkId: userId });

      // If user doesn't exist, create them
      if (!user) {
        try {
          const clerkUser = await clerkClient.users.getUser(userId);

          user = await User.create({
            clerkId: userId,
            name: clerkUser.firstName && clerkUser.lastName
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : clerkUser.firstName || clerkUser.username || "User",
            email: clerkUser.emailAddresses[0]?.emailAddress || `user_${userId}@temp.com`,
            imageUrl: clerkUser.imageUrl || ""
          });
        } catch (createErr) {
          console.error("Error creating user:", createErr);
          return res.status(500).json({ message: "Failed to create user account" });
        }
      }

      req.user = user;
      next();
    }
    catch (err) {
      console.error("Auth middleware error:", err);
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