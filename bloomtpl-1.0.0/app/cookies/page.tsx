import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Politique de cookies" };

const cookieTable = [
  {
    name: "cart_session",
    purpose: "Mémorisation du contenu de votre panier",
    duration: "Session",
  },
  {
    name: "laravel_session",
    purpose: "Authentification et sécurité de la session",
    duration: "Session",
  },
  {
    name: "XSRF-TOKEN",
    purpose: "Protection contre les attaques de type CSRF",
    duration: "Session",
  },
  {
    name: "cookie_consent",
    purpose: "Mémorisation de votre choix concernant les cookies",
    duration: "6 mois",
  },
  {
    name: "_ga (si accepté)",
    purpose: "Mesure d'audience et statistiques de visite",
    duration: "13 mois",
  },
];

export default async function CookiesPage() {
  const settings = await getSettings();

  const sections: { id: string; title: string; content: ReactNode[] }[] = [
    {
      id: "definition",
      title: "1. Qu'est-ce qu'un cookie ?",
      content: [
        "Un cookie est un petit fichier texte déposé sur votre ordinateur, votre tablette ou votre smartphone lors de la consultation d'un site internet. Il permet de reconnaître votre navigateur et de mémoriser certaines informations d'une visite à l'autre.",
      ],
    },
    {
      id: "essentiels",
      title: "2. Cookies essentiels",
      content: [
        "Ces cookies sont indispensables au fonctionnement du site : ils permettent notamment de conserver le contenu de votre panier, de gérer votre session de connexion et d'assurer la sécurité de vos transactions. Ils ne peuvent pas être désactivés.",
      ],
    },
    {
      id: "audience",
      title: "3. Cookies de mesure d'audience",
      content: [
        "Ces cookies nous permettent de comprendre comment le site est utilisé (pages visitées, parcours de navigation) afin d'en améliorer le contenu et l'ergonomie. Ils ne sont déposés qu'avec votre consentement.",
      ],
    },
    {
      id: "tiers",
      title: "4. Cookies tiers",
      content: [
        "Certains cookies peuvent être déposés par des services tiers intégrés au site, comme les réseaux sociaux ou les outils de messagerie (WhatsApp). Ces services disposent de leur propre politique de confidentialité, indépendante de la nôtre.",
      ],
    },
    {
      id: "duree",
      title: "5. Durée de conservation",
      content: [
        "Les cookies essentiels sont conservés le temps de votre session de navigation. Les cookies de mesure d'audience sont conservés pour une durée maximale de 13 mois, conformément aux recommandations de la CNIL.",
      ],
    },
    {
      id: "gestion",
      title: "6. Gérer vos préférences",
      content: [
        "Vous pouvez à tout moment accepter, refuser ou supprimer les cookies via les paramètres de votre navigateur : Chrome, Firefox, Safari et Edge proposent chacun une rubrique dédiée à la gestion des cookies dans leurs paramètres de confidentialité.",
        "Le refus de certains cookies essentiels peut affecter le bon fonctionnement du site, notamment le panier d'achat.",
      ],
    },
    {
      id: "contact",
      title: "7. Nous contacter",
      content: [
        "Pour toute question relative à l'utilisation des cookies sur ce site, vous pouvez nous contacter :",
        settings.contact_email ?? "via notre page Contact.",
      ].filter(Boolean),
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Mentions légales"
        title="Politique de cookies"
        description="Comment nous utilisons les cookies pour améliorer votre expérience."
        image="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1600&auto=format&fit=crop"
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
                <a
                  href="#tableau"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5"
                >
                  Cookies utilisés
                </a>
              </div>
            </nav>

            <div className="space-y-6 max-w-3xl">
              {sections.slice(0, 4).map((section) => (
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

              <Card id="tableau" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Cookies utilisés sur ce site
                  </h2>
                  <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                            Cookie
                          </th>
                          <th className="text-left font-medium px-4 py-3">
                            Finalité
                          </th>
                          <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                            Durée
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {cookieTable.map((row) => (
                          <tr key={row.name}>
                            <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">
                              {row.name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {row.purpose}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {row.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {sections.slice(4).map((section) => (
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
