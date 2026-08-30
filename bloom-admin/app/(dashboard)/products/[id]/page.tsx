"use client";

import ProductForm from "@/components/products/ProductForm";
import { useAuth } from "@/context/AuthContext";
import { getAdminProduct } from "@/lib/api";
import type { Product } from "@/types/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminProduct(token, Number(id))
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  if (!product) {
    return <p className="text-muted-foreground">Produit introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Modifier le produit</h1>
      <ProductForm product={product} />
    </div>
  );
}
