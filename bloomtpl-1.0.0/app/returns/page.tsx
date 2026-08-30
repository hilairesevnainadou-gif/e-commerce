import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import {
  CheckCircle2,
  CreditCard,
  Mail,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Retours et échanges" };

export default async function ReturnsPage() {
  const settings = await getSettings();

  const steps = [
    {
      icon: Mail,
      title: "1. Faites votre demande",
      description:
        "Contactez-nous dans les 30 jours suivant la réception de votre commande en précisant le produit concerné et le motif du retour.",
    },
    {
      icon: Package,
      title: "2. Renvoyez l'article",
      description:
        "Emballez l'article neuf et non porté dans son emballage d'origine, avec l'étiquette de retour que nous vous fournissons.",
    },
    {
      icon: CreditCard,
      title: "3. Remboursement ou échange",
      description:
        "Une fois le retour reçu et vérifié en entrepôt, nous procédons au remboursement ou à l'échange sous 5 jours ouvrés.",
    },
  ];

  const eligible = [
    "Article neuf, non porté et non lavé",
    "Étiquettes et emballage d'origine conservés",
    "Retour initié dans les 30 jours suivant la réception",
    "Article accompagné du bon de retour fourni",
  ];

  const notEligible = [
    "Article porté, lavé ou présentant des traces d'usure",
    "Étiquettes manquantes ou emballage endommagé",
    "Retour demandé après le délai de 30 jours",
    "Articles soldés ou marqués « vente finale »",
  ];

  const details = [
    {
      icon: Truck,
      title: "Frais de retour",
      description:
        "Gratuits en France métropolitaine grâce à l'étiquette prépayée. Pour les autres destinations, les frais restent à votre charge, sauf article défectueux ou erreur de notre part.",
    },
    {
      icon: RotateCcw,
      title: "Retour vs échange",
      description:
        "Pour un échange de taille ou de couleur, précisez-le dans votre demande : nous expédions le nouvel article dès réception du colis retourné, sous réserve de disponibilité en stock.",
    },
    {
      icon: CreditCard,
      title: "Mode de remboursement",
      description:
        "Le remboursement est effectué sur le moyen de paiement utilisé lors de l'achat. Le délai d'apparition sur votre relevé dépend ensuite de votre banque (2 à 7 jours en général).",
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Retours"
        title="Retours et échanges"
        description="Une politique de retour simple et sans mauvaise surprise, sous 30 jours."
        image="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-16">
          {/* 3-step process */}
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((step) => (
              <Card key={step.title}>
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Eligibility conditions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Conditions de retour
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-foreground">
                      Éligible au retour
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {eligible.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-foreground">
                      Non éligible
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {notEligible.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional details */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Bon à savoir
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {details.map((detail) => (
                <Card key={detail.title}>
                  <CardContent className="p-6">
                    <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <detail.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {detail.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {detail.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Prêt à lancer un retour ?
              </h3>
              <p className="text-muted-foreground mb-4">
                Écrivez-nous en précisant votre numéro de commande, nous vous
                répondons rapidement.
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
              <p className="text-xs text-muted-foreground mt-4">
                Livraison gratuite dès{" "}
                {formatPrice(settings.free_shipping_threshold, settings.currency)}{" "}
                d&apos;achat · Retours gratuits en France métropolitaine
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
