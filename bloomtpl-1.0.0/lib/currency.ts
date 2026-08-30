export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
}
