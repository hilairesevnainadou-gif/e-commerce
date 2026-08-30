"use client";

import EmptyCart from "@/components/cart/EmptyCart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { createOrder } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import { COUNTRIES, countryName, isEurozoneCountry } from "@/lib/countries";
import { ArrowLeft, Building2, Globe2, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const {
    tax_rate,
    free_shipping_threshold,
    international_shipping_fee,
    currency,
    site_name,
  } = useSettings();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("FR");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEurozone = isEurozoneCountry(country);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseShipping = subtotal >= free_shipping_threshold ? 0 : 9.99;
  const internationalFee = isEurozone ? 0 : international_shipping_fee;
  const shipping = baseShipping + internationalFee;
  const tax = subtotal * tax_rate;
  const total = subtotal + shipping + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError("Merci d'accepter les conditions générales de vente pour continuer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customer_name: fullName,
        customer_email: email,
        shipping_address: `${address}, ${postalCode} ${city}, ${countryName(country)}${phone ? ` — Tél. ${phone}` : ""}`,
        country,
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      });

      sessionStorage.setItem("last_order", JSON.stringify(order));
      clearCart();
      router.push("/checkout/confirmation");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la validation de votre commande."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Paiement</h1>
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/cart" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au panier
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Pour vous contacter en cas de besoin"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Numéro et nom de rue"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="country">Pays</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="bottom" avoidCollisions={false}>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isEurozone && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Globe2 className="h-3.5 w-3.5 shrink-0" />
                    Des frais de livraison internationaux de{" "}
                    {formatPrice(international_shipping_fee, currency)}{" "}
                    s&apos;appliquent hors zone euro.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Mode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Virement bancaire</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Après validation de votre commande, vous recevrez nos
                    coordonnées bancaires (IBAN) par e-mail avec le montant
                    exact à régler. Votre commande sera préparée dès réception
                    et validation du virement.{" "}
                    <Link
                      href="/payment-methods"
                      className="text-primary hover:underline"
                    >
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Votre commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      {(item.size || item.color) && (
                        <p className="text-xs text-muted-foreground">
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground shrink-0">
                      {formatPrice(item.price * item.quantity, currency)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">
                    {baseShipping === 0 ? (
                      <Badge variant="secondary" className="text-xs">
                        Gratuite
                      </Badge>
                    ) : (
                      formatPrice(baseShipping, currency)
                    )}
                  </span>
                </div>
                {internationalFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Frais internationaux
                    </span>
                    <span className="font-medium">
                      {formatPrice(internationalFee, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxe</span>
                  <span className="font-medium">{formatPrice(tax, currency)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(total, currency)}
                </span>
              </div>

              <Separator />

              <label className="flex items-start gap-2.5 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
                />
                <span>
                  J&apos;accepte les{" "}
                  <Link href="/terms" className="text-primary hover:underline" target="_blank">
                    conditions générales de vente
                  </Link>
                </span>
              </label>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Validation..." : "Confirmer la commande"}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Commande sécurisée chez {site_name}
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
