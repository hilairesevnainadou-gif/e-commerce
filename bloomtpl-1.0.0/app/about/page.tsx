import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Heart,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "À propos" };

const values = [
  {
    icon: Sparkles,
    title: "Qualité & exigence",
    description:
      "Chaque référence est sélectionnée avec soin auprès de marques et d'ateliers exigeants, pour une qualité constante.",
  },
  {
    icon: ShieldCheck,
    title: "Fiabilité",
    description:
      "Des produits authentiques, des descriptions honnêtes et un stock vérifié en temps réel.",
  },
  {
    icon: Users,
    title: "Service client",
    description:
      "Une équipe disponible et réactive pour vous accompagner avant, pendant et après votre achat.",
  },
  {
    icon: Heart,
    title: "Engagement durable",
    description:
      "Nous privilégions des partenaires responsables et des emballages réduits pour limiter notre impact.",
  },
];

const team = [
  {
    icon: Search,
    title: "Sélection & curation",
    description:
      "Notre équipe produit teste et sélectionne chaque référence avant qu'elle ne rejoigne notre catalogue.",
  },
  {
    icon: MessageCircle,
    title: "Service client",
    description:
      "Toujours disponible pour répondre à vos questions, du choix de la taille au suivi de commande.",
  },
  {
    icon: Truck,
    title: "Logistique & expédition",
    description:
      "Une équipe dédiée prépare et expédie chaque commande avec le plus grand soin.",
  },
];

const expertise = [
  "Vêtements femme & homme",
  "Sneakers & chaussures",
  "Accessoires (sacs, casquettes, bijoux...)",
  "Conseils de taille personnalisés",
];

const reasons = [
  "Une sélection resserrée et testée, sans surplus inutile.",
  "Livraison rapide et soignée, suivie de bout en bout.",
  "Retours simples sous 30 jours, sans complication.",
  "Paiement sécurisé par virement bancaire.",
  "Un service client humain et réactif.",
];

const toc = [
  { id: "histoire", label: "Notre histoire" },
  { id: "mission", label: "Notre mission" },
  { id: "valeurs", label: "Nos valeurs" },
  { id: "equipe", label: "Notre équipe" },
  { id: "savoir-faire", label: "Notre savoir-faire" },
  { id: "pourquoi", label: "Pourquoi nous choisir" },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Notre histoire"
        title={`À propos de ${settings.site_name}`}
        description={
          settings.tagline ||
          "Découvrez qui nous sommes et pourquoi nous faisons ce que nous faisons."
        }
        image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
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
              <Card id="histoire" className="scroll-mt-24">
                <CardContent className="p-6 space-y-3">
                  <h2 className="font-semibold text-foreground mb-1">
                    Notre histoire
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {settings.site_name} est né d&apos;une conviction simple :
                    trouver la pièce parfaite — un vêtement, une paire de
                    sneakers ou un accessoire — ne devrait jamais être
                    compliqué, que vous soyez une femme ou un homme. Nous
                    avons construit une boutique en ligne pensée pour aller à
                    l&apos;essentiel : une sélection resserrée pour toute la
                    garde-robe, des descriptions honnêtes et un service
                    client réactif.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {settings.description ||
                      "Depuis nos débuts, nous travaillons chaque jour pour proposer des produits qui allient confort, design et durabilité, sans jamais sacrifier la qualité au profit du volume."}
                  </p>
                </CardContent>
              </Card>

              <Card id="mission" className="scroll-mt-24 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                    Notre mission
                  </p>
                  <p className="text-foreground font-medium leading-relaxed">
                    Rendre accessible à toutes et tous des vêtements,
                    sneakers et accessoires de qualité, choisis avec
                    exigence, livrés avec soin et accompagnés d&apos;un
                    service sur qui l&apos;on peut vraiment compter.
                  </p>
                </CardContent>
              </Card>

              <Card id="valeurs" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Nos valeurs
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {values.map(({ icon: Icon, title, description }) => (
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

              <Card id="equipe" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Notre équipe
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {team.map(({ icon: Icon, title, description }) => (
                      <div key={title} className="space-y-2">
                        <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">
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

              <Card id="savoir-faire" className="scroll-mt-24">
                <CardContent className="p-6 grid sm:grid-cols-2 gap-6 items-start">
                  <div>
                    <h2 className="font-semibold text-foreground mb-2">
                      Notre savoir-faire
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Depuis nos débuts, nous nous concentrons sur un secteur
                      que nous connaissons bien : la mode féminine et
                      masculine, des vêtements du quotidien aux sneakers, en
                      passant par les accessoires. Cette spécialisation nous
                      permet d&apos;apporter un regard expert à chaque étape,
                      de la sélection des pièces jusqu&apos;au service
                      après-vente.
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {expertise.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card id="pourquoi" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Pourquoi nous choisir
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {reasons.map((reason) => (
                      <div key={reason} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Prêt à trouver votre prochaine pièce coup de cœur ?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Découvrez notre sélection ou contactez-nous, notre équipe
                    est là pour vous aider.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild>
                      <Link href="/shop">Découvrir la boutique</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/contact">Nous contacter</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
