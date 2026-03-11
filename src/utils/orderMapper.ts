import { IOrder } from "../models/Order.js";
import { CreateOrderInput } from "./orderValidation.js";

/**
 * Mappings for the Incoming Data (POST/PUT)
 * Portuguese (Client) -> English (Database)
 */
export const mapPortugueseToOrder = (
  input: CreateOrderInput,
  calculatedTotal: number,
) => {
  return {
    orderId: input.numeroPedido,
    value: calculatedTotal,
    creationDate: new Date(input.dataCriacao),
    items: input.items.map((item) => ({
      productId: item.idItem,
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
};

/**
 * Mappings for the Outgoing Data (GET)
 * English (Database) -> Portuguese (Client)
 */
export const mapOrderToPortuguese = (order: IOrder) => {
  return {
    numeroPedido: order.orderId,
    valorTotal: order.value,
    dataCriacao: order.creationDate,
    items: order.items.map((item) => ({
      idItem: item.productId,
      quantidadeItem: item.quantity,
      valorItem: item.price,
    })),
    // Optional: Include internal meta-data if needed for debugging
    meta: {
      id: order._id,
      criadoEm: (order as any).createdAt,
    },
  };
};
