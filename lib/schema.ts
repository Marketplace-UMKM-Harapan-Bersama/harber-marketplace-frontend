import { z } from "zod";

export const roleEnum = z.enum(["customer", "seller", "admin"]);
export type Role = z.infer<typeof roleEnum>;

const baseUserSchema = {
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  role: roleEnum,
};

const sellerSchema = {
  shop_name: z
    .string()
    .min(2, {
      message: "Shop name must be at least 2 characters.",
    })
    .optional(),
  shop_url: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
  shop_description: z.string().optional(),
};

export const signUpSchema = z
  .object({
    ...baseUserSchema,
    ...sellerSchema,
  })
  .transform((data) => ({
    ...data,
    role: data.role ?? "customer",
    // Only include seller fields if role is seller
    ...(data.role === "seller"
      ? {
          shop_name: data.shop_name,
          shop_url: data.shop_url,
          shop_description: data.shop_description,
        }
      : {}),
  }));

export const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
