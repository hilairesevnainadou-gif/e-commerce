"use client";

import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";
import { Shield, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  const { free_shipping_threshold, currency } = useSettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Votre panier est vide
          </h1>
          <p className="text-muted-foreground text-lg">
            Il semble que vous n&apos;ayez encore rien ajouté à votre panier.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            asChild
            size="lg"
            className="h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/">Continuer mes achats</Link>
          </Button>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Livraison gratuite dès {formatPrice(free_shipping_threshold, currency)}
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
