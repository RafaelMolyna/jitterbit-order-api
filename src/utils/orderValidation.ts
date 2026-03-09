import { z } from "zod";

export const CreateOrderSchema = z.object({
  body: z.object({
    numeroPedido: z.string().min(1, "Order number is required"),
    valorTotal: z.number().positive(),
    dataCriacao: z.string().datetime({ offset: true }), // Validates ISO 8601 strings
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

// This helps TypeScript know exactly what the 'Portuguese' data looks like
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];
