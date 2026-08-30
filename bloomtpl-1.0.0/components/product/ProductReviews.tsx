"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductReviews } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { PaginatedReviews } from "@/types/review";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

function StarRow({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            i < rating ? "fill-primary text-primary" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({
  slug,
  initialReviews,
  averageRating,
  reviewsCount,
}: {
  slug: string;
  initialReviews: PaginatedReviews;
  averageRating: number | null;
  reviewsCount: number;
}) {
  const [page, setPage] = useState(initialReviews.meta.current_page);
  const [result, setResult] = useState(initialReviews);
  const [loading, setLoading] = useState(false);

  if (reviewsCount === 0) {
    return null;
  }

  const distribution = result.distribution || {};
  const maxCount = Math.max(...Object.values(distribution), 1);

  const goToPage = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > result.meta.last_page || loading) return;

    setLoading(true);
    const next = await getProductReviews(slug, nextPage);
    setResult(next);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <div id="avis" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Avis clients ({reviewsCount})
      </h2>

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6 text-center">
            <p className="text-5xl font-bold text-foreground mb-2">
              {averageRating?.toFixed(1) ?? "—"}
            </p>
            <div className="flex justify-center mb-2">
              <StarRow rating={Math.round(averageRating ?? 0)} size="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              Basé sur {reviewsCount} avis
            </p>

            <div className="mt-6 space-y-2 text-left">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[String(star)] ?? 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{star}</span>
                    <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div
            className={cn(
              "grid sm:grid-cols-2 gap-4 content-start transition-opacity",
              loading && "opacity-50"
            )}
          >
            {result.data.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <StarRow rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {review.author_name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || loading}
                aria-label="Page précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} sur {result.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(page + 1)}
                disabled={page >= result.meta.last_page || loading}
                aria-label="Page suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
