"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";
import { RotateCcw, Shield, Truck } from "lucide-react";

export default function Features() {
  const { free_shipping_threshold, currency } = useSettings();

  const features = [
    {
      icon: Truck,
      title: "Livraison gratuite",
      desc: `Dès ${formatPrice(free_shipping_threshold, currency)} d'achat`,
    },
    { icon: Shield, title: "Garantie", desc: "Garantie 1 an" },
    { icon: RotateCcw, title: "Retours faciles", desc: "Retours sous 30 jours" },
  ];
  return (
    <Card className="mb-16">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
