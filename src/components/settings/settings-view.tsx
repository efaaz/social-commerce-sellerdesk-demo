"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import Image from "next/image";
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
import svgPathaoLogo from "@/assets/images/new-redx-logo.svg";

const providers = [
  {
    id: "pathao",
    name: "Pathao",
    logoUrl: "https://pathao.com/logo.svg",
    unoptimized: false,
  },
  {
    id: "redex",
    name: "REDX",
    logoUrl: svgPathaoLogo,
    unoptimized: true,
  },
  {
    id: "steadfast",
    name: "Steadfast",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=www.steadfast.com.bd&sz=128",
    unoptimized: true,
  },
];

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
  const [selectedProvider, setSelectedProvider] = useState("pathao");
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
          Configure delivery pricing and choose a preferred service provider.
        </p>
      </div>

      <section
        className="max-w-5xl space-y-4"
        aria-labelledby="delivery-preferences-title"
      >
        <div>
          <h2
            id="delivery-preferences-title"
            className="text-lg font-semibold tracking-tight"
          >
            Delivery preferences
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set your delivery rates and select a preferred service provider.
          </p>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          <Card>
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
                    <Label htmlFor="inside-dhaka-charge">
                      Inside Dhaka (BDT)
                    </Label>
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
                  Rates are saved for this browser and used across the app.
                  Orders already created keep the delivery charge that was
                  applied to them.
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

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <CardTitle>Delivery service provider</CardTitle>
                  <CardDescription>
                    Choose a provider for this demo workspace.
                  </CardDescription>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  Demo
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <fieldset className="grid grid-cols-3 gap-2 sm:gap-3">
                <legend className="sr-only">
                  Choose a delivery service provider
                </legend>
                {providers.map((provider) => {
                  const isSelected = selectedProvider === provider.id;

                  return (
                    <label
                      key={provider.id}
                      className={`relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 sm:p-3 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <input
                        className="peer sr-only"
                        type="radio"
                        name="delivery-provider"
                        value={provider.id}
                        checked={isSelected}
                        onChange={() => setSelectedProvider(provider.id)}
                      />
                      <span className="relative h-8 w-14 shrink-0">
                        <Image
                          src={provider.logoUrl}
                          alt=""
                          fill
                          sizes="56px"
                          unoptimized={provider.unoptimized}
                          className="object-contain"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold sm:text-sm">
                          {provider.name}
                        </span>
                      </span>
                      <span
                        className={`absolute right-2 top-2 flex size-4 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        <Check className="size-2.5" />
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Selection is for preview only and isn&apos;t connected to a
                courier account.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
