import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  listOrders,
  updateOrder,
} from "../controllers/orderController.js";
import { CreateOrderSchema } from "../utils/orderValidation.js";
import { validate } from "./../middlewares/validateResource.js";

const router = Router();

router.post("/", validate(CreateOrderSchema), createOrder);
router.post("/", createOrder); // Add new order
router.get("/list", listOrders); // List orders
router.get("/:id", getOrderById); // Get single Order
router.put("/:id", updateOrder); // Update single Order
router.delete("/:id", deleteOrder); // Delete single Order

export default router;
