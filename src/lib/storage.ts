import { createDemoOrders, createDemoProducts } from "@/lib/demo-data";
import {
  ACTIVE_PAGE_STORAGE_KEY,
  DEFAULT_DELIVERY_CHARGES,
  NAV_ITEMS,
  STORAGE_KEY,
} from "@/lib/constants";
import type { PageKey, SellerDeskData } from "@/types";

function createInitialData(): SellerDeskData {
  return {
    products: createDemoProducts(),
    orders: createDemoOrders(),
    deliveryCharges: DEFAULT_DELIVERY_CHARGES,
  };
}

export const storage = {
  // Load the SellerDesk data from localStorage, or return a fallback if not available.
  load(): SellerDeskData {
    const fallback = createInitialData();
    if (typeof window === "undefined") return fallback;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed: unknown = JSON.parse(raw);

      if (!parsed || typeof parsed !== "object") return fallback;
      const data = parsed as Partial<SellerDeskData>;
      return {
        products: Array.isArray(data.products)
          ? data.products
          : fallback.products,
        orders: Array.isArray(data.orders) ? data.orders : fallback.orders,
        deliveryCharges: isDeliveryCharges(data.deliveryCharges)
          ? data.deliveryCharges
          : fallback.deliveryCharges,
      };
    } catch {
      return fallback;
    }
  },

  // Load the active page from localStorage, or return a fallback if not available.
  loadActivePage(defaultPage: PageKey): PageKey {
    if (typeof window === "undefined") return defaultPage;

    try {
      const storedPage = window.localStorage.getItem(ACTIVE_PAGE_STORAGE_KEY);
      return (
        NAV_ITEMS.find((item) => item.id === storedPage)?.id ?? defaultPage
      );
    } catch (error) {
      console.error("Unable to load SellerDesk active page.", error);
      return defaultPage;
    }
  },

  // Save the active page to localStorage.
  saveActivePage(page: PageKey): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, page);
    } catch (error) {
      console.error("Unable to save SellerDesk active page.", error);
    }
  },

  // Save the SellerDesk data to localStorage.
  save(data: SellerDeskData): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Unable to save SellerDesk data.", error);
    }
  },
};

// Type guard to check if a value is a valid DeliveryCharges object.
function isDeliveryCharges(
  value: unknown,
): value is SellerDeskData["deliveryCharges"] {
  if (!value || typeof value !== "object") return false;
  const charges = value as Record<string, unknown>;
  return [charges.INSIDE_DHAKA, charges.OUTSIDE_DHAKA].every(
    (charge) =>
      typeof charge === "number" && Number.isInteger(charge) && charge >= 0,
  );
}
