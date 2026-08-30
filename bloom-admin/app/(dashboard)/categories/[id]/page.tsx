"use client";

import CategoryForm from "@/components/categories/CategoryForm";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((categories) => {
        setCategory(categories.find((c) => c.id === Number(id)) || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  if (!category) {
    return <p className="text-muted-foreground">Catégorie introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Modifier la catégorie</h1>
      <CategoryForm category={category} />
    </div>
  );
}
