import { Suspense } from "react";
import { Store } from "lucide-react";
import { SellerDeskApp } from "@/components/sellerdesk-app";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center gap-3 bg-muted/30 text-sm text-muted-foreground">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-5" />
          </div>
          Preparing your workspace…
        </div>
      }
    >
      <SellerDeskApp />
    </Suspense>
  );
}
