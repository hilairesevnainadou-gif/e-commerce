export interface Review {
  id: number;
  author_name: string;
  country: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export interface PaginatedReviews {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  distribution?: Record<string, number>;
}
