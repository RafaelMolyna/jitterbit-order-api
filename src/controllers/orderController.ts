import type { Request, Response } from "express";
import { Order } from "../models/Order.js";
import { type CreateOrderInput } from "../utils/orderValidation.js";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderInput>,
  res: Response,
) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

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

    // If it passes, save the order
    const newOrder = new Order({
      orderId: numeroPedido,
      value: calculatedTotal,
      creationDate: new Date(dataCriacao),
      items: items.map((item) => ({
        productId: item.idItem,
        quantity: item.quantidadeItem,
        price: item.valorItem,
      })),
    });

    // Save the order
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    // Handle duplicate orderId (MongoDB unique index error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Order ID already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrderById = (req: Request, res: Response) => {
  const { id } = req.params;
  // 200 OK is standard for a successful GET
  res
    .status(200)
    .json({ message: `Mock: Get order endpoint hit for ID: ${id}` });
};

export const listOrders = (req: Request, res: Response) => {
  res.status(200).json({ message: "Mock: List all orders endpoint hit" });
};

export const updateOrder = (req: Request, res: Response) => {
  const { id } = req.params;
  res
    .status(200)
    .json({ message: `Mock: Update order endpoint hit for ID: ${id}` });
};

export const deleteOrder = (req: Request, res: Response) => {
  const { id } = req.params;
  // 200 OK or 204 No Content are standard for DELETE
  res
    .status(200)
    .json({ message: `Mock: Delete order endpoint hit for ID: ${id}` });
};
