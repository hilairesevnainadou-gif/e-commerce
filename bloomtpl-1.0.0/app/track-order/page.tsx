import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";
import {
  HelpCircle,
  Mail,
  PackageCheck,
  PackageSearch,
  Send,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Suivi de commande" };

const steps = [
  {
    icon: Send,
    title: "1. Confirmation de commande",
    description:
      "Dès validation de votre paiement, vous recevez un e-mail récapitulant votre commande et son numéro.",
  },
  {
    icon: PackageCheck,
    title: "2. Préparation & expédition",
    description:
      "Une fois votre commande préparée, un e-mail d'expédition vous est envoyé avec votre numéro de suivi.",
  },
  {
    icon: PackageSearch,
    title: "3. Suivi du colis",
    description:
      "Utilisez ce numéro directement sur le site du transporteur pour suivre l'acheminement de votre colis en temps réel.",
  },
];

const faqs = [
  {
    question: "Je n'ai pas reçu de numéro de suivi",
    answer:
      "Le numéro de suivi est envoyé par e-mail dès l'expédition de votre commande, généralement sous 24 à 48h ouvrées. Pensez à vérifier vos courriers indésirables.",
  },
  {
    question: "Mon suivi ne s'affiche pas encore",
    answer:
      "Comptez quelques heures après réception de l'e-mail d'expédition pour que le transporteur active le suivi dans son système.",
  },
  {
    question: "Le statut n'a pas changé depuis plusieurs jours",
    answer:
      "Cela peut arriver en cours d'acheminement. Si le statut reste inchangé plus de 5 jours, contactez notre service client avec votre numéro de commande.",
  },
];

const toc = [
  { id: "etapes", label: "Comment suivre ma commande" },
  { id: "numero", label: "Trouver mon numéro de suivi" },
  { id: "faq", label: "Questions fréquentes" },
  { id: "contact", label: "Nous contacter" },
];

export default async function TrackOrderPage() {
  const settings = await getSettings();

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Suivi de commande"
        title="Où en est ma commande ?"
        description="Retrouvez toutes les étapes pour suivre l'acheminement de votre colis."
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
              <Card id="etapes" className="scroll-mt-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Comment suivre votre commande
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {steps.map(({ icon: Icon, title, description }) => (
                      <div key={title}>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Icon className="h-4 w-4 text-primary" />
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

              <Card id="numero" className="scroll-mt-24">
                <CardContent className="p-6 space-y-3">
                  <h2 className="font-semibold text-foreground mb-1">
                    Où trouver mon numéro de suivi ?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Votre numéro de suivi figure dans l&apos;e-mail
                    d&apos;expédition envoyé dès que votre commande quitte
                    notre entrepôt. Il vous suffit de le reporter sur le site
                    du transporteur pour connaître la position exacte de
                    votre colis.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pour en savoir plus sur nos délais et zones de livraison,
                    consultez notre page{" "}
                    <Link
                      href="/shipping"
                      className="text-primary hover:underline"
                    >
                      Informations de livraison
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card id="faq" className="scroll-mt-24">
                <CardContent className="p-6 sm:p-8 divide-y divide-border">
                  <h2 className="font-semibold text-foreground mb-2">
                    Questions fréquentes
                  </h2>
                  {faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group py-4 first:pt-2 last:pb-0"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                          {faq.question}
                        </span>
                      </summary>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </CardContent>
              </Card>

              <Card
                id="contact"
                className="scroll-mt-24 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Toujours pas de nouvelles de votre colis ?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Contactez notre service client en précisant votre numéro
                    de commande, nous vérifierons son statut avec vous.
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
                  <Link
                    href="/contact"
                    className="inline-block mt-4 text-sm text-primary hover:underline"
                  >
                    Ou utilisez notre formulaire de contact →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
