"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { deleteProduct, getAdminProducts, getCategories } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import type { Category, Product } from "@/types/product";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const PER_PAGE = 20;

export default function ProductsPage() {
  const { token } = useAuth();
  const { currency } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [view, setView] = useState<"table" | "grid">("table");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_products_view");
    if (saved === "grid" || saved === "table") setView(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_products_view", view);
  }, [view]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Debounce search input before triggering the API call.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAdminProducts(token, {
      page,
      perPage: PER_PAGE,
      search: search || undefined,
      category: category !== "all" ? category : undefined,
    })
      .then((result) => {
        setProducts(result.data);
        setMeta(result.meta ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, page, search, category]);

  const handleDelete = async () => {
    if (!token || !productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(token, productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setMeta((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      setProductToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = search !== "" || category !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Produits</h1>
        <Button asChild>
          <Link href="/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {/* Toolbar: search, category filter, view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un produit..."
            className="pl-9"
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setCategory("all");
              setPage(1);
            }}
            className="text-muted-foreground"
          >
            Réinitialiser
          </Button>
        )}

        <div className="hidden sm:flex items-center border border-border rounded-lg ml-auto shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("table")}
            aria-label="Vue tableau"
            className={`h-9 w-9 rounded-r-none ${view === "table" ? "bg-muted" : ""}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("grid")}
            aria-label="Vue grille"
            className={`h-9 w-9 rounded-l-none ${view === "grid" ? "bg-muted" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Chargement...
        </div>
      ) : products.length === 0 ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          {hasFilters
            ? "Aucun produit ne correspond à votre recherche."
            : "Aucun produit pour l'instant."}
        </div>
      ) : (
        <>
          {/* Mobile: always stacked cards, regardless of the table/grid toggle */}
          <div className="sm:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg bg-background p-4 flex gap-3"
              >
                <Link href={`/products/${product.id}`} className="shrink-0">
                  <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-foreground hover:text-primary truncate"
                    >
                      {product.name}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProductToDelete(product)}
                      className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8 -mt-1 -mr-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.category?.name || "—"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="font-semibold">
                      {formatPrice(product.price, currency)}
                    </span>
                    {product.compare_at_price != null &&
                      product.compare_at_price > product.price && (
                        <span className="text-muted-foreground line-through">
                          {formatPrice(product.compare_at_price, currency)}
                        </span>
                      )}
                    <span className="text-muted-foreground">
                      Stock : {product.stock}
                    </span>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Actif" : "Masqué"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table view */}
          {view === "table" && (
            <div className="hidden sm:block border border-border rounded-lg bg-background overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">Produit</th>
                    <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                      Catégorie
                    </th>
                    <th className="text-left font-medium px-4 py-3">Prix</th>
                    <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                      Stock
                    </th>
                    <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                      Avis
                    </th>
                    <th className="text-left font-medium px-4 py-3">Statut</th>
                    <th className="text-right font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted">
                            {product.image && (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium text-foreground hover:text-primary">
                            {product.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {product.category?.name || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span>{formatPrice(product.price, currency)}</span>
                        {product.compare_at_price != null &&
                          product.compare_at_price > product.price && (
                            <span className="ml-2 text-muted-foreground line-through text-xs">
                              {formatPrice(product.compare_at_price, currency)}
                            </span>
                          )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">{product.stock}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {product.reviews_count > 0
                          ? `${product.reviews_count} (${product.reviews_avg_rating?.toFixed(1)}★)`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Actif" : "Masqué"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setProductToDelete(product)}
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
          )}

          {/* Desktop: grid view */}
          {view === "grid" && (
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-border rounded-lg bg-background overflow-hidden group"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square bg-muted">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                          className="object-cover"
                        />
                      )}
                      <Badge
                        variant={product.is_active ? "default" : "secondary"}
                        className="absolute top-2 left-2"
                      >
                        {product.is_active ? "Actif" : "Masqué"}
                      </Badge>
                    </div>
                  </Link>
                  <div className="p-3 space-y-1.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-foreground hover:text-primary line-clamp-1 block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.category?.name || "—"}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-sm">
                          {formatPrice(product.price, currency)}
                        </span>
                        {product.compare_at_price != null &&
                          product.compare_at_price > product.price && (
                            <span className="text-muted-foreground line-through text-xs">
                              {formatPrice(product.compare_at_price, currency)}
                            </span>
                          )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setProductToDelete(product)}
                        className="text-muted-foreground hover:text-destructive h-7 w-7"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Stock : {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Page {meta.current_page} sur {meta.last_page} · {meta.total} produit
                {meta.total > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={meta.current_page >= meta.last_page}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer « {productToDelete?.name} » ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
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
