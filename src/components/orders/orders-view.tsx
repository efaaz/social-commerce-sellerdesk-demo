"use client";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Plus,
  Printer,
  Search,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { DELIVERY_AREA_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatBDT, formatDateTime } from "@/lib/utils";
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
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";

export function OrdersView({
  orders,
  onAdd,
  onStatusChange,
  onPrint,
}: {
  orders: Order[];
  onAdd: () => void;
  onStatusChange: (order: Order, status: OrderStatus) => void;
  onPrint: (order: Order) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const counts = useMemo(
    () => ({
      PENDING: orders.filter((order) => order.status === "PENDING").length,
      CONFIRMED: orders.filter((order) => order.status === "CONFIRMED").length,
      DELIVERED: orders.filter((order) => order.status === "DELIVERED").length,
      CANCELLED: orders.filter((order) => order.status === "CANCELLED").length,
    }),
    [orders],
  );
  const filteredOrders = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((order) => status === "ALL" || order.status === status)
      .filter(
        (order) =>
          !term ||
          order.id.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term) ||
          order.phone.toLowerCase().includes(term),
      );
  }, [orders, query, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sales management
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track customer orders from confirmation through delivery.
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus />
          Create order
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {(Object.keys(counts) as OrderStatus[]).map((key) => (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {ORDER_STATUS_LABELS[key]}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {counts[key]}
                </p>
              </div>
              <StatusBadge status={key} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              All orders{" "}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({filteredOrders.length})
              </span>
            </CardTitle>
            <CardDescription>
              Search orders and update their status.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full pl-9 sm:w-56"
                placeholder="Search name, phone, or ID"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {ORDER_STATUS_LABELS[key]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length ? (
            <Table className="min-w-190">
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead className="text-right">Slip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="whitespace-nowrap">
                      <p className="font-mono text-xs font-semibold">
                        {order.id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.phone}
                      </p>
                      {order.deliveryArea &&
                        order.deliveryCharge !== undefined && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {DELIVERY_AREA_LABELS[order.deliveryArea]} ·{" "}
                            {formatBDT(order.deliveryCharge)} delivery
                          </p>
                        )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}{" "}
                      item(s)
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatBDT(order.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          onStatusChange(order, value as OrderStatus)
                        }
                        disabled={order.status === "DELIVERED"}
                      >
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]
                          ).map((key) => (
                            <SelectItem key={key} value={key}>
                              {ORDER_STATUS_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Print ${order.id}`}
                        onClick={() => onPrint(order)}
                      >
                        <Printer />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No orders found"
              description="Try changing your filters or create a new order."
              action={
                <Button onClick={onAdd} size="sm">
                  <Plus />
                  Create order
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="size-3.5" />
        Confirming an order deducts stock. Cancelling a confirmed order restores
        stock in this demo.
      </p>
    </div>
  );
}
