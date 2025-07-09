import type { Order, OrderDetail, OrderItem, OrderCustomer } from "./types";

// Dummy products data
const dummyProducts = [
  { id: 1, name: "Kemeja Batik Premium", price: 250000 },
  { id: 2, name: "Celana Jeans Slim Fit", price: 180000 },
  { id: 3, name: "Sepatu Sneakers Canvas", price: 320000 },
  { id: 4, name: "Tas Ransel Laptop", price: 450000 },
  { id: 5, name: "Jaket Hoodie Cotton", price: 275000 },
  { id: 6, name: "Kaos Polos Premium", price: 85000 },
  { id: 7, name: "Topi Baseball Cap", price: 95000 },
  { id: 8, name: "Dompet Kulit Asli", price: 165000 },
  { id: 9, name: "Jam Tangan Digital", price: 380000 },
  { id: 10, name: "Kacamata Sunglasses", price: 220000 },
];

// Dummy customers data
const dummyCustomers: OrderCustomer[] = [
  {
    id: 1,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    phone: "081234567890",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti.nur@email.com",
    phone: "081234567891",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "081234567892",
  },
  {
    id: 4,
    name: "Maya Sari",
    email: "maya.sari@email.com",
    phone: "081234567893",
  },
  {
    id: 5,
    name: "Dedi Kurniawan",
    email: "dedi.kurnia@email.com",
    phone: "081234567894",
  },
  {
    id: 6,
    name: "Rina Wati",
    email: "rina.wati@email.com",
    phone: "081234567895",
  },
  {
    id: 7,
    name: "Eko Prasetyo",
    email: "eko.prasetyo@email.com",
    phone: "081234567896",
  },
  {
    id: 8,
    name: "Lina Marlina",
    email: "lina.marlina@email.com",
    phone: "081234567897",
  },
];

// Generate dummy order items
function generateOrderItems(
  count: number = Math.floor(Math.random() * 3) + 1
): OrderItem[] {
  const items: OrderItem[] = [];
  const usedProducts = new Set<number>();

  for (let i = 0; i < count; i++) {
    let product;
    do {
      product = dummyProducts[Math.floor(Math.random() * dummyProducts.length)];
    } while (usedProducts.has(product.id));

    usedProducts.add(product.id);

    const quantity = Math.floor(Math.random() * 3) + 1;
    items.push({
      id: i + 1,
      product_id: product.id,
      product_name: product.name,
      quantity,
      price: product.price,
      total: product.price * quantity,
    });
  }

  return items;
}

// Generate dummy orders
function generateDummyOrders(): Order[] {
  const orders: Order[] = [];
  const statuses: Order["status"][] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "completed",
  ];
  const couriers = ["JNE", "TIKI", "POS", "J&T", "SiCepat"];

  for (let i = 1; i <= 25; i++) {
    const items = generateOrderItems();
    const customer =
      dummyCustomers[Math.floor(Math.random() * dummyCustomers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const shippingCost = Math.floor(Math.random() * 50000) + 10000;

    const order: Order = {
      id: i,
      order_number: `ORD-${String(i).padStart(6, "0")}`,
      user_id: customer.id,
      seller_id: 1,
      total_amount: totalAmount,
      shipping_cost: shippingCost,
      payment_method: Math.random() > 0.5 ? "bank_transfer" : "e_wallet",
      status,
      shipping_address: `Jl. Contoh No. ${i}, RT.0${
        Math.floor(Math.random() * 9) + 1
      }/RW.0${
        Math.floor(Math.random() * 9) + 1
      }, Kelurahan Contoh, Kecamatan Contoh, Jakarta Selatan, DKI Jakarta 12345`,
      shipping_city: "Jakarta Selatan",
      shipping_province: "DKI Jakarta",
      shipping_postal_code: "12345",
      tracking_number:
        status === "shipped" || status === "delivered" || status === "completed"
          ? `${
              couriers[Math.floor(Math.random() * couriers.length)]
            }${Math.random().toString().substr(2, 10)}`
          : undefined,
      courier:
        status === "shipped" || status === "delivered" || status === "completed"
          ? couriers[Math.floor(Math.random() * couriers.length)]
          : undefined,
      notes: Math.random() > 0.7 ? "Mohon dikemas dengan rapi" : undefined,
      created_at: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
      customer,
      items,
    };

    orders.push(order);
  }

  return orders.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export const dummyOrders = generateDummyOrders();

// Generate dummy order details
export function getDummyOrderDetail(id: number): OrderDetail | null {
  const order = dummyOrders.find((o) => o.id === id);
  if (!order) return null;

  return {
    id: order.id,
    total: order.total_amount,
    shipping_address: order.shipping_address,
    order_items: order.items || [],
  };
}

// Get order stats from dummy data
export function getDummyOrderStats() {
  const stats = {
    total: dummyOrders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0,
  };

  dummyOrders.forEach((order) => {
    stats[order.status]++;
  });

  return stats;
}
