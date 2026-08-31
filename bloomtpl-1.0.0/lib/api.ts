import type { Banner } from "@/types/banner";
import type { CreateOrderPayload, Order } from "@/types/order";
import type { Category, Product } from "@/types/product";
import type { PaginatedReviews } from "@/types/review";
import type { Settings } from "@/types/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Paginated<T> {
  data: T[];
}

interface Single<T> {
  data: T;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `API error ${res.status} on ${path}`);
  }

  return res.json();
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  onSale?: boolean;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.isNew) query.set("is_new", "1");
  if (params?.onSale) query.set("on_sale", "1");
  if (params?.minPrice !== undefined) query.set("min_price", String(params.minPrice));
  if (params?.maxPrice !== undefined) query.set("max_price", String(params.maxPrice));
  query.set("per_page", "100");

  const result = await apiFetch<Paginated<Product>>(`/products?${query.toString()}`, {
    cache: "no-store",
  });

  return result.data;
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const result = await apiFetch<Single<Product>>(`/products/${slug}`, {
      cache: "no-store",
    });
    return result.data;
  } catch {
    return null;
  }
}

export async function getProductReviews(
  slug: string,
  page = 1,
  perPage = 6
): Promise<PaginatedReviews> {
  try {
    return await apiFetch<PaginatedReviews>(
      `/products/${slug}/reviews?per_page=${perPage}&page=${page}`,
      { cache: "no-store" }
    );
  } catch {
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  }
}

export async function getCategories(): Promise<Category[]> {
  const result = await apiFetch<Paginated<Category>>("/categories", {
    cache: "no-store",
  });
  return result.data;
}

export async function getSettings(): Promise<Settings> {
  const result = await apiFetch<Single<Settings>>("/settings", {
    cache: "no-store",
  });
  return result.data;
}

export async function getBanners(position?: string): Promise<Banner[]> {
  const query = position ? `?position=${encodeURIComponent(position)}` : "";
  const result = await apiFetch<Paginated<Banner>>(`/banners${query}`, {
    cache: "no-store",
  });
  return result.data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const result = await apiFetch<Single<Order>>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return result.data;
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  await apiFetch<{ message: string }>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
}
