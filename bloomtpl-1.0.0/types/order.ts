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
  country: string | null;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items?: OrderItem[];
  invoice_url: string;
  receipt_url: string | null;
  created_at: string;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  country: string;
  items: { product_id: number; quantity: number }[];
}
