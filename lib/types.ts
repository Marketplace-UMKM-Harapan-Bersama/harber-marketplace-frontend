export interface Seller {
  id: number;
  shop_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
  seller?: Seller;
  parent_category?: {
    id: number;
    name: string;
  };
}

export interface Product {
  id: number;
  seller_id?: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url: string;
  weight?: number;
  is_active?: boolean;
  last_synced_at?: string;
  created_at?: string;
  updated_at?: string;
  seller?: Seller;
  category?: Category;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: Meta;
}

export interface SellerWithCategories {
  seller_id: number;
  shop_name: string;
  categories: Category[];
}

export interface SellerWithProducts {
  seller_id: number;
  shop_name: string;
  products: Product[];
}

// Order types
export interface OrderItem {
  product_id: number;
  price: number;
  quantity: number;
}

export interface Order {
  user_id: number;
  seller_id: number;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  items: OrderItem[];
}

export interface OrderResponse {
  message: string;
  orders: Order[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  role: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}
