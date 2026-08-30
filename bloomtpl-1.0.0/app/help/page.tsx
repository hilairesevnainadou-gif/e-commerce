import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import {
  ChevronDown,
  CreditCard,
  Package,
  RotateCcw,
  UserCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Centre d'aide" };

export default async function HelpPage() {
  const settings = await getSettings();

  const categories = [
    {
      icon: Package,
      title: "Commandes & livraison",
      faqs: [
        {
          question: "Combien de temps prend la livraison ?",
          answer:
            "Les commandes sont généralement livrées sous 3 à 5 jours ouvrés en France métropolitaine, et sous 5 à 10 jours ouvrés pour le reste de l'Europe.",
        },
        {
          question: "Comment suivre ma commande ?",
          answer:
            "Un e-mail de confirmation avec un lien de suivi vous est envoyé dès l'expédition de votre colis. Vous pouvez aussi retrouver ce lien depuis votre espace client.",
        },
        {
          question: "Puis-je modifier ou annuler ma commande ?",
          answer: `Contactez-nous rapidement à ${settings.contact_email || "notre adresse de contact"} : nous ferons notre possible tant que la commande n'a pas encore été expédiée.`,
        },
        {
          question: "Livrez-vous à l'international ?",
          answer:
            "Oui, nous livrons dans le monde entier. Les frais et délais de livraison internationale varient selon la destination et sont calculés au moment du paiement.",
        },
        {
          question: "Les frais de livraison sont-ils inclus dans le prix affiché ?",
          answer: `Non, ils sont calculés lors du passage en caisse selon votre adresse. La livraison est offerte dès ${settings.free_shipping_threshold.toFixed(2)} ${settings.currency} d'achat.`,
        },
      ],
    },
    {
      icon: RotateCcw,
      title: "Retours & remboursements",
      faqs: [
        {
          question: "Comment retourner un article ?",
          answer:
            "Contactez notre service client avec votre numéro de commande, nous vous indiquerons la marche à suivre et l'étiquette de retour à utiliser.",
        },
        {
          question: "Quel est le délai pour effectuer un retour ?",
          answer:
            "Vous disposez de 30 jours à compter de la réception de votre commande pour nous retourner un article.",
        },
        {
          question: "Sous combien de temps suis-je remboursé ?",
          answer:
            "Le remboursement est effectué sous 5 jours ouvrés après réception et vérification de l'article retourné, sur le moyen de paiement utilisé lors de l'achat.",
        },
        {
          question: "Puis-je échanger un article contre une autre taille ?",
          answer:
            "Oui, précisez-le lors de votre demande de retour. Selon les stocks disponibles, nous vous envoyons la nouvelle taille dès réception de l'article initial.",
        },
        {
          question: "Les frais de retour sont-ils à ma charge ?",
          answer:
            "Les retours sont gratuits en France métropolitaine. Pour les autres destinations, les frais de retour restent à votre charge sauf en cas d'article défectueux.",
        },
      ],
    },
    {
      icon: CreditCard,
      title: "Paiement & sécurité",
      faqs: [
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer:
            "Nous acceptons les principales cartes bancaires (Visa, Mastercard, American Express) ainsi que les moyens de paiement affichés lors du passage en caisse.",
        },
        {
          question: "Mes informations de paiement sont-elles sécurisées ?",
          answer:
            "Oui, tous les paiements sont chiffrés et traités via des prestataires certifiés. Nous ne stockons jamais vos coordonnées bancaires sur nos serveurs.",
        },
        {
          question: "Puis-je utiliser plusieurs codes promo sur une commande ?",
          answer:
            "Un seul code promotionnel est applicable par commande. Le code le plus avantageux sera automatiquement retenu si plusieurs sont saisis.",
        },
        {
          question: "Recevrai-je une facture pour ma commande ?",
          answer:
            "Oui, une facture au format PDF vous est automatiquement envoyée par e-mail dès la validation de votre paiement.",
        },
      ],
    },
    {
      icon: UserCircle,
      title: "Compte & produits",
      faqs: [
        {
          question: "Ai-je besoin d'un compte pour commander ?",
          answer:
            "Non, la commande en tant qu'invité est possible. Créer un compte vous permet toutefois de suivre vos commandes et de commander plus rapidement.",
        },
        {
          question: "Comment réinitialiser mon mot de passe ?",
          answer:
            "Depuis la page de connexion, cliquez sur « Mot de passe oublié » et suivez les instructions envoyées par e-mail.",
        },
        {
          question: "Comment choisir la bonne taille ?",
          answer:
            "Chaque fiche produit inclut un guide des tailles détaillé. En cas de doute entre deux tailles, nous recommandons généralement de prendre la taille au-dessus.",
        },
        {
          question: "Comment entretenir mes sneakers ?",
          answer:
            "Nettoyez-les avec un chiffon légèrement humide et laissez-les sécher à l'air libre, à l'écart des sources de chaleur directe pour préserver les matériaux.",
        },
        {
          question: "Un produit est en rupture de stock, sera-t-il réapprovisionné ?",
          answer:
            "Cela dépend des modèles. Contactez-nous pour connaître la disponibilité prévue d'un article précis.",
        },
      ],
    },
  ];

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Centre d'aide"
        title="Comment pouvons-nous vous aider ?"
        description="Retrouvez les réponses aux questions les plus fréquentes, classées par thème."
        image="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Card key={category.title} className="h-fit">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  <div className="divide-y divide-border">
                    {category.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group py-4 first:pt-2 last:pb-0"
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-10">
            Vous ne trouvez pas de réponse à votre question ?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contactez-nous
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
