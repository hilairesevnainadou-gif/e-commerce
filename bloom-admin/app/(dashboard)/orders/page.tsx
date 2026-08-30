"use client";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { getAdminOrders } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_LABELS, type Order } from "@/types/order";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  processing: "secondary",
  shipped: "default",
  completed: "default",
  cancelled: "destructive",
};

export default function OrdersPage() {
  const { token } = useAuth();
  const { currency } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminOrders(token)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Commandes</h1>

      {loading ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Chargement...
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Aucune commande pour l&apos;instant.
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block border border-border rounded-lg bg-background p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{order.reference}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.customer_name}
                    </p>
                  </div>
                  <Badge variant={statusVariant[order.status] || "secondary"}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(order.total, currency)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Tablet and up: table */}
          <div className="hidden sm:block border border-border rounded-lg bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Commande</th>
                  <th className="text-left font-medium px-4 py-3">Client</th>
                  <th className="text-left font-medium px-4 py-3">Statut</th>
                  <th className="text-left font-medium px-4 py-3">Total</th>
                  <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {order.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-muted-foreground text-xs">
                        {order.customer_email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[order.status] || "secondary"}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {formatPrice(order.total, currency)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
