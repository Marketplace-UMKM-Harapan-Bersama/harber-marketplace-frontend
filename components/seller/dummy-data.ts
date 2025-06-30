export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  categoryId: string;
  isSync: boolean;
  lastSyncAt?: string;
  status: "active" | "inactive";
  image?: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  isSync: boolean;
  lastSyncAt?: string;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    sku: string;
  }>;
  totalAmount: number;
  shippingCost: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "completed";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  trackingNumber?: string;
  courier?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  shippingAddress: string;
  courier?: string;
  trackingNumber?: string;
  status: "pending" | "picked_up" | "in_transit" | "delivered";
  createdAt: string;
  estimatedDelivery?: string;
}

export interface DashboardStats {
  totalProducts: number;
  syncedProducts: number;
  totalCategories: number;
  syncedCategories: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalViews: number;
}

// Dummy Categories
export const dummyCategories: Category[] = [
  {
    id: "1",
    name: "Elektronik",
    slug: "elektronik",
    description: "Produk elektronik dan gadget",
    productCount: 15,
    isSync: true,
    lastSyncAt: "2024-01-15T10:30:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Pakaian dan aksesoris",
    productCount: 23,
    isSync: true,
    lastSyncAt: "2024-01-14T15:20:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Makanan & Minuman",
    slug: "makanan-minuman",
    description: "Produk makanan dan minuman",
    productCount: 8,
    isSync: false,
    status: "active",
  },
  {
    id: "4",
    name: "Kesehatan & Kecantikan",
    slug: "kesehatan-kecantikan",
    description: "Produk kesehatan dan kecantikan",
    productCount: 12,
    isSync: true,
    lastSyncAt: "2024-01-13T09:15:00Z",
    status: "active",
  },
  {
    id: "5",
    name: "Olahraga",
    slug: "olahraga",
    description: "Peralatan dan perlengkapan olahraga",
    productCount: 6,
    isSync: false,
    status: "inactive",
  },
];

// Dummy Products
export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Samsung Galaxy A54",
    sku: "SMSG-A54-001",
    price: 4500000,
    stock: 25,
    category: "Elektronik",
    categoryId: "1",
    isSync: true,
    lastSyncAt: "2024-01-15T10:30:00Z",
    status: "active",
    description: "Smartphone dengan kamera 50MP dan layar 6.4 inch",
  },
  {
    id: "2",
    name: "Kemeja Batik Pria",
    sku: "BTK-PRA-001",
    price: 150000,
    stock: 50,
    category: "Fashion",
    categoryId: "2",
    isSync: true,
    lastSyncAt: "2024-01-14T15:20:00Z",
    status: "active",
    description: "Kemeja batik premium untuk pria",
  },
  {
    id: "3",
    name: "Kopi Arabica Premium",
    sku: "KPI-ARB-001",
    price: 85000,
    stock: 100,
    category: "Makanan & Minuman",
    categoryId: "3",
    isSync: false,
    status: "active",
    description: "Kopi arabica premium dari pegunungan Jawa",
  },
  {
    id: "4",
    name: "Serum Vitamin C",
    sku: "SRM-VTC-001",
    price: 120000,
    stock: 30,
    category: "Kesehatan & Kecantikan",
    categoryId: "4",
    isSync: true,
    lastSyncAt: "2024-01-13T09:15:00Z",
    status: "active",
    description: "Serum wajah dengan vitamin C untuk kulit cerah",
  },
  {
    id: "5",
    name: "Sepatu Running Nike",
    sku: "SPT-NKE-001",
    price: 1200000,
    stock: 15,
    category: "Olahraga",
    categoryId: "5",
    isSync: false,
    status: "active",
    description: "Sepatu running dengan teknologi Air Max",
  },
  {
    id: "6",
    name: "Laptop ASUS VivoBook",
    sku: "LPT-ASS-001",
    price: 8500000,
    stock: 8,
    category: "Elektronik",
    categoryId: "1",
    isSync: true,
    lastSyncAt: "2024-01-15T08:45:00Z",
    status: "active",
    description: "Laptop dengan processor Intel i5 dan RAM 8GB",
  },
  {
    id: "7",
    name: "Dress Wanita Casual",
    sku: "DRS-WNT-001",
    price: 200000,
    stock: 35,
    category: "Fashion",
    categoryId: "2",
    isSync: true,
    lastSyncAt: "2024-01-14T12:30:00Z",
    status: "active",
    description: "Dress casual untuk wanita dengan bahan katun",
  },
];

// Dummy Orders
export const dummyOrders: Order[] = [
  {
    id: "1",
    orderNumber: "MP-2024-001",
    customerName: "Budi Santoso",
    customerEmail: "budi@email.com",
    customerPhone: "081234567890",
    products: [
      {
        id: "1",
        name: "Smartphone Samsung Galaxy A54",
        quantity: 1,
        price: 4500000,
        sku: "SMSG-A54-001",
      },
    ],
    totalAmount: 4500000,
    shippingCost: 25000,
    status: "pending",
    paymentStatus: "paid",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    shippingAddress: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123",
      city: "Jakarta",
      province: "DKI Jakarta",
      postalCode: "12345",
    },
  },
  {
    id: "2",
    orderNumber: "MP-2024-002",
    customerName: "Siti Nurhaliza",
    customerEmail: "siti@email.com",
    customerPhone: "081234567891",
    products: [
      {
        id: "2",
        name: "Kemeja Batik Pria",
        quantity: 2,
        price: 150000,
        sku: "BTK-PRA-001",
      },
      {
        id: "4",
        name: "Serum Vitamin C",
        quantity: 1,
        price: 120000,
        sku: "SRM-VTC-001",
      },
    ],
    totalAmount: 420000,
    shippingCost: 15000,
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2024-01-14T15:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    shippingAddress: {
      name: "Siti Nurhaliza",
      phone: "081234567891",
      address: "Jl. Sudirman No. 456",
      city: "Bandung",
      province: "Jawa Barat",
      postalCode: "40123",
    },
  },
  {
    id: "3",
    orderNumber: "MP-2024-003",
    customerName: "Ahmat Fauzi",
    customerEmail: "fauzi@email.com",
    customerPhone: "081234567892",
    products: [
      {
        id: "6",
        name: "Laptop ASUS VivoBook",
        quantity: 1,
        price: 8500000,
        sku: "LPT-ASS-001",
      },
    ],
    totalAmount: 8500000,
    shippingCost: 50000,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    shippingAddress: {
      name: "Ahmat Fauzi",
      phone: "081234567892",
      address: "Jl. Diponegoro No. 789",
      city: "Surabaya",
      province: "Jawa Timur",
      postalCode: "60123",
    },
    trackingNumber: "JNE123456789",
    courier: "jne",
  },
];

// Dummy Shipments
export const dummyShipments: Shipment[] = [
  {
    id: "1",
    orderId: "3",
    orderNumber: "MP-2024-003",
    customerName: "Ahmat Fauzi",
    shippingAddress: "Jl. Diponegoro No. 789, Surabaya, Jawa Timur",
    courier: "jne",
    trackingNumber: "JNE123456789",
    status: "in_transit",
    createdAt: "2024-01-14T14:30:00Z",
    estimatedDelivery: "2024-01-16T17:00:00Z",
  },
  {
    id: "2",
    orderId: "2",
    orderNumber: "MP-2024-002",
    customerName: "Siti Nurhaliza",
    shippingAddress: "Jl. Sudirman No. 456, Bandung, Jawa Barat",
    status: "pending",
    createdAt: "2024-01-15T09:15:00Z",
  },
];

// Dummy Dashboard Stats
export const dummyDashboardStats: DashboardStats = {
  totalProducts: 7,
  syncedProducts: 5,
  totalCategories: 5,
  syncedCategories: 3,
  totalOrders: 3,
  pendingOrders: 1,
  processingOrders: 1,
  shippedOrders: 1,
  completedOrders: 0,
  totalRevenue: 13420000,
  monthlyRevenue: 13420000,
  totalViews: 2847,
};
