import ProductDetail from "@/components/product/ProductDetail";
import ProductNotFound from "@/components/product/ProductNotFound";
import { getProduct, getProductReviews, getProducts } from "@/lib/api";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Produit introuvable" };
  }

  return {
    title: product.name,
    description: product.description || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return <ProductNotFound />;
  }

  const categorySlug = product.category?.slug;
  const [candidates, reviews] = await Promise.all([
    getProducts(categorySlug ? { category: categorySlug } : undefined),
    getProductReviews(slug),
  ]);
  const relatedProducts = candidates
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}
