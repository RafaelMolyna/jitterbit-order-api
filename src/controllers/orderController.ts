import type { Request, Response } from "express";

export const createOrder = (req: Request, res: Response) => {
  // 201 Created is the standard for a successful POST request
  res.status(201).json({ message: "Mock: Create order endpoint hit" });
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
