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
  phone_number: z
    .string()
    .min(10, {
      message: "Nomor telepon harus diisi minimal 10 digit.",
    })
    .optional(),
  address: z
    .string()
    .min(1, {
      message: "Alamat harus diisi.",
    })
    .optional(),
  city: z
    .string()
    .min(1, {
      message: "Kota harus diisi.",
    })
    .optional(),
  province: z
    .string()
    .min(1, {
      message: "Provinsi harus diisi.",
    })
    .optional(),
  postal_code: z
    .string()
    .min(6, {
      message: "Kode pos harus diisi minimal 6 digit.",
    })
    .optional(),
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
  shop_description: z
    .string()
    .min(10, {
      message: "Deskripsi toko harus diisi minimal 10 karakter.",
    })
    .optional(),
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
