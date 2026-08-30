"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/currency";
import type { Order } from "@/types/order";
import { Check, CheckCircle2, Copy, Download, Mail, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutConfirmationPage() {
  const {
    currency,
    contact_email,
    contact_phone,
    site_name,
    bank_account_holder,
    bank_name,
    bank_iban,
    bank_bic,
  } = useSettings();
  const { showToast } = useToast();
  const hasBankDetails = !!bank_iban;
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [ibanCopied, setIbanCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_order");
    setOrder(raw ? JSON.parse(raw) : null);
  }, []);

  const handleCopyIban = async () => {
    if (!bank_iban) return;
    try {
      await navigator.clipboard.writeText(bank_iban.replace(/\s+/g, ""));
      setIbanCopied(true);
      showToast("IBAN copié dans le presse-papiers.");
      setTimeout(() => setIbanCopied(false), 2000);
    } catch {
      showToast("Impossible de copier l'IBAN.");
    }
  };

  if (order === undefined) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-2xl">
      <div className="text-center mb-8 sm:mb-10">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Merci pour votre commande !
        </h1>
        <p className="text-muted-foreground">
          {order
            ? `Votre commande ${order.reference} a bien été enregistrée.`
            : "Votre commande a bien été enregistrée."}
        </p>
        {order && (
          <p className="text-sm text-muted-foreground mt-1">
            Une facture vient de vous être envoyée à {order.customer_email}.
          </p>
        )}
      </div>

      {order && (
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="font-semibold text-foreground">
                Récapitulatif
              </h2>
              <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto" asChild>
                <Link href={order.invoice_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-3.5 w-3.5" />
                  Télécharger la facture
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground min-w-0 break-words">
                    {item.product_name}{" "}
                    <span className="text-xs">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-foreground shrink-0">
                    {formatPrice(item.unit_price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(order.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span>
                  {order.shipping === 0
                    ? "Gratuite"
                    : formatPrice(order.shipping, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxe</span>
                <span>{formatPrice(order.tax, currency)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-primary text-lg">
                {formatPrice(order.total, currency)}
              </span>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p className="text-foreground font-medium mb-1">
                Adresse de livraison
              </p>
              <p>{order.shipping_address}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">
                Prochaine étape : le règlement
              </h3>

              {hasBankDetails ? (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Merci d&apos;effectuer un virement du montant total ci-dessus
                    vers les coordonnées bancaires suivantes, en indiquant la
                    référence <strong>{order?.reference}</strong> dans le
                    libellé. Votre commande sera préparée dès réception et
                    validation du virement.
                  </p>
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2.5 text-sm">
                    {bank_account_holder && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                        <span className="text-muted-foreground">Titulaire</span>
                        <span className="font-medium text-foreground break-words">
                          {bank_account_holder}
                        </span>
                      </div>
                    )}
                    {bank_name && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                        <span className="text-muted-foreground">Banque</span>
                        <span className="font-medium text-foreground break-words">
                          {bank_name}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                      <span className="text-muted-foreground">IBAN</span>
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-foreground font-mono tracking-wide break-all">
                          {bank_iban}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyIban}
                          aria-label="Copier l'IBAN"
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {ibanCopied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </span>
                    </div>
                    {bank_bic && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                        <span className="text-muted-foreground">BIC / SWIFT</span>
                        <span className="font-medium text-foreground font-mono break-words">
                          {bank_bic}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Une facture contenant nos coordonnées bancaires (IBAN) et le
                  montant exact à régler vient de vous être envoyée par e-mail
                  {order ? ` à ${order.customer_email}` : ""}. Merci d&apos;indiquer
                  la référence{" "}
                  {order ? <strong>{order.reference}</strong> : "communiquée"} dans
                  le libellé de votre virement. Votre commande sera préparée
                  dès réception et validation du paiement.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg" className="h-12 text-base sm:flex-1">
          <Link href="/shop">
            <Package className="h-4 w-4" />
            Continuer mes achats
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 text-base sm:flex-1">
          <Link href="/track-order">Suivre ma commande</Link>
        </Button>
      </div>

      {(contact_email || contact_phone) && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Une question ? Contactez {site_name} à{" "}
          {contact_email && (
            <a href={`mailto:${contact_email}`} className="text-primary hover:underline">
              {contact_email}
            </a>
          )}
          {contact_email && contact_phone && " · "}
          {contact_phone}
        </p>
      )}
    </div>
  );
}
