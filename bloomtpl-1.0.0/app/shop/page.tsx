import CountdownTimer from "@/components/home/CountdownTimer";
import ProductCard from "@/components/home/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { getBanners, getCategories, getProducts, getSettings } from "@/lib/api";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    new?: string;
    on_sale?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const { category, new: isNew, on_sale, search } = await searchParams;

  if (search) return { title: `Recherche : ${search}` };
  if (isNew === "1") return { title: "Nouveautés" };
  if (on_sale === "1") return { title: "Promotions" };

  if (!category) {
    return { title: "Boutique" };
  }

  const categories = await getCategories();
  const match = categories.find((c) => c.slug === category);

  return { title: match?.name || "Boutique" };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, new: isNew, on_sale, search, min_price, max_price } =
    await searchParams;
  const showNewOnly = isNew === "1";
  const showOnSaleOnly = on_sale === "1";
  const minPrice = min_price ? Number(min_price) : undefined;
  const maxPrice = max_price ? Number(max_price) : undefined;

  const bannerPosition = showNewOnly
    ? "shop_new"
    : showOnSaleOnly
      ? "shop_sale"
      : !search
        ? "shop_all"
        : null;

  const [products, categories, banners, settings] = await Promise.all([
    getProducts({
      ...(search ? { search } : {}),
      ...(showNewOnly ? { isNew: true } : {}),
      ...(showOnSaleOnly ? { onSale: true } : {}),
      ...(category ? { category } : {}),
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
    }),
    getCategories(),
    bannerPosition ? getBanners(bannerPosition) : Promise.resolve([]),
    getSettings(),
  ]);
  const banner = banners[0] || null;

  const heading = search
    ? `Résultats pour « ${search} »`
    : showNewOnly
      ? "Nouveautés"
      : showOnSaleOnly
        ? "Promotions"
        : category
          ? categories.find((c) => c.slug === category)?.name
          : null;

  const emptyMessage = search
    ? "Aucun produit ne correspond à votre recherche."
    : showNewOnly
      ? "Aucun produit n'est encore marqué comme nouveauté."
      : showOnSaleOnly
        ? "Aucun produit n'est actuellement en promotion."
        : category
          ? "Aucun produit n'est encore associé à cette catégorie."
          : "Essayez d'ajuster vos filtres ou vos termes de recherche";

  return (
    <div className="bg-background px-4 py-8 sm:py-12 lg:py-16 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {banner ? (
          <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[360px] rounded-2xl overflow-hidden mb-10">
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-10">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-white/90 text-sm sm:text-base max-w-md">
                  {banner.subtitle}
                </p>
              )}
              {banner.link_url && (
                <Link
                  href={banner.link_url}
                  className="mt-4 inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Découvrir
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center mx-auto mb-10 space-y-3">
            <h1 className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
              {heading || "Tous les produits"}
            </h1>
          </div>
        )}

        {showOnSaleOnly && settings.sale_ends_at && (
          <div className="mb-10 rounded-2xl border border-border bg-muted/30">
            <p className="text-center text-sm font-medium text-muted-foreground pt-6">
              Les promotions se terminent dans
            </p>
            <CountdownTimer />
          </div>
        )}

        <div className="grid lg:grid-cols-[240px_1fr] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ShopFilters categories={categories} />
          </aside>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-muted-foreground mb-4">{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
