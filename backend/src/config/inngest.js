import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "Nizy Fasion E-commerce App" });

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;
    const newUser = new User({
      name: `${first_name || ''} ${last_name || ''}` || 'User',
      email: email_addresses[0]?.email_address,
      imageUrl: profile_image_url,
      clerkId: id,
      addresses: [],
      wishlist: [],
    });
    await User.create(newUser);
  }
);

const deleteUserfromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await connectDB();
    
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserfromDB];
