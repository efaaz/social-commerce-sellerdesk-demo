"use client";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { Product } from "@/types";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";

export function ProductsView({
  products,
  onAdd,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );
  const filtered = products.filter(
    (product) =>
      (category === "ALL" || product.category === category) &&
      (!query.trim() ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase())),
  );
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const stockCost = products.reduce(
    (sum, product) => sum + product.stock * product.costPrice,
    0,
  );
  const lowStock = products.filter((product) => product.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Catalogue
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage products, pricing, and available stock.
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus />
          Add product
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total products"
          value={products.length.toString()}
          detail="Products in your catalogue"
        />
        <SummaryCard
          label="Units in stock"
          value={totalUnits.toString()}
          detail="Across all products"
        />
        <SummaryCard
          label="Stock cost value"
          value={formatBDT(stockCost)}
          detail="Based on recorded cost prices"
        />
        <SummaryCard
          label="Low stock"
          value={lowStock.toString()}
          detail="5 units or fewer"
          warning={lowStock > 0}
        />
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              All products{" "}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({filtered.length})
              </span>
            </CardTitle>
            <CardDescription>
              Search, update, and review your catalogue.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-full pl-9 sm:w-56"
                placeholder="Search products or SKU"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length ? (
            <Table className="min-w-205">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                          <Package className="size-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-xs md:text-sm">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBDT(product.costPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatBDT(product.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock <= 2
                            ? "destructive"
                            : product.stock <= 5
                              ? "warning"
                              : "success"
                        }
                      >
                        {product.stock} <span className="">units</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => onEdit(product)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Package}
              title="No matching products"
              description="Try another search or add a product to your catalogue."
              action={
                <Button onClick={onAdd} size="sm">
                  <Plus />
                  Add product
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="size-3.5" />
        Stock is deducted when an order is confirmed, not when it is first
        created.
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  warning = false,
}: {
  label: string;
  value: string;
  detail: string;
  warning?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${warning ? "text-amber-700" : ""}`}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
