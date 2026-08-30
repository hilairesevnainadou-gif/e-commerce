import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";
import {
  GraduationCap,
  Heart,
  Mail,
  MessagesSquare,
  Rocket,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Carrières" };

const benefits = [
  {
    icon: Sparkles,
    title: "Une équipe à taille humaine",
    description:
      "Des échanges directs, sans lourdeur hiérarchique, où chaque avis compte réellement.",
  },
  {
    icon: Rocket,
    title: "Des responsabilités rapides",
    description:
      "Nous faisons confiance et donnons de l'autonomie dès les premiers mois.",
  },
  {
    icon: Heart,
    title: "Un cadre de travail flexible",
    description:
      "Télétravail partiel possible et horaires adaptés à l'équilibre de chacun.",
  },
  {
    icon: GraduationCap,
    title: "Apprentissage continu",
    description:
      "Formation et montée en compétences encouragées, quel que soit le poste.",
  },
];

const process = [
  {
    icon: Send,
    title: "1. Candidature",
    description: "Envoyez-nous votre CV et quelques lignes sur vos motivations.",
  },
  {
    icon: MessagesSquare,
    title: "2. Premier échange",
    description: "Un appel de 20 à 30 minutes pour faire connaissance.",
  },
  {
    icon: Users,
    title: "3. Rencontre avec l'équipe",
    description: "Un échange plus approfondi avec les personnes concernées.",
  },
];

const toc = [
  { id: "opportunites", label: "Nos opportunités" },
  { id: "pourquoi", label: "Pourquoi nous rejoindre" },
  { id: "process", label: "Notre process de recrutement" },
  { id: "candidature", label: "Candidature spontanée" },
];

export default async function CareersPage() {
  const settings = await getSettings();

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Carrières"
        title="Rejoignez l'aventure"
        description="Nous sommes toujours curieux de rencontrer des personnes passionnées."
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
              <Card id="opportunites" className="scroll-mt-24">
                <CardContent className="p-6 space-y-3">
                  <h2 className="font-semibold text-foreground mb-1">
                    Nos opportunités
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous n&apos;avons pas de poste ouvert publiquement pour le
                    moment, mais notre équipe grandit régulièrement. Nous
                    étudions avec attention chaque candidature spontanée qui
                    correspond à notre état d&apos;esprit.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pour en savoir plus sur qui nous sommes et ce qui nous
                    anime, découvrez notre page{" "}
                    <Link href="/about" className="text-primary hover:underline">
                      À propos
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card id="pourquoi" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Pourquoi nous rejoindre
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {benefits.map(({ icon: Icon, title, description }) => (
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

              <Card id="process" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Notre process de recrutement
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {process.map(({ icon: Icon, title, description }) => (
                      <div key={title}>
                        <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                          <Icon className="h-4 w-4 text-accent-foreground" />
                        </div>
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
                id="candidature"
                className="scroll-mt-24 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Candidature spontanée
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Envoyez-nous votre CV, nous serons ravis de le
                    découvrir.
                  </p>
                  {settings.contact_email && (
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {settings.contact_email}
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
