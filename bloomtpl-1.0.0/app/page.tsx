import CountdownTimer from "@/components/home/CountdownTimer";
import HeroBanner from "@/components/home/HeroBanner";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import ProductCard from "@/components/home/ProductCard";
import SecondaryBanners from "@/components/home/SecondaryBanners";
import ShopFilters from "@/components/shop/ShopFilters";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/api";
import Link from "next/link";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    new?: string;
    on_sale?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, new: isNew, on_sale, search, min_price, max_price } =
    await searchParams;
  const showNewOnly = isNew === "1";
  const showOnSaleOnly = on_sale === "1";
  const minPrice = min_price ? Number(min_price) : undefined;
  const maxPrice = max_price ? Number(max_price) : undefined;

  const [products, categories] = await Promise.all([
    getProducts({
      ...(search ? { search } : {}),
      ...(showNewOnly ? { isNew: true } : {}),
      ...(showOnSaleOnly ? { onSale: true } : {}),
      ...(category ? { category } : {}),
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
    }),
    getCategories(),
  ]);

  const heading = search
    ? `Résultats pour « ${search} »`
    : showNewOnly
      ? "Nouveautés"
      : showOnSaleOnly
        ? "Promotions"
        : category
          ? categories.find((c) => c.slug === category)?.name
          : "Nos produits";

  const hasActiveFilter =
    !!search || showNewOnly || showOnSaleOnly || !!category || minPrice !== undefined || maxPrice !== undefined;
  const displayedProducts = hasActiveFilter ? products : products.slice(0, 12);

  return (
    <div className="bg-background px-4 py-8 sm:py-12 lg:py-16 lg:px-8 min-h-screen">
      <HeroBanner />
      <CountdownTimer />
      <SecondaryBanners />

      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          {heading}
        </h2>

        <div className="grid lg:grid-cols-[240px_1fr] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ShopFilters categories={categories} />
          </aside>

          <div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez d&apos;ajuster vos filtres ou vos termes de recherche
                  </p>
                </div>
              )}
            </div>

            {!hasActiveFilter && products.length > displayedProducts.length && (
              <div className="text-center mt-10">
                <Button asChild size="lg">
                  <Link href="/shop">Voir toute la boutique</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </div>
  );
}
