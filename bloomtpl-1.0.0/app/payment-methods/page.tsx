import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import {
  Building2,
  ChevronDown,
  FileText,
  Mail,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Moyens de paiement" };

export default async function PaymentMethodsPage() {
  const settings = await getSettings();

  const steps = [
    {
      icon: ShoppingCart,
      title: "1. Validez votre commande",
      description:
        "Finalisez votre panier et choisissez « Virement bancaire » comme mode de paiement.",
    },
    {
      icon: Mail,
      title: "2. Recevez nos coordonnées bancaires",
      description:
        "Un e-mail vous est envoyé avec l'IBAN et le montant exact à régler, incluant votre numéro de commande.",
    },
    {
      icon: Building2,
      title: "3. Effectuez le virement",
      description:
        "Réalisez le virement depuis votre banque en indiquant bien le numéro de commande dans le libellé.",
    },
    {
      icon: PackageCheck,
      title: "4. Votre commande est expédiée",
      description:
        "Dès réception et validation du virement (1 à 3 jours ouvrés), votre commande est préparée puis expédiée.",
    },
  ];

  const details = [
    {
      icon: FileText,
      title: "Taxes et facturation",
      description: `Tous les prix affichés sont exprimés en ${settings.currency}, toutes taxes comprises. Une facture est envoyée par e-mail dès validation du paiement.`,
    },
    {
      icon: RotateCcw,
      title: "Remboursements",
      description:
        "Les remboursements sont effectués par virement bancaire sous 7 jours ouvrés après vérification du produit retourné.",
    },
    {
      icon: ShieldCheck,
      title: "Sécurité des paiements",
      description:
        "Vos coordonnées bancaires ne transitent jamais par nos serveurs. Chaque virement est vérifié manuellement avant validation de la commande.",
    },
    {
      icon: XCircle,
      title: "Paiements non identifiés",
      description:
        "Sans le numéro de commande dans le libellé du virement, l'identification du paiement peut être retardée de plusieurs jours.",
    },
    {
      icon: RotateCcw,
      title: "Annulation de commande",
      description:
        "Une commande peut être annulée tant que le virement n'a pas été reçu et validé. Contactez-nous dès que possible.",
    },
  ];

  const faqs = [
    {
      question: "Combien de temps faut-il pour que mon virement soit traité ?",
      answer:
        "Le délai varie généralement de 1 à 3 jours ouvrés selon votre banque. Votre commande est préparée dès réception et validation du paiement.",
    },
    {
      question: "Proposez-vous le paiement en plusieurs fois ?",
      answer: "Non, le paiement en plusieurs fois n'est pas proposé actuellement.",
    },
    {
      question: "Recevrai-je une confirmation après mon virement ?",
      answer:
        "Oui, un e-mail de confirmation vous est envoyé dès réception et validation de votre paiement.",
    },
    {
      question: "Puis-je bénéficier d'une exonération de TVA ?",
      answer:
        "Les entreprises de l'Union européenne disposant d'un numéro de TVA intracommunautaire valide peuvent, sous conditions, bénéficier d'une exonération. Contactez-nous avant de passer commande.",
    },
    {
      question: "Qui prend en charge les frais de douane à l'international ?",
      answer:
        "Les éventuels frais de douane ou taxes locales restent à la charge du destinataire pour les livraisons hors Union européenne.",
    },
    {
      question: "Que se passe-t-il si je ne paie pas dans les délais ?",
      answer:
        "Passé un délai de 5 jours sans virement reçu, votre commande peut être automatiquement annulée pour libérer le stock réservé.",
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Paiement"
        title="Moyens de paiement"
        description="Un paiement simple et sécurisé par virement bancaire."
        image="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-16">
          {/* Prominent payment method + steps */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Mode de paiement
                </p>
                <h2 className="text-xl font-bold text-foreground">
                  Virement bancaire
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mb-8">
              Le virement bancaire est le seul mode de paiement disponible sur
              notre site. Voici comment ça se passe, étape par étape.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardContent className="p-6">
                    <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Policy details */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Bon à savoir
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {details.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardContent className="p-6">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Questions fréquentes
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <Card className="md:row-span-3">
                <CardContent className="p-6 sm:p-8 divide-y divide-border">
                  {faqs.slice(0, 3).map((faq, index) => (
                    <details
                      key={index}
                      className="group py-4 first:pt-0 last:pb-0"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-foreground">
                        {faq.question}
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </CardContent>
              </Card>
              <Card className="md:row-span-3">
                <CardContent className="p-6 sm:p-8 divide-y divide-border">
                  {faqs.slice(3).map((faq, index) => (
                    <details
                      key={index}
                      className="group py-4 first:pt-0 last:pb-0"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-foreground">
                        {faq.question}
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Une question sur votre paiement ?
              </h3>
              <p className="text-muted-foreground mb-4">
                Notre équipe est disponible pour vous accompagner.
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
                d&apos;achat
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
