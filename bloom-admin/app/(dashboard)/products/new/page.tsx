import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
