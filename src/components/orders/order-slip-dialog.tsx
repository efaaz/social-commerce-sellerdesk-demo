"use client";
import { Printer } from "lucide-react";
import type { Order } from "@/types";
import { DELIVERY_AREA_LABELS } from "@/lib/constants";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shopInfo } from "@/lib/demo-data";
import Image from "next/image";

export function OrderSlipDialog({
  order,
  onOpenChange,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(order)} onOpenChange={onOpenChange}>
      {order && (
        <DialogContent data-print-dialog className="max-w-xl">
          <DialogHeader className="no-print">
            <DialogTitle>Order slip</DialogTitle>
            <DialogDescription>
              Review the order details before printing.
            </DialogDescription>
          </DialogHeader>
          <div
            data-print-root
            className="rounded-lg border bg-white p-5 text-slate-900 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 border-b pb-5">
              <div>
                <div className="flex items-center gap-2">
                  {shopInfo.logo ? (
                    <Image
                      src={shopInfo.logo}
                      alt="Shop logo"
                      className="h-auto w-12.5 rounded-full"
                    />
                  ) : (
                    <Image
                      src="/favicon.ico"
                      alt="Shop logo"
                      width={50}
                      height={50}
                      className="size-12.5 rounded-full object-cover"
                    />
                  )}
                  <h2 className="font-cursive text-xl font-semibold">
                    {shopInfo.shopeName}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">Order Invoice</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold">{order.id}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="grid gap-4 border-b py-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </p>
                <p className="mt-1 font-semibold">{order.customerName}</p>
                <p className="text-sm text-slate-600">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Delivery address
                </p>
                <p className="mt-1 text-sm text-slate-700">{order.address}</p>
              </div>
            </div>
            <div className="py-5">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="pl-0 text-slate-500">Item</TableHead>
                    <TableHead className="text-right text-slate-500">
                      Qty
                    </TableHead>
                    <TableHead className="text-right text-slate-500">
                      Price
                    </TableHead>
                    <TableHead className="pr-0 text-right text-slate-500">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow
                      key={item.productId}
                      className="border-slate-100 hover:bg-transparent"
                    >
                      <TableCell className="pl-0">
                        <p className="font-medium text-slate-800">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-500">{item.sku}</p>
                      </TableCell>
                      <TableCell className="text-right text-slate-700">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-slate-700">
                        {formatBDT(item.price)}
                      </TableCell>
                      <TableCell className="pr-0 text-right font-medium text-slate-800">
                        {formatBDT(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Items subtotal</span>
                <span>
                  {formatBDT(
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0,
                    ),
                  )}
                </span>
              </div>
              {order.deliveryArea && order.deliveryCharge !== undefined && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>
                    Delivery ({DELIVERY_AREA_LABELS[order.deliveryArea]})
                  </span>
                  <span>{formatBDT(order.deliveryCharge)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">
                  {formatBDT(order.total)}
                </span>
              </div>
            </div>
            <p className="mt-8 text-center text-xs text-slate-500">
              Thank you for shopping with{" "}
              <span className="font-cursive text-pink-500">
                {shopInfo.shopeName}
              </span>
            </p>
          </div>
          <DialogFooter className="no-print">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer />
              Print slip
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
