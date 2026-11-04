"use client";
import { useMemo, useState } from "react";
import { Store } from "lucide-react";
import { toast } from "sonner";
import type { Order, PageKey, Product } from "@/types";
import { NAV_ITEMS } from "@/lib/constants";
import { getDashboardMetrics } from "@/lib/dashboard";
import { useSellerDesk } from "@/hooks/use-sellerdesk";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { ProductsView } from "@/components/products/products-view";
import { ProductDialog } from "@/components/products/product-dialog";
import { OrdersView } from "@/components/orders/orders-view";
import { OrderDialog } from "@/components/orders/order-dialog";
import { SlipsView } from "@/components/orders/slips-view";
import { OrderSlipDialog } from "@/components/orders/order-slip-dialog";
import { SettingsView } from "@/components/settings/settings-view";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { storage } from "@/lib/storage";

export function SellerDeskApp() {
  const {
    products,
    orders,
    deliveryCharges,
    isReady,
    saveProduct,
    deleteProduct,
    createNewOrder,
    updateDeliveryCharges,
    updateOrderStatus,
  } = useSellerDesk();

  const [activePage, setActivePage] = useState<PageKey>(() =>
    storage.loadActivePage("dashboard"),
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<Order | null>(null);

  const dashboard = useMemo(
    () => getDashboardMetrics(products, orders),
    [products, orders],
  );
  const pageTitle =
    NAV_ITEMS.find((item) => item.id === activePage)?.label ?? "Overview";

  function navigate(page: PageKey) {
    setActivePage(page);
    storage.saveActivePage(page);
    setMobileMenuOpen(false);
  }

  function openNewProduct() {
    setEditingProduct(null);
    setProductDialogOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setProductDialogOpen(true);
  }

  function handleDeleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const error = deleteProduct(product);
    if (error) toast.error(error);
  }

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center gap-3 bg-muted/30 text-sm text-muted-foreground">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Store className="size-5" />
        </div>
        Preparing your workspace…
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-muted/30 md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="hidden md:block">
        <Sidebar
          activePage={activePage}
          pendingCount={dashboard.pendingCount}
          onNavigate={navigate}
        />
      </div>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <Sidebar
            activePage={activePage}
            pendingCount={dashboard.pendingCount}
            onNavigate={navigate}
            className="w-full border-0"
          />
        </SheetContent>
      </Sheet>
      <main className="min-w-0">
        <Header
          pageTitle={pageTitle}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />
        <div className="mx-auto w-full max-w-375 p-4 sm:p-6 lg:p-8">
          {activePage === "dashboard" && (
            <DashboardView
              products={products}
              orders={orders}
              todaySales={dashboard.todaySales}
              todayOrdersCount={dashboard.todayOrders.length}
              pendingCount={dashboard.pendingCount}
              estimatedProfit={dashboard.estimatedProfit}
              lowStockProducts={dashboard.lowStockProducts}
              weeklyData={dashboard.weeklyData}
              onNavigate={navigate}
              onNewOrder={() => setOrderDialogOpen(true)}
              onPrint={setSelectedSlip}
            />
          )}
          {activePage === "products" && (
            <ProductsView
              products={products}
              onAdd={openNewProduct}
              onEdit={openEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
          {activePage === "orders" && (
            <OrdersView
              orders={orders}
              onAdd={() => setOrderDialogOpen(true)}
              onStatusChange={updateOrderStatus}
              onPrint={setSelectedSlip}
            />
          )}
          {activePage === "slips" && (
            <SlipsView
              orders={[...orders].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )}
              onPrint={setSelectedSlip}
            />
          )}
          {activePage === "settings" && (
            <SettingsView
              deliveryCharges={deliveryCharges}
              onSaveDeliveryCharges={updateDeliveryCharges}
            />
          )}
        </div>
      </main>

      <ProductDialog
        open={productDialogOpen}
        product={editingProduct}
        onOpenChange={setProductDialogOpen}
        onSave={saveProduct}
      />
      <OrderDialog
        open={orderDialogOpen}
        products={products}
        deliveryCharges={deliveryCharges}
        onOpenChange={setOrderDialogOpen}
        onCreate={createNewOrder}
      />
      <OrderSlipDialog
        order={selectedSlip}
        onOpenChange={(open) => {
          if (!open) setSelectedSlip(null);
        }}
      />
    </div>
  );
}
