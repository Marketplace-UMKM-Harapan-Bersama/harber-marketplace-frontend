export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  seller_product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  image_url: string;
  weight: number;
  is_active: boolean;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  seller_id: number;
  name: string;
  slug: string;
  parent_id: number;
  created_at: string;
  updated_at: string;
}
