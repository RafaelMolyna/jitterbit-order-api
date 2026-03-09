import { type Document, Schema, model } from "mongoose";

// TypeScript interfaces

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderId: string;
  value: number;
  creationDate: Date;
  items: IOrderItem[];
}

// Mongoose Schema

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", orderSchema);
