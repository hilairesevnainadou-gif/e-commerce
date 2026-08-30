export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: number;
  reference: string;
  status: string;
  paid_at: string | null;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items?: OrderItem[];
  invoice_url: string;
  receipt_url: string | null;
  created_at: string;
}

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédiée",
  completed: "Terminée",
  cancelled: "Annulée",
};
