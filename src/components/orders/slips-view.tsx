import { FileText, Printer, ReceiptText } from "lucide-react";
import type { Order } from "@/types";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { DELIVERY_AREA_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";

export function SlipsView({
  orders,
  onPrint,
}: {
  orders: Order[];
  onPrint: (order: Order) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Fulfilment
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Order slips
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate printable order summaries for packing and delivery.
        </p>
      </div>
      <Card className="border-primary/20 bg-primary/3">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <ReceiptText className="size-5" />
          </div>
          <div>
            <p className="font-semibold">
              A clear slip keeps fulfilment organized.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open any order slip to review customer details, ordered items,
              quantities, and total before printing.
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available slips</CardTitle>
          <CardDescription>
            {orders.length} order(s) can be printed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length ? (
            <div className="divide-y">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">
                      {order.id}
                    </p>
                    <div className="flex justify-between">
                      <p className="mt-1 truncate text-sm">
                        {order.customerName} · {order.phone}
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                    {order.deliveryArea &&
                      order.deliveryCharge !== undefined && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {DELIVERY_AREA_LABELS[order.deliveryArea]} ·{" "}
                          {formatBDT(order.deliveryCharge)} delivery
                        </p>
                      )}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p className="font-semibold">{formatBDT(order.total)}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={order.status === "CANCELLED"}
                      onClick={() => onPrint(order)}
                    >
                      <Printer />
                      Print
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ReceiptText}
              title="No order slips yet"
              description="Create an order to generate your first slip."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
