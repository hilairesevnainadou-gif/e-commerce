import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import {
  Clock,
  Globe,
  Home,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Informations de livraison" };

export default async function ShippingPage() {
  const settings = await getSettings();

  const quickInfo = [
    {
      icon: Clock,
      title: "Préparation rapide",
      description: "Les commandes passées avant 14h sont expédiées le jour même.",
    },
    {
      icon: Truck,
      title: "Livraison standard",
      description: "3 à 5 jours ouvrés en France métropolitaine.",
    },
    {
      icon: MapPin,
      title: "Suivi de colis",
      description: "Un lien de suivi vous est envoyé par e-mail dès l'expédition.",
    },
  ];

  const zones = [
    {
      icon: Home,
      zone: "France métropolitaine",
      delay: "3 à 5 jours ouvrés",
      price: `${formatPrice(9.99, settings.currency)} · gratuit dès ${formatPrice(settings.free_shipping_threshold, settings.currency)}`,
    },
    {
      icon: Globe,
      zone: "Union européenne",
      delay: "5 à 8 jours ouvrés",
      price: "Calculé au moment du paiement",
    },
    {
      icon: Package,
      zone: "Reste du monde",
      delay: "7 à 14 jours ouvrés",
      price: "Calculé au moment du paiement",
    },
  ];

  const goodToKnow = [
    {
      icon: ShieldCheck,
      title: "Emballage soigné",
      description:
        "Chaque commande est emballée avec soin dans du matériel adapté pour protéger vos produits durant le transport.",
    },
    {
      icon: MapPin,
      title: "Adresse de livraison",
      description:
        "Vérifiez bien votre adresse avant de valider votre commande. Contactez-nous rapidement si une erreur s'est glissée, avant l'expédition du colis.",
    },
    {
      icon: Globe,
      title: "Frais de douane (international)",
      description:
        "Pour les livraisons hors Union européenne, des frais de douane ou taxes locales peuvent s'appliquer à la réception et restent à la charge du destinataire.",
    },
    {
      icon: Package,
      title: "Absent lors de la livraison ?",
      description:
        "Le transporteur laisse un avis de passage et propose un nouveau créneau ou un point de retrait pour récupérer votre colis.",
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Livraison"
        title="Informations de livraison"
        description="Tout ce qu'il faut savoir sur l'expédition de votre commande."
        image="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-16">
          {/* Quick info */}
          <div className="grid sm:grid-cols-3 gap-6">
            {quickInfo.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Delivery zones & rates */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Délais et tarifs par zone
            </h2>
            <div className="border border-border rounded-lg overflow-hidden bg-background">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-4 sm:px-6 py-3">
                      Zone
                    </th>
                    <th className="text-left font-medium px-4 sm:px-6 py-3">
                      Délai estimé
                    </th>
                    <th className="text-left font-medium px-4 sm:px-6 py-3">
                      Tarif
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {zones.map(({ icon: Icon, zone, delay, price }) => (
                    <tr key={zone}>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium text-foreground">
                            {zone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-muted-foreground">
                        {delay}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-muted-foreground">
                        {price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Les délais sont donnés à titre indicatif à compter de
              l&apos;expédition et peuvent varier selon le transporteur.
            </p>
          </div>

          {/* Good to know */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Bon à savoir
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {goodToKnow.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Une question sur votre livraison ?
              </h3>
              <p className="text-muted-foreground mb-4">
                Notre équipe est disponible pour vous aider avec le suivi de
                votre commande.
              </p>
              <p className="text-foreground font-medium">
                {settings.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-primary hover:underline"
                  >
                    {settings.contact_email}
                  </a>
                )}
                {settings.contact_phone && (
                  <>
                    {" "}
                    · <span>{settings.contact_phone}</span>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
