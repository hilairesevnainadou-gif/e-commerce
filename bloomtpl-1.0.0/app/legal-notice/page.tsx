import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function LegalNoticePage() {
  const settings = await getSettings();

  const sections = [
    {
      id: "edition",
      title: "1. Édition du site",
      content: [
        `Le présent site est édité par ${settings.site_name}.`,
        "Forme juridique : à compléter (ex. SAS, SASU, EURL...)",
        "Capital social : à compléter",
        "SIREN / SIRET : à compléter",
        "Numéro de TVA intracommunautaire : à compléter",
        settings.contact_address
          ? `Siège social : ${settings.contact_address}`
          : "Siège social : à compléter",
        settings.contact_email ? `Contact : ${settings.contact_email}` : null,
        settings.contact_phone ? `Téléphone : ${settings.contact_phone}` : null,
      ].filter(Boolean) as string[],
    },
    {
      id: "directeur",
      title: "2. Directeur de la publication",
      content: [
        `Le directeur de la publication du site est le représentant légal de ${settings.site_name}. Pour toute question relative au contenu du site, vous pouvez le contacter via les coordonnées mentionnées à la section « Édition du site ».`,
      ],
    },
    {
      id: "hebergement",
      title: "3. Hébergement",
      content: [
        "Le site est hébergé par : à compléter (nom, adresse et contact de l'hébergeur).",
        "En cas de dysfonctionnement technique, contactez notre service client qui se chargera de relayer votre demande auprès de l'hébergeur si nécessaire.",
      ],
    },
    {
      id: "propriete",
      title: "4. Propriété intellectuelle",
      content: [
        `L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes, icônes) est la propriété de ${settings.site_name} ou de ses partenaires, sauf mention contraire.`,
        "Toute reproduction, représentation, modification ou exploitation de tout ou partie de ces éléments, sans autorisation préalable, est interdite et pourrait constituer une contrefaçon sanctionnée par le Code de la propriété intellectuelle.",
        "Les marques et logos figurant sur le site sont des marques déposées par leurs propriétaires respectifs.",
      ],
    },
    {
      id: "donnees",
      title: "5. Données personnelles",
      content: [
        "Les informations recueillies via le site font l'objet d'un traitement destiné à la gestion des commandes, du compte client et de la relation commerciale, conformément au Règlement Général sur la Protection des Données (RGPD).",
        "Ces données sont conservées pendant la durée nécessaire à la finalité du traitement, puis archivées ou supprimées conformément à la réglementation en vigueur.",
        "Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données, ainsi que d'un droit d'opposition et de limitation du traitement.",
        settings.contact_email
          ? `Pour exercer ces droits, contactez-nous à ${settings.contact_email}.`
          : "Pour exercer ces droits, contactez-nous via notre page Contact.",
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies",
      content: [
        "Le site utilise des cookies strictement nécessaires à son bon fonctionnement (panier, session) ainsi que des cookies de mesure d'audience, avec votre consentement lorsqu'il est requis.",
        "Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies. Pour en savoir plus, consultez notre Politique de cookies.",
      ],
    },
    {
      id: "litiges",
      title: "7. Litiges et médiation",
      content: [
        "Le présent site et ses conditions d'utilisation sont soumis au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.",
        "Conformément à l'article L.616-1 du Code de la consommation, vous pouvez recourir gratuitement au service de médiation de la consommation compétent dans un délai d'un an à compter de votre réclamation écrite.",
        "À défaut de résolution amiable, les tribunaux français seront seuls compétents pour connaître du litige.",
      ],
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Mentions légales"
        title="Mentions légales"
        description="Informations légales relatives à l'édition et à l'exploitation du site."
        image="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1600&auto=format&fit=crop"
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
