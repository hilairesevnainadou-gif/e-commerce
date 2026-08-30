"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { getAdminOrders, getAdminProducts, getCategories } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_LABELS, type Order } from "@/types/order";
import { ListTree, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { token } = useAuth();
  const { currency } = useSettings();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!token) return;

    getAdminProducts(token, { perPage: 1 }).then((result) =>
      setProductCount(result.meta?.total ?? result.data.length)
    );
    getCategories().then((categories) => setCategoryCount(categories.length));
    getAdminOrders(token, { perPage: 5 }).then((result) => {
      setRecentOrders(result.data);
      setOrderCount(result.meta?.total ?? result.data.length);
    });
  }, [token]);

  const stats = [
    { label: "Produits", value: productCount, icon: Package, href: "/products" },
    { label: "Catégories", value: categoryCount, icon: ListTree, href: "/categories" },
    { label: "Commandes", value: orderCount, icon: ShoppingBag, href: "/orders" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {value ?? "…"}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune commande pour l&apos;instant.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-primary transition-colors"
                >
                  <span className="font-medium">
                    #{order.id} — {order.customer_name}
                  </span>
                  <span className="text-muted-foreground">
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(order.total, currency)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
