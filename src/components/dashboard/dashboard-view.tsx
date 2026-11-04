import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Package,
  Printer,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import type { Order, PageKey, Product } from "@/types";
import { DELIVERY_AREA_LABELS } from "@/lib/constants";
import { formatBDT, formatDateTime, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { shopInfo } from "@/lib/demo-data";

export function DashboardView({
  products,
  orders,
  todaySales,
  todayOrdersCount,
  pendingCount,
  estimatedProfit,
  lowStockProducts,
  weeklyData,
  onNavigate,
  onNewOrder,
  onPrint,
}: {
  products: Product[];
  orders: Order[];
  todaySales: number;
  todayOrdersCount: number;
  pendingCount: number;
  estimatedProfit: number;
  lowStockProducts: Product[];
  weeklyData: Array<{ label: string; value: number }>;
  onNavigate: (page: PageKey) => void;
  onNewOrder: () => void;
  onPrint: (order: Order) => void;
}) {
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const maxValue = Math.max(...weeklyData.map((day) => day.value), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your business at a glance
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Good day, {shopInfo.ownerName}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is what is happening with your shop today.
          </p>
        </div>
        <Button onClick={onNewOrder}>
          <ShoppingCart />
          Create order
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Sales today"
          value={formatBDT(todaySales)}
          detail={`${todayOrdersCount} order(s) created today`}
          icon={CircleDollarSign}
        />
        <MetricCard
          label="Pending orders"
          value={String(pendingCount)}
          detail="Waiting for confirmation"
          icon={ShoppingBag}
        />
        <MetricCard
          label="Estimated gross profit"
          value={formatBDT(estimatedProfit)}
          detail="Across delivered orders"
          icon={TrendingUp}
        />
        <MetricCard
          label="Units in stock"
          value={String(totalUnits)}
          detail={`${products.length} products in catalogue`}
          icon={Boxes}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Sales overview</CardTitle>
            <CardDescription>
              Delivered order value over the last seven days, by order creation
              date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-3 pt-3">
              {weeklyData.map((day) => (
                <div
                  key={day.label}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-primary/80 transition-all"
                      style={{
                        height: `${Math.max((day.value / maxValue) * 100, day.value ? 8 : 2)}%`,
                      }}
                      title={formatBDT(day.value)}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" />
              Delivered sales
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Inventory alerts</CardTitle>
              <CardDescription>Products with 5 units or fewer.</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("products")}
            >
              Products <ArrowRight />
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                      <Package className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sku}
                      </p>
                    </div>
                    <Badge
                      variant={product.stock <= 2 ? "destructive" : "warning"}
                    >
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="Stock looks healthy"
                description="No products are currently at the low-stock threshold."
              />
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>
              A quick view of your latest customer activity.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("orders")}
          >
            All orders <ArrowRight />
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Slip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
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
                    <TableCell className="font-medium tabular-nums">
                      {formatBDT(order.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Print slip for ${order.id}`}
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
              icon={ShoppingCart}
              title="No orders yet"
              description="Create your first order to see activity here."
              action={<Button onClick={onNewOrder}>Create order</Button>}
            />
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Your workspace is saved locally in this browser. This is a frontend
        demonstration, not a shared production account.
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof CircleDollarSign;
}) {
  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
