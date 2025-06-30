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
