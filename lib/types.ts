export interface Seller {
  id: number;
  shop_name: string;
  shop_url: string;
  shop_description: string;
}

export interface Category {
  id: number;
  seller_id: number | null;
  name: string;
  slug: string;
  parent_id: number | null;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  seller_product_id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  sku: string;
  image_url: string;
  weight: string;
  is_active: number;
  category: Category;
  seller: Seller;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
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
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface OrderDetail {
  id: number;
  user_id: number;
  seller_id: number;
  order_number: string;
  total_amount: string;
  shipping_cost: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderListItem {
  id: number;
  user_id: number;
  seller_id: number;
  order_number: string;
  total_amount: string;
  shipping_cost: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailResponse {
  data: OrderDetail;
}

export interface OrderListResponse {
  data: OrderListItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
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
  phone_number: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  message: string;
  data: User;
}

// Cart error types
export interface CartError {
  message: string;
  error_type: "different_seller" | "empty_cart" | "not_found";
  details?: Record<string, unknown>;
}

// Cart types
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export type CartResponse = PaginatedResponse<CartItem>;

export interface CheckoutResponse {
  message: string;
  order_id: number;
  snap_token: string;
  midtrans_redirect_url: string;
}
