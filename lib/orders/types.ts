export interface OrderItem {
  id?: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
  total?: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    stock: number;
    sku: string;
    image_url: string;
    weight: string;
    is_active: number;
    seller_id: number;
    category_id: number;
    seller_product_id: string;
    last_synced_at: string;
    created_at: string;
    updated_at: string;
  };
}

export interface OrderCustomer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderSeller {
  id: number;
  shop_name: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  seller_id: number;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled";
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  tracking_number?: string;
  courier?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: OrderCustomer;
  seller?: OrderSeller;
  items?: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
  };
}

export interface OrderUpdateRequest {
  status?: string;
  tracking_number?: string;
  courier?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export interface OrderDetail {
  id: number;
  user_id: number;
  seller_id: number;
  order_number: string;
  total_amount: string | number;
  shipping_cost: string | number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  // Computed properties for backward compatibility
  total: number;
  order_items: OrderItem[];
}

export interface OrderDetailResponse {
  data?: OrderDetail;
  message?: string;
}

export interface ApiOrderResponse {
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
  tracking_number?: string;
  courier?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: OrderCustomer;
  seller?: OrderSeller;
  items?: OrderItem[];
  order_items?: OrderItem[];
}

export interface ApiOrdersResponse {
  data: ApiOrderResponse[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
  };
}

// Updated API response type to match actual response
export interface ApiOrderDetailResponse {
  data: {
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
    notes?: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
  };
}