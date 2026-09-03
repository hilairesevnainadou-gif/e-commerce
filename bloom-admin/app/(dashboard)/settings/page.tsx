"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { getAdminSettings, updateSettings } from "@/lib/api";
import type { Settings } from "@/types/settings";
import { cn } from "@/lib/utils";
import {
  Bell,
  Megaphone,
  Palette,
  Phone,
  ShoppingBag,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const TABS = [
  { id: "identity", label: "Identité", icon: Palette },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Réseaux sociaux", icon: Share2 },
  { id: "commerce", label: "Commerce", icon: ShoppingBag },
  { id: "promotion", label: "Promotion", icon: Megaphone },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("identity");

  useEffect(() => {
    if (!token) return;
    getAdminSettings(token)
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !settings) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("site_name", settings.site_name);
    formData.append("tagline", settings.tagline || "");
    formData.append("description", settings.description || "");
    formData.append("contact_email", settings.contact_email || "");
    formData.append("contact_phone", settings.contact_phone || "");
    formData.append("contact_address", settings.contact_address || "");
    formData.append("whatsapp_number", settings.whatsapp_number || "");
    formData.append("social_facebook", settings.social_facebook || "");
    formData.append("social_instagram", settings.social_instagram || "");
    formData.append("social_twitter", settings.social_twitter || "");
    formData.append("tax_rate", String(settings.tax_rate));
    formData.append("free_shipping_threshold", String(settings.free_shipping_threshold));
    formData.append(
      "international_shipping_fee",
      String(settings.international_shipping_fee)
    );
    formData.append("currency", settings.currency);
    formData.append(
      "sale_ends_at",
      settings.sale_ends_at ? new Date(settings.sale_ends_at).toISOString() : ""
    );
    formData.append("announcement_text", settings.announcement_text || "");
    formData.append("bank_account_holder", settings.bank_account_holder || "");
    formData.append("bank_name", settings.bank_name || "");
    formData.append("bank_iban", settings.bank_iban || "");
    formData.append("bank_bic", settings.bank_bic || "");
    formData.append("notify_new_orders", settings.notify_new_orders ? "1" : "0");
    formData.append("notification_email", settings.notification_email || "");
    if (logo) formData.append("logo", logo);

    try {
      const updated = await updateSettings(token, formData);
      setSettings(updated);
      setLogo(null);
      setMessage("Réglages enregistrés.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground">Réglages de la marque</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors",
                activeTab === id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <Card className={activeTab === "identity" ? "" : "hidden"}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Nom du site</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => update("site_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Slogan</Label>
              <Input
                id="tagline"
                value={settings.tagline || ""}
                onChange={(e) => update("tagline", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description SEO</Label>
              <Textarea
                id="description"
                value={settings.description || ""}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              {settings.logo_url && (
                <div className="relative h-10 w-32 mb-2">
                  <Image
                    src={settings.logo_url}
                    alt="Logo actuel"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              )}
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "contact" ? "" : "hidden"}>
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">E-mail</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => update("contact_email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Téléphone</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone || ""}
                  onChange={(e) => update("contact_phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_address">Adresse</Label>
              <Input
                id="contact_address"
                value={settings.contact_address || ""}
                onChange={(e) => update("contact_address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
              <Input
                id="whatsapp_number"
                value={settings.whatsapp_number || ""}
                onChange={(e) => update("whatsapp_number", e.target.value)}
                placeholder="+33612345678"
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Affiche une bulle flottante WhatsApp sur le site. Format
                international avec indicatif (ex. : +33612345678). Laisser
                vide pour la masquer.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "social" ? "" : "hidden"}>
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input
                  id="social_facebook"
                  value={settings.social_facebook || ""}
                  onChange={(e) => update("social_facebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input
                  id="social_instagram"
                  value={settings.social_instagram || ""}
                  onChange={(e) => update("social_instagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_twitter">Twitter / X</Label>
                <Input
                  id="social_twitter"
                  value={settings.social_twitter || ""}
                  onChange={(e) => update("social_twitter", e.target.value)}
                  placeholder="https://x.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "commerce" ? "" : "hidden"}>
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise (code ISO)</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => update("currency", e.target.value.toUpperCase())}
                  maxLength={3}
                  placeholder="EUR"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Taux de taxe (ex. 0,08 = 8 %)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.0001"
                  min="0"
                  max="1"
                  value={settings.tax_rate}
                  onChange={(e) => update("tax_rate", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free_shipping_threshold">
                  Livraison gratuite dès
                </Label>
                <Input
                  id="free_shipping_threshold"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.free_shipping_threshold}
                  onChange={(e) =>
                    update("free_shipping_threshold", Number(e.target.value))
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              La devise contrôle l&apos;affichage de tous les prix sur la
              boutique et l&apos;admin (ex. : EUR, USD, GBP).
            </p>

            <div className="pt-4 border-t border-border space-y-2">
              <Label htmlFor="international_shipping_fee">
                Frais de livraison hors zone euro
              </Label>
              <Input
                id="international_shipping_fee"
                type="number"
                step="0.01"
                min="0"
                className="max-w-[12rem]"
                value={settings.international_shipping_fee}
                onChange={(e) =>
                  update("international_shipping_fee", Number(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Montant ajouté aux frais de livraison habituels lorsque le
                client choisit un pays hors zone euro à la commande. Les
                pays de la zone euro ne paient que la livraison standard
                ci-dessus.
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Coordonnées bancaires
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Affichées au client sur la page de confirmation de commande
                  pour effectuer son virement bancaire.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_account_holder">Titulaire du compte</Label>
                  <Input
                    id="bank_account_holder"
                    value={settings.bank_account_holder || ""}
                    onChange={(e) => update("bank_account_holder", e.target.value)}
                    placeholder="Maison Vélocité SAS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Banque</Label>
                  <Input
                    id="bank_name"
                    value={settings.bank_name || ""}
                    onChange={(e) => update("bank_name", e.target.value)}
                    placeholder="Ex. : Société Générale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_iban">IBAN</Label>
                  <Input
                    id="bank_iban"
                    value={settings.bank_iban || ""}
                    onChange={(e) =>
                      update("bank_iban", e.target.value.toUpperCase())
                    }
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_bic">BIC / SWIFT</Label>
                  <Input
                    id="bank_bic"
                    value={settings.bank_bic || ""}
                    onChange={(e) => update("bank_bic", e.target.value.toUpperCase())}
                    placeholder="XXXXFRPP"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Laissez ces champs vides tant que votre commande n&apos;a pas
                encore de coordonnées bancaires à communiquer : la page de
                confirmation indiquera alors que l&apos;IBAN sera envoyé par
                e-mail séparément.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "promotion" ? "" : "hidden"}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcement_text">
                Texte du bandeau d&apos;annonce
              </Label>
              <Input
                id="announcement_text"
                value={settings.announcement_text || ""}
                onChange={(e) => update("announcement_text", e.target.value)}
                placeholder="Ex. : Livraison gratuite dès 50 $ d'achat"
              />
              <p className="text-xs text-muted-foreground">
                Affiché dans un bandeau tout en haut du site, au-dessus du
                menu. Laisser vide pour le masquer.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_ends_at">Fin du compte à rebours</Label>
              <Input
                id="sale_ends_at"
                type="datetime-local"
                value={toDatetimeLocalValue(settings.sale_ends_at)}
                onChange={(e) =>
                  update(
                    "sale_ends_at",
                    e.target.value ? new Date(e.target.value).toISOString() : null
                  )
                }
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Affiche un compte à rebours sur la page d&apos;accueil de la
                boutique. Laisser vide pour le masquer.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "notifications" ? "" : "hidden"}>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Alertes de nouvelle commande
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recevez un e-mail à chaque commande passée sur la boutique, en
                plus de la notification dans le panneau d&apos;administration
                (icône cloche).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="notify_new_orders"
                checked={settings.notify_new_orders}
                onCheckedChange={(checked) => update("notify_new_orders", checked)}
              />
              <Label htmlFor="notify_new_orders">
                Envoyer un e-mail à chaque nouvelle commande
              </Label>
            </div>

            <div className="space-y-2 max-w-sm">
              <Label htmlFor="notification_email">E-mail de notification</Label>
              <Input
                id="notification_email"
                type="email"
                value={settings.notification_email || ""}
                onChange={(e) => update("notification_email", e.target.value)}
                placeholder={settings.contact_email || "commandes@bloomshop.test"}
                disabled={!settings.notify_new_orders}
              />
              <p className="text-xs text-muted-foreground">
                Laisser vide pour utiliser l&apos;e-mail de contact renseigné
                dans l&apos;onglet Contact ({settings.contact_email || "non défini"}
                ).
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les réglages"}
          </Button>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </form>
    </div>
  );
}
