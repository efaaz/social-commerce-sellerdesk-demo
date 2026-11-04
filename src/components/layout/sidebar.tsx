"use client";
import { Store } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PageKey } from "@/types";
import { shopInfo } from "@/lib/demo-data";
import Image from "next/image";

export function Sidebar({
  activePage,
  pendingCount,
  onNavigate,
  className,
}: {
  activePage: PageKey;
  pendingCount: number;
  onNavigate: (page: PageKey) => void;
  className?: string;
}) {
  return (
    <aside
      className={cn("flex h-full w-64 flex-col border-r bg-card", className)}
    >
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Store className="size-5" />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight">
            sellerdesk<span className="text-primary">.</span>
          </p>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
            SELLER WORKSPACE
          </p>
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            <Image
              src={shopInfo.logo || "/favicon.ico"}
              alt="Shop logo"
              width={50}
              height={42}
              className="rounded-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-cursive truncate text-base">
              {shopInfo.shopeName || "Demo shop"}
            </p>
            <p className="text-xs text-muted-foreground">Your workspace</p>
          </div>
        </div>
      </div>
      <div className="px-3 pt-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <nav className="space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activePage === id ? "secondary" : "ghost"}
              className={cn(
                "h-10 w-full justify-start px-3 border-none",
                activePage === id &&
                  "bg-primary/10 text-primary hover:bg-primary/15",
              )}
              onClick={() => onNavigate(id)}
            >
              <Icon className="size-4" />
              {label}
              {id === "orders" && pendingCount > 0 && (
                <span className="ml-auto rounded-md bg-background px-2 py-0.5 text-xs tabular-nums">
                  {pendingCount}
                </span>
              )}
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <p className="text-sm font-medium">Small steps, better business.</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Keep your orders and stock organized in one place.
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/60 p-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-background text-xs font-semibold">
            <Image
              src={shopInfo.logo || "/favicon.ico"}
              alt="Shop logo"
              width={50}
              height={42}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-cursive text-base">
              {shopInfo.ownerName || "John Doe"}
            </p>
            <p className="text-xs text-muted-foreground">Store owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
