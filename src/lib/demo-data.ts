import type { Order, Product, ShopProfile } from "@/types";
import logoImage from "@/assets/images/Zabin.jpeg";

// Helper function to generate a date string for a given number of days ago
const daysAgo = (days: number, hour = 11) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
};

export const shopInfo: ShopProfile = {
  id: "demo-shop",
  shopeName: "Zabin's Artgraph",
  ownerName: "Sayeda Zabin Tanzim",
  logo: logoImage,
  facebookPage: "https://www.facebook.com/zabinsartgraph",
};


export function createDemoProducts(): Product[] {
  return [
    {
      id: "PRD-001",
      name: "Pearl Drop Earrings",
      sku: "JEW-001",
      category: "Earrings",
      price: 650,
      costPrice: 380,
      stock: 15,
      createdAt: daysAgo(14),
    },
    {
      id: "PRD-002",
      name: "Minimal Gold Necklace",
      sku: "JEW-002",
      category: "Necklaces",
      price: 950,
      costPrice: 590,
      stock: 8,
      createdAt: daysAgo(12),
    },
    {
      id: "PRD-003",
      name: "Color Pop Bracelet",
      sku: "JEW-003",
      category: "Bracelets",
      price: 420,
      costPrice: 230,
      stock: 3,
      createdAt: daysAgo(9),
    },
    {
      id: "PRD-004",
      name: "Gift Box Set",
      sku: "GFT-001",
      category: "Gift sets",
      price: 1250,
      costPrice: 790,
      stock: 12,
      createdAt: daysAgo(7),
    },
    {
      id: "PRD-005",
      name: "Daisy Stud Earrings",
      sku: "JEW-004",
      category: "Earrings",
      price: 350,
      costPrice: 190,
      stock: 2,
      createdAt: daysAgo(4),
    },
  ];
}

export function createDemoOrders(): Order[] {
  return [
    {
      id: "SD-2601",
      customerName: "Nusrat Jahan",
      phone: "01712-345678",
      address: "Dhanmondi, Dhaka",
      items: [
        {
          productId: "PRD-001",
          productName: "Pearl Drop Earrings",
          sku: "JEW-001",
          price: 650,
          costPrice: 380,
          quantity: 1,
        },
        {
          productId: "PRD-003",
          productName: "Color Pop Bracelet",
          sku: "JEW-003",
          price: 420,
          costPrice: 230,
          quantity: 1,
        },
      ],
      total: 1070,
      status: "DELIVERED",
      createdAt: daysAgo(0, 9),
    },
    {
      id: "SD-2602",
      customerName: "Samira Ahmed",
      phone: "01819-222333",
      address: "Uttara, Dhaka",
      items: [
        {
          productId: "PRD-002",
          productName: "Minimal Gold Necklace",
          sku: "JEW-002",
          price: 950,
          costPrice: 590,
          quantity: 1,
        },
      ],
      total: 950,
      status: "CONFIRMED",
      createdAt: daysAgo(0, 10),
    },
    {
      id: "SD-2603",
      customerName: "Maliha Karim",
      phone: "01911-456789",
      address: "Mirpur 10, Dhaka",
      items: [
        {
          productId: "PRD-004",
          productName: "Gift Box Set",
          sku: "GFT-001",
          price: 1250,
          costPrice: 790,
          quantity: 1,
        },
      ],
      total: 1250,
      status: "PENDING",
      createdAt: daysAgo(0, 11),
    },
    {
      id: "SD-2598",
      customerName: "Tanjim Rahman",
      phone: "01670-888999",
      address: "Mohammadpur, Dhaka",
      items: [
        {
          productId: "PRD-001",
          productName: "Pearl Drop Earrings",
          sku: "JEW-001",
          price: 650,
          costPrice: 380,
          quantity: 2,
        },
      ],
      total: 1300,
      status: "DELIVERED",
      createdAt: daysAgo(1, 15),
    },
    {
      id: "SD-2595",
      customerName: "Farah Islam",
      phone: "01730-321654",
      address: "Bashundhara, Dhaka",
      items: [
        {
          productId: "PRD-005",
          productName: "Daisy Stud Earrings",
          sku: "JEW-004",
          price: 350,
          costPrice: 190,
          quantity: 1,
        },
      ],
      total: 350,
      status: "CANCELLED",
      createdAt: daysAgo(2, 13),
    },
  ];
}
