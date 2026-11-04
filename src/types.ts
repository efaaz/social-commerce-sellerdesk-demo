import { StaticImageData } from "next/dist/shared/lib/image-external";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  createdAt: string;
};

export type ShopProfile = {
  id: string;
  shopeName: string;
  ownerName: string;
  logo: StaticImageData | null;
  facebookPage?: string;
};

export type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

export type DeliveryArea = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

export type DeliveryCharges = Record<DeliveryArea, number>;

export type OrderItem = {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  /** Absent on orders saved before delivery area selection was added. */
  deliveryArea?: DeliveryArea;
  /** The rate applied when this order was created. */
  deliveryCharge?: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type PageKey = "dashboard" | "products" | "orders" | "slips" | "settings";

export type ProductInput = Pick<
  Product,
  "name" | "sku" | "category" | "price" | "costPrice" | "stock"
>;

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  address: string;
  deliveryArea: DeliveryArea;
  items: Array<{ productId: string; quantity: number }>;
};

export type SellerDeskData = {
  products: Product[];
  orders: Order[];
  deliveryCharges: DeliveryCharges;
};
