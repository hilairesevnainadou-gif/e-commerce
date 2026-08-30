"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { getAdminDashboard, type DashboardStats } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_LABELS } from "@/types/order";
import {
  AlertTriangle,
  ListTree,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  processing: "secondary",
  shipped: "default",
  completed: "default",
  cancelled: "destructive",
};

export default function DashboardPage() {
  const { token } = useAuth();
  const { currency } = useSettings();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminDashboard(token)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading || !stats) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(stats.revenue.total, currency),
      sub: `${formatPrice(stats.revenue.this_month, currency)} ce mois-ci`,
      icon: Wallet,
      href: "/orders",
    },
    {
      label: "Commandes",
      value: String(stats.orders.total),
      sub:
        stats.orders.pending > 0
          ? `${stats.orders.pending} en attente`
          : "Aucune en attente",
      sub_warn: stats.orders.pending > 0,
      icon: ShoppingBag,
      href: "/orders",
    },
    {
      label: "Produits",
      value: String(stats.products.total),
      sub:
        stats.products.out_of_stock > 0
          ? `${stats.products.out_of_stock} en rupture`
          : `${stats.products.active} actifs`,
      sub_warn: stats.products.out_of_stock > 0,
      icon: Package,
      href: "/products",
    },
    {
      label: "Clients",
      value: String(stats.customers.total),
      sub: "Comptes enregistrés",
      icon: Users,
      href: null,
    },
  ];

  const secondaryKpis = [
    {
      label: "Panier moyen",
      value: formatPrice(stats.revenue.average_order_value, currency),
      icon: TrendingUp,
    },
    {
      label: "Avis clients",
      value: `${stats.reviews.average_rating.toFixed(1)} ★`,
      sub: `${stats.reviews.total} avis`,
      icon: Star,
    },
  ];

  const maxRevenue = Math.max(...stats.revenue.last_14_days.map((d) => d.total), 1);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, sub_warn, icon: Icon, href }) => {
          const content = (
            <Card className={href ? "hover:shadow-md transition-shadow" : ""}>
              <CardContent className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                  <p
                    className={`text-xs mt-1 ${
                      sub_warn ? "text-amber-600 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {sub}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-primary shrink-0" />
              </CardContent>
            </Card>
          );
          return href ? (
            <Link key={label} href={href}>
              {content}
            </Link>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secondaryKpis.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground">
                  {value}
                  {sub && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {sub}
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d&apos;affaires — 14 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.revenue.last_14_days.every((d) => d.total === 0) ? (
            <p className="text-sm text-muted-foreground">
              Aucune vente enregistrée sur cette période.
            </p>
          ) : (
            <div className="flex items-end gap-1.5 sm:gap-2 h-40">
              {stats.revenue.last_14_days.map((day) => {
                const heightPct = Math.max((day.total / maxRevenue) * 100, day.total > 0 ? 4 : 1);
                const date = new Date(day.date + "T00:00:00");
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                    title={`${date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })} : ${formatPrice(day.total, currency)}`}
                  >
                    <div
                      className="w-full rounded-t bg-primary/70 group-hover:bg-primary transition-colors min-h-[2px]"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground mt-1.5 hidden sm:block">
                      {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes par statut</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.orders.by_status).length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune commande.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.orders.by_status).map(([status, count]) => (
                  <Link
                    key={status}
                    href="/orders"
                    className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                  >
                    <Badge variant={statusVariant[status] || "secondary"}>
                      {ORDER_STATUS_LABELS[status] || status}
                    </Badge>
                    <span className="font-semibold">{count}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low stock alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Stock faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.products.low_stock.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun produit en stock faible.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {stats.products.low_stock.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center justify-between py-2.5 text-sm hover:text-primary transition-colors"
                  >
                    <span className="truncate">{product.name}</span>
                    <Badge variant="secondary" className="text-amber-700 shrink-0 ml-2">
                      {product.stock} restant{product.stock > 1 ? "s" : ""}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.top_products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Pas encore de ventes.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {stats.top_products.map((product, i) => (
                  <Link
                    key={product.product_id}
                    href={`/products/${product.product_id}`}
                    className="flex items-center gap-3 py-2.5 text-sm hover:text-primary transition-colors"
                  >
                    <span className="text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <span className="truncate flex-1">{product.product_name}</span>
                    <span className="font-semibold shrink-0">
                      {product.units_sold} vendu{product.units_sold > 1 ? "s" : ""}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories quick link */}
        <Card>
          <CardHeader>
            <CardTitle>Catalogue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/categories"
              className="flex items-center justify-between text-sm hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <ListTree className="h-4 w-4" />
                Catégories
              </span>
              <span className="font-semibold">Gérer →</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-between text-sm hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                Produits actifs
              </span>
              <span className="font-semibold">
                {stats.products.active} / {stats.products.total}
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
