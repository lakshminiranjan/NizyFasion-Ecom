import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { populate } from "dotenv";
import { User } from "../models/user.model.js";
export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file || !req.file.length === 0) {
      return res.status(400).json({ message: "Product image is required" });
    }

    if (req.files.length > 5) {
      return res.status(400).json({ message: "Maximum 5 images are allowed" });
    }

    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path, { folder: 'products' }));
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls
    })
    return res.status(201).json({ message: "Product created successfully", product });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getAllProducts(_, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category
    }, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ message: "Maximum 5 images are allowed" });
      }

      const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path, { folder: 'products' }));
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map(result => result.secure_url);
      product.images = imageUrls;

    }
    await product.save();

    return res.status(200).json({ message: "Product updated successfully", product });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllOrders(_, res) {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('orderItems.product').sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;

    if (status === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    await order.save();
    return res.status(200).json({ message: "Order status updated successfully", order });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().select('name email imageUrl addresses wishlist createdAt').sort({ createdAt: -1 });
    return res.status(200).json({ customers });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult[0] ? revenueResult[0].totalRevenue : 0;
    return res.status(200).json({ totalProducts, totalOrders, totalCustomers, totalRevenue });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}