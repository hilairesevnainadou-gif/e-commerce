export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: number | null;
}

export interface ProductImage {
  id: number;
  url: string;
  position: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  stock: number;
  is_active: boolean;
  is_new: boolean;
  reviews_count: number;
  reviews_avg_rating: number | null;
  category?: Category | null;
  images?: ProductImage[];
  image?: string;
}
