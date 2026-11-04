import type { Order, Product, ProductInput } from "@/types";
import { createId } from "@/lib/utils";

export function validateProductInput(
  input: ProductInput,
  products: Product[],
  editingId?: string,
): string | null {
  if (!input.name.trim() || !input.sku.trim() || !input.category.trim()) {
    return "Complete all product fields before saving.";
  }
  if (
    !Number.isFinite(input.price) ||
    !Number.isFinite(input.costPrice) ||
    !Number.isInteger(input.stock) ||
    input.price <= 0 ||
    input.costPrice < 0 ||
    input.stock < 0
  ) {
    return "Enter valid prices and a whole-number stock quantity.";
  }
  const duplicateSku = products.some(
    (product) =>
      product.sku.toLowerCase() === input.sku.trim().toLowerCase() &&
      product.id !== editingId,
  );
  return duplicateSku ? "That SKU is already in use. Choose a unique SKU." : null;
}

export function createProduct(input: ProductInput): Product {
  return {
    id: createId("PRD"),
    name: input.name.trim(),
    sku: input.sku.trim(),
    category: input.category.trim(),
    price: input.price,
    costPrice: input.costPrice,
    stock: input.stock,
    createdAt: new Date().toISOString(),
  };
}

export function updateProduct(product: Product, input: ProductInput): Product {
  return {
    ...product,
    ...input,
    name: input.name.trim(),
    sku: input.sku.trim(),
    category: input.category.trim(),
  };
}

export function canDeleteProduct(productId: string, orders: Order[]): boolean {
  return !orders.some((order) =>
    order.items.some((item) => item.productId === productId),
  );
}
