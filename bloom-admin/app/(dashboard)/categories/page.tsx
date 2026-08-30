"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { deleteCategory, getCategories } from "@/lib/api";
import type { Category } from "@/types/product";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, []);

  const handleDelete = async () => {
    if (!token || !categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(token, categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Catégories</h1>
        <Button asChild>
          <Link href="/categories/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Chargement...
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Aucune catégorie pour l&apos;instant.
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-border rounded-lg bg-background p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/categories/${category.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategoryToDelete(category)}
                    className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8 -mt-1 -mr-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Tablet and up: table */}
          <div className="hidden sm:block border border-border rounded-lg bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Nom</th>
                  <th className="text-left font-medium px-4 py-3">Slug</th>
                  <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                    Description
                  </th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/categories/${category.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-xs hidden lg:table-cell">
                      {category.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoryToDelete(category)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Dialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer « {categoryToDelete?.name} » ?
            Les produits de cette catégorie ne seront pas supprimés.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
