import { User } from "../models/user.model.js"
export async function addAddress(req, res) {
  try {
    const { label, fullName, streetAddress, city, state, postalCode, phoneNumber, isDefault } = req.body;
    const user = req.user;

    if (isDefault) {
      user.address.forEach(addr => { addr.isDefault = false });
    }

    user.address.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumber,
      isDefault: isDefault || false
    })

    await user.save();

    res.status(201).json({ message: "Address added successfullly", address: user.address });
  }
  catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAddress(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ address: user.address });
  }
  catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function updateAddress(req, res) {
  try {
    const { label, fullName, streetAddress, city, state, postalCode, phoneNumber, isDefault } = req.body;
    const { addressId } = req.params
    const user = req.user
    const address = user.address.id(addressId)
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    if (isDefault) {
      user.address.forEach(addr => { addr.isDefault = false });
    }
    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();
    res.status(201).json({ message: "Address updated successfully", address: user.address });
  }
  catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params
    const user = req.user

    user.address.pull(addressId)
    await user.save();
    res.status(201).json({ message: "Address deleted successfully", address: user.address });
  }
  catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    // check if product is already in the wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in addToWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    // check if product is already in the wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product not found in wishlist" });
    }

    user.wishlist.pull(productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in removeFromWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWishlist(req, res) {
  try {
    // we're using populate, bc wishlist is just an array of product ids
    const user = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in getWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}