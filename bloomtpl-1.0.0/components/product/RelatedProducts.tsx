"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { currency } = useSettings();

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Produits similaires
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/" className="text-primary hover:text-primary/80">
            Voir tout
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((relatedProduct) => (
          <Card
            key={relatedProduct.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/product/${relatedProduct.slug}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                {relatedProduct.image && (
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-2">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(relatedProduct.price, currency)}
                  </p>
                  {relatedProduct.compare_at_price != null &&
                    relatedProduct.compare_at_price > relatedProduct.price && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(relatedProduct.compare_at_price, currency)}
                      </p>
                    )}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
