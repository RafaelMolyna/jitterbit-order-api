import type { Request, Response } from "express";
import { Order } from "../models/Order.js";
import {
  mapOrderToPortuguese,
  mapPortugueseToOrder,
} from "../utils/orderMapper.js";
import { type CreateOrderInput } from "../utils/orderValidation.js";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderInput>,
  res: Response,
) => {
  try {
    const { valorTotal, items } = req.body;

    // Calculate the sum of items
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + item.quantidadeItem * item.valorItem;
    }, 0);

    // Strict Validation: Check if the client's total matches our calculation
    // Use Math.abs and a tiny epsilon (0.01) to account for rounding difference
    if (Math.abs(calculatedTotal - valorTotal) > 0.01) {
      return res.status(400).json({
        message:
          "Validation failed: Total value does not match the sum of items",
        details: {
          provided: valorTotal,
          calculated: Number(calculatedTotal.toFixed(2)),
        },
      });
    }

    // Transformation:
    const orderData = mapPortugueseToOrder(req.body, calculatedTotal);
    const newOrder = new Order(orderData);

    // Save the order
    await newOrder.save();

    // Return the Portuguese contract
    res.status(201).json(mapOrderToPortuguese(newOrder));
  } catch (error: any) {
    // Handle duplicate orderId (MongoDB unique index error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Order ID already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Math.max(Number(req.query.pageNumber), 1) || 1;

    const documentCount = await Order.countDocuments();
    const totalPages = Math.ceil(documentCount / pageSize);
    const skipAmount = (Math.min(pageNumber, totalPages || 1) - 1) * pageSize;

    // Query the database
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // newest orders at the top
      .limit(pageSize)
      .skip(skipAmount);

    // 200 OK is standard for a successful GET
    res.status(200).json({
      pagination: {
        totalPages,
        pageNumber,
        pageSize,
      },
      data: orders.map(mapOrderToPortuguese),
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const getOrderById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params; // Cleaner extraction
    const order = await Order.findOne({ orderId: id });

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with id '${id}' not found` });
    }

    res.status(200).json(mapOrderToPortuguese(order));
  } catch (error: any) {
    res.status(500).json({
      message: `Error fetching order with id: ${req.params.id}`,
      error: error.message,
    });
  }
};

export const updateOrder = async (
  req: Request<{ id: string }, {}, CreateOrderInput>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { valorTotal, items } = req.body;

    // Calculate the new total (Logic reuse!)
    const calculatedTotal = items.reduce(
      (sum, item) => sum + item.quantidadeItem * item.valorItem,
      0,
    );

    // Strict Validation (Same as Create)
    if (Math.abs(calculatedTotal - valorTotal) > 0.01) {
      return res.status(400).json({
        message:
          "Validation failed: Total value does not match the sum of items",
        details: {
          provided: valorTotal,
          calculated: Number(calculatedTotal.toFixed(2)),
        },
      });
    }

    // Update the Database
    // { new: true } returns the document AFTER the update is applied
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      mapPortugueseToOrder(req.body, calculatedTotal),
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: `Order with id '${id}' not found` });
    }

    // 4. Return translated version
    return res.status(200).json(mapOrderToPortuguese(updatedOrder));
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

export const deleteOrder = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params; // Cleaner extraction
    const result = await Order.deleteOne({ orderId: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: `Order with id '${id}' not found` });
    }

    res.status(200).json({ message: `Order with id '${id}' deleted` });
  } catch (error: any) {
    res.status(500).json({
      message: `Error deleting order with id: ${req.params.id}`,
      error: error.message,
    });
  }
};
