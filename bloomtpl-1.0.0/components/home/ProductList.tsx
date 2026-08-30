import { getProducts } from "@/lib/api";
import ProductCard from "./ProductCard";

export default async function ProductList() {
  const products = await getProducts();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
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
          <p className="text-muted-foreground mb-4">
            Essayez d&apos;ajuster vos filtres ou vos termes de recherche
          </p>
        </div>
      )}
    </div>
  );
}
