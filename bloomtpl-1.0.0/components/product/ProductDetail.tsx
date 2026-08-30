"use client";

import Features from "@/components/product/Features";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { PaginatedReviews } from "@/types/review";
import {
  Check,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductDetail({
  product,
  relatedProducts,
  reviews,
}: {
  product: Product;
  relatedProducts: Product[];
  reviews: PaginatedReviews;
}) {
  const { addToCart } = useCart();
  const { currency } = useSettings();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const hasSizes = !!product.sizes?.length;
  const hasColors = !!product.colors?.length;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [variantError, setVariantError] = useState<string | null>(null);

  const isOnSale =
    product.compare_at_price != null && product.compare_at_price > product.price;

  const handleAddToCart = async () => {
    if (hasSizes && !selectedSize) {
      setVariantError("Veuillez sélectionner une taille.");
      return false;
    }
    if (hasColors && !selectedColor) {
      setVariantError("Veuillez sélectionner une couleur.");
      return false;
    }
    setVariantError(null);
    setIsAdding(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        availableSizes: product.sizes,
        availableColors: product.colors,
      });
    }

    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 2000);
    return true;
  };

  const handleBuyNow = async () => {
    const added = await handleAddToCart();
    if (added) {
      setTimeout(() => router.push("/cart"), 500);
    }
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductBreadcrumb />

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <ProductGallery
            images={product.images ?? []}
            fallbackImage={product.image}
            alt={product.name}
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    product.reviews_avg_rating != null &&
                      i < Math.round(product.reviews_avg_rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            {product.reviews_count > 0 ? (
              <a
                href="#avis"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ({product.reviews_avg_rating?.toFixed(1)}) • {product.reviews_count}{" "}
                avis
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">
                Aucun avis pour le moment
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price, currency)}
            </span>
            {isOnSale && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_at_price as number, currency)}
              </span>
            )}
            {isOnSale && (
              <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
                Promo
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator />

          <div className="space-y-4">
            {hasColors && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Couleur{selectedColor ? ` : ${selectedColor}` : ""}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors!.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setVariantError(null);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        selectedColor === color
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasSizes && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Taille{selectedSize ? ` : ${selectedSize}` : ""}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setVariantError(null);
                      }}
                      className={cn(
                        "h-10 min-w-[2.5rem] px-3 rounded-lg border text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {variantError && (
              <p className="text-sm text-destructive">{variantError}</p>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Quantité
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increment")}
                    className="h-10 w-10 rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className={cn(
                  "w-full h-12 sm:flex-1 text-base transition-all duration-300",
                  justAdded
                    ? "bg-green-600 text-white hover:bg-green-600"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Ajout...
                  </div>
                ) : justAdded ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Ajouté au panier !
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Ajouter au panier
                  </div>
                )}
              </Button>

              <Button
                size="lg"
                onClick={handleBuyNow}
                className="w-full h-12 sm:flex-1 text-base bg-foreground text-background hover:bg-foreground/90"
              >
                Acheter maintenant
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isLiked && "text-destructive"
                )}
              >
                <Heart
                  className={cn("h-4 w-4 mr-2", isLiked && "fill-current")}
                />
                Ajouter aux favoris
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Features />

      <ProductReviews
        slug={product.slug}
        initialReviews={reviews}
        averageRating={product.reviews_avg_rating}
        reviewsCount={product.reviews_count}
      />

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
