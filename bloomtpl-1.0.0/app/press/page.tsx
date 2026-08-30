import StaticPageHero from "@/components/layout/StaticPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Presse" };

export default async function PressPage() {
  const settings = await getSettings();

  return (
    <div className="bg-background">
      <StaticPageHero
        badge="Presse"
        title="Espace presse"
        description={`Vous êtes journaliste ou créateur de contenu et souhaitez parler de ${settings.site_name} ?`}
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-muted-foreground">
                Pour toute demande d&apos;interview, de visuels haute
                définition ou d&apos;information sur la marque, contactez
                notre équipe.
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
      </section>
    </div>
  );
}
