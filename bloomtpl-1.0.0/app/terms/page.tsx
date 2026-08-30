import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Conditions générales" };

export default async function TermsPage() {
  const settings = await getSettings();

  const sections: { id: string; title: string; content: ReactNode[] }[] = [
    {
      id: "objet",
      title: "1. Objet",
      content: [
        `Les présentes conditions générales de vente (CGV) régissent les ventes de produits réalisées sur le site ${settings.site_name}. Toute commande passée sur le site implique l'acceptation sans réserve des présentes CGV.`,
      ],
    },
    {
      id: "produits",
      title: "2. Produits",
      content: [
        "Les produits proposés à la vente sont ceux figurant sur le site au jour de la consultation, dans la limite des stocks disponibles.",
        "Les photographies et descriptions des produits sont les plus fidèles possibles mais ne peuvent garantir une similitude parfaite avec le produit, notamment en ce qui concerne les couleurs.",
      ],
    },
    {
      id: "commandes",
      title: "3. Commandes",
      content: [
        "En passant commande, vous confirmez que les informations fournies sont exactes et que vous êtes autorisé à utiliser le moyen de paiement choisi.",
        "Une confirmation de commande vous est envoyée par e-mail, récapitulant les articles commandés, les prix et les modalités de livraison.",
      ],
    },
    {
      id: "prix",
      title: "4. Prix et paiement",
      content: [
        `Les prix sont indiqués en ${settings.currency}, toutes taxes comprises. ${settings.site_name} se réserve le droit de modifier ses prix à tout moment, les produits étant facturés sur la base du tarif en vigueur au moment de la validation de la commande.`,
        <>
          Le paiement s&apos;effectue par virement bancaire, comme précisé sur
          notre page{" "}
          <Link href="/payment-methods" className="text-primary hover:underline">
            Moyens de paiement
          </Link>
          . La commande n&apos;est validée qu&apos;après réception du
          paiement.
        </>,
      ],
    },
    {
      id: "livraison",
      title: "5. Livraison",
      content: [
        <>
          Les délais et frais de livraison sont indiqués lors de la commande
          et détaillés sur notre page{" "}
          <Link href="/shipping" className="text-primary hover:underline">
            Informations de livraison
          </Link>
          .
        </>,
        "Conformément au Code de la consommation, le risque de perte ou d'endommagement des produits vous est transféré au moment où vous, ou un tiers désigné par vous, prenez physiquement possession des produits.",
      ],
    },
    {
      id: "retractation",
      title: "6. Droit de rétractation et retours",
      content: [
        "Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motif.",
        <>
          Les modalités de retour et de remboursement sont détaillées sur
          notre page{" "}
          <Link href="/returns" className="text-primary hover:underline">
            Retours et échanges
          </Link>
          .
        </>,
      ],
    },
    {
      id: "garanties",
      title: "7. Garanties légales",
      content: [
        "Tous les produits bénéficient de la garantie légale de conformité (articles L.217-3 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).",
        "En cas de non-conformité, vous pouvez choisir entre la réparation ou le remplacement du produit, sous réserve des conditions de coût prévues par la loi.",
      ],
    },
    {
      id: "responsabilite",
      title: "8. Responsabilité",
      content: [
        `${settings.site_name} met tout en œuvre pour garantir l'exactitude des informations présentées sur le site, sans pouvoir garantir l'absence totale d'erreur.`,
        "Notre responsabilité ne saurait être engagée en cas d'inexécution due à un cas de force majeure, ou en cas d'usage anormal ou frauduleux du site par un tiers.",
      ],
    },
    {
      id: "propriete",
      title: "9. Propriété intellectuelle",
      content: [
        `L'ensemble des éléments du site (textes, images, logos, graphismes) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de ${settings.site_name} ou de ses partenaires. Toute reproduction non autorisée est interdite.`,
      ],
    },
    {
      id: "litiges",
      title: "10. Litiges et droit applicable",
      content: [
        "Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.",
        "Conformément à l'article L.616-1 du Code de la consommation, vous pouvez recourir gratuitement au service de médiation de la consommation compétent dans un délai d'un an à compter de votre réclamation écrite.",
      ],
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Mentions légales"
        title="Conditions générales de vente"
        description="Les règles qui encadrent l'utilisation de notre boutique en ligne."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <nav className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Sommaire
                </p>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </nav>

            <div className="space-y-6 max-w-3xl">
              {sections.map((section) => (
                <Card key={section.id} id={section.id} className="scroll-mt-24">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-foreground mb-3">
                      {section.title}
                    </h2>
                    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                      {section.content.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
