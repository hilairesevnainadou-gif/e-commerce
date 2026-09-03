"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";
import { Search, Sparkles, Tag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const BUDGETS: { label: string; min?: number; max?: number }[] = [
  { label: "Tous les prix" },
  { label: "Moins de 100 €", max: 100 },
  { label: "100 € – 500 €", min: 100, max: 500 },
  { label: "500 € – 1500 €", min: 500, max: 1500 },
  { label: "Plus de 1500 €", min: 1500 },
];

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeMin = searchParams.get("min_price");
  const activeMax = searchParams.get("max_price");
  const activeNew = searchParams.get("new") === "1";
  const activeSale = searchParams.get("on_sale") === "1";
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const hasActiveFilters =
    !!activeCategory || !!activeMin || !!activeMax || activeNew || activeSale || !!searchParams.get("search");

  function navigate(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: searchValue.trim() || null, category: null, new: null, on_sale: null });
  }

  function selectCategory(slug: string | null) {
    navigate({ category: slug, new: null, on_sale: null, search: null });
  }

  function selectBudget(budget: { min?: number; max?: number }) {
    navigate({
      min_price: budget.min !== undefined ? String(budget.min) : null,
      max_price: budget.max !== undefined ? String(budget.max) : null,
    });
  }

  function toggleQuickFilter(key: "new" | "on_sale") {
    const isActive = key === "new" ? activeNew : activeSale;
    navigate({
      new: null,
      on_sale: null,
      category: null,
      search: null,
      [key]: isActive ? null : "1",
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearchSubmit}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Rechercher
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Nom d'un produit..."
            className="pl-9"
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={activeNew ? "default" : "outline"}
          onClick={() => toggleQuickFilter("new")}
          className="gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Nouveautés
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activeSale ? "default" : "outline"}
          onClick={() => toggleQuickFilter("on_sale")}
          className="gap-1.5"
        >
          <Tag className="h-3.5 w-3.5" />
          Promotions
        </Button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Catégories
        </p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={cn(
              "block w-full text-left text-sm rounded-md px-3 py-2 transition-colors",
              !activeCategory && !activeNew && !activeSale
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Toutes les catégories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCategory(c.slug)}
              className={cn(
                "block w-full text-left text-sm rounded-md px-3 py-2 transition-colors",
                activeCategory === c.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Budget
        </p>
        <div className="space-y-1">
          {BUDGETS.map((budget) => {
            const isActive =
              (budget.min !== undefined ? String(budget.min) : null) === (activeMin || null) &&
              (budget.max !== undefined ? String(budget.max) : null) === (activeMax || null);

            return (
              <button
                key={budget.label}
                type="button"
                onClick={() => selectBudget(budget)}
                className={cn(
                  "block w-full text-left text-sm rounded-md px-3 py-2 transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {budget.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => router.push(pathname)}
        >
          <X className="h-3.5 w-3.5" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}
