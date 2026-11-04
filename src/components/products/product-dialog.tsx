"use client";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import type { Product, ProductInput } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  costPrice: "",
  stock: "",
};
type FormState = typeof emptyForm;

export function ProductDialog({
  open,
  product,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onSave: (input: ProductInput, productId?: string) => string | null;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      product
        ? {
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: String(product.price),
            costPrice: String(product.costPrice),
            stock: String(product.stock),
          }
        : emptyForm,
    );
    setError("");
  }, [product, open]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: ProductInput = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: Number(form.price),
      costPrice: Number(form.costPrice),
      stock: Number(form.stock),
    };
    const message = onSave(input, product?.id);
    if (message) {
      setError(message);
      return;
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit product" : "Add a product"}
          </DialogTitle>
          <DialogDescription>
            Keep product details, pricing, and stock in one place.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="product-name">Product name</Label>
            <Input
              id="product-name"
              autoFocus
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="e.g. Pearl Drop Earrings"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                required
                value={form.sku}
                onChange={(event) => update("sku", event.target.value)}
                placeholder="e.g. JEW-006"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                required
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                placeholder="e.g. Earrings"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="product-price">Selling price (৳)</Label>
              <Input
                id="product-price"
                type="number"
                min="1"
                step="1"
                required
                value={form.price}
                onChange={(event) => update("price", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-cost">Cost price (৳)</Label>
              <Input
                id="product-cost"
                type="number"
                min="0"
                step="1"
                required
                value={form.costPrice}
                onChange={(event) => update("costPrice", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stock quantity</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                required
                value={form.stock}
                onChange={(event) => update("stock", event.target.value)}
              />
            </div>
          </div>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {product ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
