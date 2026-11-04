"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { DeliveryCharges } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsView({
  deliveryCharges,
  onSaveDeliveryCharges,
}: {
  deliveryCharges: DeliveryCharges;
  onSaveDeliveryCharges: (charges: DeliveryCharges) => string | null;
}) {
  const [insideDhaka, setInsideDhaka] = useState(
    String(deliveryCharges.INSIDE_DHAKA),
  );
  const [outsideDhaka, setOutsideDhaka] = useState(
    String(deliveryCharges.OUTSIDE_DHAKA),
  );
  const [error, setError] = useState("");

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = onSaveDeliveryCharges({
      INSIDE_DHAKA: Number(insideDhaka),
      OUTSIDE_DHAKA: Number(outsideDhaka),
    });
    setError(message ?? "");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace preferences
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the delivery rates used when creating orders.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Delivery charges</CardTitle>
          <CardDescription>
            These rates appear in the order form and are added to each new
            order&apos;s total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inside-dhaka-charge">Inside Dhaka (BDT)</Label>
                <Input
                  id="inside-dhaka-charge"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={insideDhaka}
                  onChange={(event) => setInsideDhaka(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outside-dhaka-charge">
                  Outside Dhaka (BDT)
                </Label>
                <Input
                  id="outside-dhaka-charge"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={outsideDhaka}
                  onChange={(event) => setOutsideDhaka(event.target.value)}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Rates are saved for this browser and used across the app. Orders
              already created keep the delivery charge that was applied to them.
            </p>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit">
              <Save />
              Save delivery charges
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
