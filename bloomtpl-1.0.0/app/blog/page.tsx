import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Blog"
        title="Actualités et inspiration"
        description="Nos articles sur les tendances sneakers, les conseils d'entretien et les coulisses de la marque."
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <Newspaper className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-semibold text-foreground">
                Le blog arrive bientôt
              </h3>
              <p className="text-muted-foreground">
                Nous préparons nos premiers articles. Revenez prochainement
                pour les découvrir.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
