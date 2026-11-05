"use client";
import { useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  CreateOrderInput,
  DeliveryArea,
  DeliveryCharges,
  Product,
} from "@/types";
import { DELIVERY_AREA_LABELS } from "@/lib/constants";
import { formatBDT } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DraftLine = { productId: string; quantity: string };

export function OrderDialog({
  open,
  products,
  deliveryCharges,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  products: Product[];
  deliveryCharges: DeliveryCharges;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateOrderInput) => string | null;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("INSIDE_DHAKA");
  const [lines, setLines] = useState<DraftLine[]>([
    { productId: products[0]?.id ?? "", quantity: "1" },
  ]);
  const [error, setError] = useState("");
  const formContentRef = useRef<HTMLDivElement>(null);

  const itemSubtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = products.find((item) => item.id === line.productId);
        return (
          sum + (product?.price ?? 0) * Math.max(0, Number(line.quantity) || 0)
        );
      }, 0),
    [lines, products],
  );
  const deliveryCharge = deliveryCharges[deliveryArea];

  function resetForm() {
    setCustomerName("");
    setPhone("");
    setAddress("");
    setDeliveryArea("INSIDE_DHAKA");
    setLines([{ productId: products[0]?.id ?? "", quantity: "1" }]);
    setError("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
      if (formContentRef.current) formContentRef.current.scrollTop = 0;
    }
    onOpenChange(nextOpen);
  }

  function updateLine(index: number, updates: Partial<DraftLine>) {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...updates } : line,
      ),
    );
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = onCreate({
      customerName,
      phone,
      address,
      deliveryArea,
      items: lines.map((line) => ({
        productId: line.productId,
        quantity: Number(line.quantity),
      })),
    });
    if (message) {
      setError(message);
      return;
    }
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-full sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b px-4 py-4 pr-14 sm:px-6 sm:py-5 sm:pr-14">
          <DialogTitle>Create a new order</DialogTitle>
          <DialogDescription>
            Add customer details and the items they want to purchase.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div
            ref={formContentRef}
            className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6"
          >
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">Customer information</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer name</Label>
                  <Input
                    id="customer-name"
                    required
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone number</Label>
                  <Input
                    id="customer-phone"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-address">Delivery address</Label>
                <Input
                  id="customer-address"
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Area, city, and delivery details"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-area">Delivery area</Label>
                <Select
                  value={deliveryArea}
                  onValueChange={(value) =>
                    setDeliveryArea(value as DeliveryArea)
                  }
                >
                  <SelectTrigger id="delivery-area">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(DELIVERY_AREA_LABELS) as DeliveryArea[]).map(
                      (area) => (
                        <SelectItem key={area} value={area}>
                          {DELIVERY_AREA_LABELS[area]} ·{" "}
                          {formatBDT(deliveryCharges[area])}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Set these rates any time from Settings.
                </p>
              </div>
            </section>
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Order items</h3>
                  <p className="text-xs text-muted-foreground">
                    Choose products and quantities.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setLines((current) => [
                      ...current,
                      { productId: "", quantity: "1" },
                    ])
                  }
                  disabled={!products.length}
                >
                  <Plus />
                  Add item
                </Button>
              </div>
              {!products.length ? (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Add a product before creating an order.
                </p>
              ) : (
                lines.map((line, index) => {
                  const product = products.find(
                    (item) => item.id === line.productId,
                  );
                  return (
                    <div
                      key={index}
                      className="grid items-end gap-2 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_100px_110px_36px]"
                    >
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Select
                          value={line.productId}
                          onValueChange={(value) =>
                            updateLine(index, { productId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name} · {formatBDT(item.price)} ·{" "}
                                {item.stock} in stock
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mb-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={line.quantity}
                          onChange={(event) =>
                            updateLine(index, { quantity: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtotal</Label>
                        <p className="flex h-9 items-center text-sm font-semibold tabular-nums">
                          {product
                            ? formatBDT(
                                product.price *
                                  Math.max(0, Number(line.quantity) || 0),
                              )
                            : "—"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Remove item"
                        disabled={lines.length === 1}
                        onClick={() =>
                          setLines((current) =>
                            current.filter((_, lineIndex) => lineIndex !== index),
                          )
                        }
                      >
                        <Trash2 className="text-muted-foreground" />
                      </Button>
                    </div>
                  );
                })
              )}
            </section>
            <div className="space-y-2 rounded-lg bg-muted/60 p-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Items subtotal</span>
                <span className="tabular-nums">{formatBDT(itemSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery ({DELIVERY_AREA_LABELS[deliveryArea]})</span>
                <span className="tabular-nums">{formatBDT(deliveryCharge)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium">Order total</span>
                <span className="text-xl font-semibold tabular-nums">
                  {formatBDT(itemSubtotal + deliveryCharge)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              New orders start as Pending. Stock is deducted only when you confirm
              an order.
            </p>
            {error && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>
          <DialogFooter className="shrink-0 border-t bg-popover px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!products.length}>
              <Plus />
              Create order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
