import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Nom trop court."),
  order: z.coerce.number().int().optional().default(0),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const menuItemFormSchema = z.object({
  name: z.string().min(2, "Nom trop court."),
  description: z.string().min(5, "Description trop courte."),
  price: z.coerce.number().int().min(0, "Prix invalide."),
  image: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  categoryId: z.string().min(1, "Catégorie requise."),
  available: z.boolean().optional(),
  order: z.coerce.number().int().optional().default(0),
});

export type MenuItemFormInput = z.infer<typeof menuItemFormSchema>;

export const cartItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().min(1).max(20),
});

export const placeOrderSchema = z.object({
  tableNumber: z.coerce.number().int().min(1).max(999),
  note: z.string().max(300).optional(),
  items: z.array(cartItemSchema).min(1, "Le panier est vide."),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
