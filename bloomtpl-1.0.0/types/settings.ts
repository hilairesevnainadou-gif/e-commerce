export interface Settings {
  site_name: string;
  logo_url: string | null;
  tagline: string | null;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  whatsapp_number: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  tax_rate: number;
  free_shipping_threshold: number;
  international_shipping_fee: number;
  currency: string;
  sale_ends_at: string | null;
  announcement_text: string | null;
  bank_account_holder: string | null;
  bank_name: string | null;
  bank_iban: string | null;
  bank_bic: string | null;
}
