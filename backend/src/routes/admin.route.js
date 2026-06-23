import { Router } from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, deleteOrder, getAllCustomers, getDashboardStats } from '../controllers/admin.controller.js';
import { protectRoute, adminOnly } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.use(protectRoute, adminOnly);

router.post('/products', upload.array('images', 5), createProduct);
router.get('/products', getAllProducts);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.delete("/orders/:orderId", deleteOrder);

router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

export default router