import {
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings2,
  ShoppingCart,
} from "lucide-react";
import type {
  DeliveryArea,
  DeliveryCharges,
  OrderStatus,
  PageKey,
} from "@/types";

export const STORAGE_KEY = "sellerdesk-data";

export const DEFAULT_DELIVERY_CHARGES: DeliveryCharges = {
  INSIDE_DHAKA: 80,
  OUTSIDE_DHAKA: 200,
};

export const DELIVERY_AREA_LABELS: Record<DeliveryArea, string> = {
  INSIDE_DHAKA: "Inside Dhaka",
  OUTSIDE_DHAKA: "Outside Dhaka",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const NAV_ITEMS: Array<{
  id: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "slips", label: "Order slips", icon: ReceiptText },
  { id: "settings", label: "Settings", icon: Settings2 },
];
export const ACTIVE_PAGE_STORAGE_KEY = "sellerdesk-active-page";
