import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default async function PrivacyPage() {
  const settings = await getSettings();

  const sections: { id: string; title: string; content: ReactNode[] }[] = [
    {
      id: "collecte",
      title: "1. Données que nous collectons",
      content: [
        "Lorsque vous créez un compte, passez commande ou nous contactez, nous collectons certaines informations vous concernant : nom, prénom, adresse e-mail, adresse postale, numéro de téléphone et, le cas échéant, des informations de paiement.",
        "Nous collectons également des données de navigation (pages consultées, contenu du panier, préférences) afin d'améliorer votre expérience sur le site.",
      ],
    },
    {
      id: "utilisation",
      title: "2. Utilisation de vos données",
      content: [
        "Vos données sont utilisées pour traiter et livrer vos commandes, gérer votre compte client, assurer le suivi de vos demandes auprès de notre service client et, avec votre consentement, vous envoyer notre newsletter et nos offres promotionnelles.",
        "Elles peuvent également être utilisées à des fins statistiques, afin d'améliorer nos produits et la performance du site.",
      ],
    },
    {
      id: "partage",
      title: "3. Partage des données",
      content: [
        `${settings.site_name} ne vend ni ne loue vos données personnelles à des tiers.`,
        "Vos données peuvent être transmises à nos prestataires de confiance (transporteurs, moyens de paiement, hébergement) uniquement dans la mesure nécessaire à l'exécution de nos services, et dans le respect de la réglementation en vigueur.",
      ],
    },
    {
      id: "securite",
      title: "4. Sécurité des données",
      content: [
        "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées (chiffrement, accès restreint, hébergement sécurisé) pour protéger vos données contre tout accès non autorisé, perte ou divulgation.",
        "Vos informations bancaires ne sont jamais stockées sur nos serveurs.",
      ],
    },
    {
      id: "conservation",
      title: "5. Durée de conservation",
      content: [
        "Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, c'est-à-dire la durée de votre relation commerciale avec nous, augmentée des délais légaux de conservation applicables (comptabilité, garanties).",
        "Les données liées à la navigation sont conservées pour une durée maximale de 13 mois.",
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies",
      content: [
        <>
          Le site utilise des cookies pour assurer son bon fonctionnement et
          améliorer votre expérience de navigation. Pour en savoir plus sur
          les cookies utilisés et la manière de les gérer, consultez notre{" "}
          <Link href="/cookies" className="text-primary hover:underline">
            Politique de cookies
          </Link>
          .
        </>,
      ],
    },
    {
      id: "droits",
      title: "7. Vos droits (RGPD)",
      content: [
        "Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données, ainsi que d'un droit d'opposition et de limitation du traitement.",
        "Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.",
        settings.contact_email
          ? `Pour exercer ces droits, contactez-nous à ${settings.contact_email}.`
          : "Pour exercer ces droits, contactez-nous via notre page Contact.",
      ],
    },
    {
      id: "contact",
      title: "8. Nous contacter",
      content: [
        "Pour toute question relative à la présente politique de confidentialité ou à l'exercice de vos droits, vous pouvez nous contacter :",
        [settings.contact_email, settings.contact_phone, settings.contact_address]
          .filter(Boolean)
          .join(" · "),
      ].filter(Boolean),
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Mentions légales"
        title="Politique de confidentialité"
        description="Comment nous collectons, utilisons et protégeons vos données personnelles."
        image="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1600&auto=format&fit=crop"
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
