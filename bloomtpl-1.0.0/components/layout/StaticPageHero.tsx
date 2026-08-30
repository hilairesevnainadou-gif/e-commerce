import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function StaticPageHero({
  badge,
  title,
  description,
  image,
}: {
  badge: string;
  title: string;
  description?: string;
  image?: string;
}) {
  if (image) {
    return (
      <section className="relative h-[260px] sm:h-[320px] flex items-center">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary text-primary-foreground">
              {badge}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 lg:py-14 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary text-primary-foreground">{badge}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
