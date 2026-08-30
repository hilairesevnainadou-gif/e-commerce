"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { getAdminOrder, updateOrderStatus } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, type Order } from "@/types/order";
import {
  FileText,
  Mail,
  MapPin,
  Receipt,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  processing: "secondary",
  shipped: "default",
  completed: "default",
  cancelled: "destructive",
};

export default function OrderDetailPage() {
  const { token } = useAuth();
  const { currency } = useSettings();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    getAdminOrder(token, Number(id))
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleStatusChange = async (status: string) => {
    if (!token || !order) return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(token, order.id, status);
      setOrder(updated);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusSelect = (status: string) => {
    if (status === "cancelled" && order?.status !== "cancelled") {
      setConfirmCancelOpen(true);
      return;
    }
    handleStatusChange(status);
  };

  const confirmCancelOrder = async () => {
    await handleStatusChange("cancelled");
    setConfirmCancelOpen(false);
  };

  if (loading) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  if (!order) {
    return <p className="text-muted-foreground">Commande introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Commande {order.reference}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Passée le{" "}
            {new Date(order.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] || "secondary"}>
          {ORDER_STATUS_LABELS[order.status] || order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-3 first:pt-0 last:pb-0 text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {item.product_name}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Qté {item.quantity} ×{" "}
                        {formatPrice(item.unit_price, currency)}
                      </p>
                    </div>
                    <span className="font-medium text-foreground shrink-0">
                      {formatPrice(item.unit_price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatPrice(order.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Livraison</span>
                  <span>
                    {order.shipping > 0
                      ? formatPrice(order.shipping, currency)
                      : "Gratuite"}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxe</span>
                  <span>{formatPrice(order.tax, currency)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-foreground text-base">
                  <span>Total</span>
                  <span>{formatPrice(order.total, currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p className="text-sm font-medium text-foreground">
                    {order.customer_name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm font-medium text-foreground">
                    {order.customer_email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Adresse de livraison
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {order.shipping_address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={order.status}
                onValueChange={handleStatusSelect}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {ORDER_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {order.paid_at ? (
                <p className="text-xs text-muted-foreground">
                  Payée le{" "}
                  {new Date(order.paid_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  En attente du virement bancaire.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href={order.invoice_url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  Voir la facture
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                disabled={!order.receipt_url}
                asChild={!!order.receipt_url}
              >
                {order.receipt_url ? (
                  <Link href={order.receipt_url} target="_blank" rel="noopener noreferrer">
                    <Receipt className="h-4 w-4" />
                    Voir le reçu
                  </Link>
                ) : (
                  <span>
                    <Receipt className="h-4 w-4" />
                    Voir le reçu
                  </span>
                )}
              </Button>
              <p className="text-xs text-muted-foreground pt-1">
                La facture a été envoyée automatiquement par e-mail au client
                à la commande. Le reçu devient disponible une fois le
                paiement confirmé.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la commande</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir annuler la commande {order.reference} ?
            Le paiement associé sera marqué comme non réglé.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmCancelOpen(false)}
            >
              Retour
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmCancelOrder}
              disabled={updating}
            >
              {updating ? "Annulation..." : "Annuler la commande"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
