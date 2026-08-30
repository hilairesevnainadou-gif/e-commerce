import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import {
  ClipboardList,
  Eye,
  ImageIcon,
  Keyboard,
  Volume2,
  ZoomIn,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibilité" };

const features = [
  {
    icon: Keyboard,
    title: "Navigation au clavier",
    description:
      "L'ensemble du site — catalogue, panier, compte, paiement — est utilisable au clavier, sans nécessiter l'usage d'une souris.",
  },
  {
    icon: Eye,
    title: "Contrastes de couleurs",
    description:
      "Nous veillons à des contrastes suffisants entre le texte et les arrière-plans pour une meilleure lisibilité.",
  },
  {
    icon: ImageIcon,
    title: "Textes alternatifs",
    description:
      "Les images et photos produits sont accompagnées de descriptions textuelles à destination des lecteurs d'écran.",
  },
  {
    icon: Volume2,
    title: "Compatibilité lecteurs d'écran",
    description:
      "Le site est conçu pour être compatible avec les principaux lecteurs d'écran (NVDA, JAWS, VoiceOver).",
  },
  {
    icon: ZoomIn,
    title: "Zoom et redimensionnement",
    description:
      "Le contenu reste lisible et fonctionnel jusqu'à un zoom de 200% sans perte d'information ni de fonctionnalité.",
  },
  {
    icon: ClipboardList,
    title: "Formulaires accessibles",
    description:
      "Nos formulaires comportent des libellés clairs, associés à leurs champs, et des messages d'erreur explicites.",
  },
];

const techTable = [
  { browser: "Chrome / Edge", assistive: "NVDA", status: "Testé" },
  { browser: "Firefox", assistive: "NVDA", status: "Testé" },
  { browser: "Safari (macOS / iOS)", assistive: "VoiceOver", status: "Testé" },
  { browser: "Chrome (Android)", assistive: "TalkBack", status: "Testé" },
];

const limitations = [
  "Certains documents PDF plus anciens peuvent ne pas être totalement structurés pour les lecteurs d'écran.",
  "Les widgets tiers (paiement, cartes) dépendent de l'accessibilité fournie par leurs éditeurs respectifs.",
  "Certaines vidéos intégrées peuvent ne pas encore disposer de sous-titres complets.",
];

const process = [
  {
    title: "Audits réguliers",
    description:
      "Nous évaluons périodiquement le site à l'aide d'outils automatisés et de vérifications manuelles.",
  },
  {
    title: "Tests avec technologies d'assistance",
    description:
      "Les principaux parcours (recherche, fiche produit, panier, commande) sont testés au clavier et avec des lecteurs d'écran.",
  },
  {
    title: "Prise en compte des retours",
    description:
      "Chaque signalement d'un utilisateur est étudié et priorisé dans nos correctifs.",
  },
  {
    title: "Sensibilisation des équipes",
    description:
      "Les bonnes pratiques d'accessibilité sont intégrées dès la conception de chaque nouvelle fonctionnalité.",
  },
];

const toc = [
  { id: "engagement", label: "Notre engagement" },
  { id: "fonctionnalites", label: "Fonctionnalités" },
  { id: "conformite", label: "Niveau de conformité" },
  { id: "technologies", label: "Technologies compatibles" },
  { id: "limitations", label: "Limitations connues" },
  { id: "demarche", label: "Démarche d'amélioration" },
  { id: "signaler", label: "Signaler un problème" },
];

export default async function AccessibilityPage() {
  const settings = await getSettings();

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Accessibilité"
        title="Notre engagement d'accessibilité"
        description={`${settings.site_name} s'efforce de rendre son site accessible au plus grand nombre.`}
      />

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <nav className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Sommaire
                </p>
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="space-y-6">
              <Card id="engagement" className="scroll-mt-24">
                <CardContent className="p-6 space-y-3">
                  <h2 className="font-semibold text-foreground mb-1">
                    Notre engagement
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous travaillons continuellement à améliorer
                    l&apos;accessibilité de notre boutique en ligne, afin
                    qu&apos;elle puisse être utilisée par le plus grand
                    nombre, quels que soient le matériel, les logiciels, la
                    langue ou les capacités de chacun.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cet engagement couvre l&apos;ensemble du parcours
                    d&apos;achat : navigation dans le catalogue, recherche,
                    fiche produit, panier, création de compte et commande.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Si vous rencontrez une difficulté pour naviguer sur le
                    site ou accéder à un contenu, n&apos;hésitez pas à nous
                    en informer : nous ferons notre possible pour y remédier
                    rapidement.
                  </p>
                </CardContent>
              </Card>

              <Card id="fonctionnalites" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Fonctionnalités d&apos;accessibilité
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {features.map(({ icon: Icon, title, description }) => (
                      <div key={title} className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card id="conformite" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-3">
                    Niveau de conformité
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous nous efforçons de nous conformer aux critères du
                    Référentiel Général d&apos;Amélioration de
                    l&apos;Accessibilité (RGAA) et aux recommandations
                    internationales WCAG 2.1 niveau AA. Cette démarche
                    s&apos;inscrit dans une amélioration continue : certains
                    contenus peuvent ne pas encore être totalement
                    conformes, et nous travaillons activement à combler ces
                    écarts.
                  </p>
                </CardContent>
              </Card>

              <Card id="technologies" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Technologies compatibles
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Le site a été testé avec les combinaisons suivantes de
                    navigateurs et de technologies d&apos;assistance :
                  </p>
                  <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-medium px-4 py-3">
                            Navigateur
                          </th>
                          <th className="text-left font-medium px-4 py-3">
                            Technologie d&apos;assistance
                          </th>
                          <th className="text-left font-medium px-4 py-3">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {techTable.map((row) => (
                          <tr key={row.browser}>
                            <td className="px-4 py-3 text-foreground">
                              {row.browser}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {row.assistive}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card id="limitations" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-3">
                    Limitations connues
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    En toute transparence, certains éléments du site peuvent
                    présenter des limitations d&apos;accessibilité que nous
                    cherchons activement à corriger :
                  </p>
                  <ul className="space-y-2">
                    {limitations.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card id="demarche" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Notre démarche d&apos;amélioration continue
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {process.map(({ title, description }) => (
                      <div key={title}>
                        <h3 className="text-sm font-semibold text-foreground mb-1">
                          {title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                id="signaler"
                className="scroll-mt-24 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
              >
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Un problème d&apos;accessibilité à signaler ?
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Décrivez-nous la page concernée, la difficulté rencontrée
                    et, si possible, la technologie utilisée (navigateur,
                    lecteur d&apos;écran). Nous vous répondrons dans les
                    meilleurs délais.
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
          </div>
        </div>
      </section>
    </div>
  );
}
