import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const getProductImageUrl = (
  imageUrl: string | null | undefined,
  seller: { shop_url?: string | null } | null | undefined
): string => {
  const defaultImage = "/default-image.png";

  if (!imageUrl) {
    return defaultImage;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (seller?.shop_url) {
    const domain = seller.shop_url.endsWith("/")
      ? seller.shop_url.slice(0, -1)
      : seller.shop_url;
    return `${domain}/storage/${imageUrl}`;
  }

  return defaultImage;
};
