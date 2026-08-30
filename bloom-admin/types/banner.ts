export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  position: string;
  is_active: boolean;
  sort_order: number;
}

export const BANNER_POSITIONS = [
  { value: "home_hero", label: "Accueil — bannière principale (grande, en haut)" },
  { value: "home_secondary", label: "Accueil — bannières secondaires (vignettes promo)" },
  { value: "shop_new", label: "Page Nouveautés — bannière" },
  { value: "shop_sale", label: "Page Promotions — bannière" },
  { value: "shop_all", label: "Page Boutique — bannière (tous les produits)" },
] as const;
