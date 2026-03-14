import { z } from "zod";

export const CreateOrderSchema = z.object({
  body: z.object({
    numeroPedido: z.string().min(1, "Order number is required"),
    valorTotal: z.number().positive(),
    dataCriacao: z.iso.datetime(), // Validates ISO 8601 strings
    items: z
      .array(
        z.object({
          idItem: z.string(),
          quantidadeItem: z.number().int().positive(),
          valorItem: z.number().positive(),
        }),
      )
      .nonempty(),
  }),
});

// This is for TypeScript knowing exactly what the 'Portuguese' data looks like
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];
