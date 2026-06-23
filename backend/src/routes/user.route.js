import { Router } from "express";
import { addAddress, getAddress, updateAddress, deleteAddress, addToWishlist, removeFromWishlist, getWishlist } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);
//address routes
router.post("/address", addAddress);
router.get("/address", getAddress);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);

//wishlist routes
router.post("/wishlist", addToWishlist)
router.delete("/wishlist/:productId", removeFromWishlist)
router.get("/wishlist", getWishlist)


export default router;