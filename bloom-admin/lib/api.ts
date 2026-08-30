import type { Banner } from "@/types/banner";
import type { Order } from "@/types/order";
import type { Category, Product } from "@/types/product";
import type { Settings } from "@/types/settings";
import type { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Paginated<T> {
  data: T[];
  meta?: { current_page: number; last_page: number; total: number };
}

interface Single<T> {
  data: T;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function apiFetch<T>(
  path: string,
  token?: string | null,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(
      body?.message || `API error ${res.status}`,
      res.status,
      body?.errors
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// Auth
export async function login(email: string, password: string) {
  return apiFetch<{ user: User; token: string }>("/login", null, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function me(token: string) {
  return apiFetch<User>("/me", token);
}

export async function logout(token: string) {
  return apiFetch<void>("/logout", token, { method: "POST" });
}

// Categories (public list is enough for dropdowns; admin endpoints for writes)
export async function getCategories(): Promise<Category[]> {
  const result = await apiFetch<Paginated<Category>>("/categories");
  return result.data;
}

export async function createCategory(
  token: string,
  data: Partial<Category>
): Promise<Category> {
  const result = await apiFetch<Single<Category>>("/admin/categories", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateCategory(
  token: string,
  id: number,
  data: Partial<Category>
): Promise<Category> {
  const result = await apiFetch<Single<Category>>(`/admin/categories/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteCategory(token: string, id: number): Promise<void> {
  await apiFetch<void>(`/admin/categories/${id}`, token, { method: "DELETE" });
}

// Products (admin)
export async function getAdminProducts(
  token: string,
  params?: { page?: number; perPage?: number; search?: string; category?: string }
): Promise<Paginated<Product>> {
  const query = new URLSearchParams();
  query.set("per_page", String(params?.perPage ?? 20));
  if (params?.page) query.set("page", String(params.page));
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);

  return apiFetch<Paginated<Product>>(`/admin/products?${query.toString()}`, token);
}

export async function getAdminProduct(token: string, id: number): Promise<Product> {
  const result = await apiFetch<Single<Product>>(`/admin/products/${id}`, token);
  return result.data;
}

export async function createProduct(token: string, formData: FormData): Promise<Product> {
  const result = await apiFetch<Single<Product>>("/admin/products", token, {
    method: "POST",
    body: formData,
  });
  return result.data;
}

export async function updateProduct(
  token: string,
  id: number,
  formData: FormData
): Promise<Product> {
  formData.append("_method", "PUT");
  const result = await apiFetch<Single<Product>>(`/admin/products/${id}`, token, {
    method: "POST",
    body: formData,
  });
  return result.data;
}

export async function deleteProduct(token: string, id: number): Promise<void> {
  await apiFetch<void>(`/admin/products/${id}`, token, { method: "DELETE" });
}

export async function deleteProductImage(
  token: string,
  productId: number,
  imageId: number
): Promise<Product> {
  const result = await apiFetch<Single<Product>>(
    `/admin/products/${productId}/images/${imageId}`,
    token,
    { method: "DELETE" }
  );
  return result.data;
}

export async function setMainProductImage(
  token: string,
  productId: number,
  imageId: number
): Promise<Product> {
  const result = await apiFetch<Single<Product>>(
    `/admin/products/${productId}/images/${imageId}/main`,
    token,
    { method: "PATCH" }
  );
  return result.data;
}

// Orders (admin)
export async function getAdminOrders(
  token: string,
  params?: { page?: number; perPage?: number }
): Promise<Paginated<Order>> {
  const query = new URLSearchParams();
  query.set("per_page", String(params?.perPage ?? 20));
  if (params?.page) query.set("page", String(params.page));

  return apiFetch<Paginated<Order>>(`/admin/orders?${query.toString()}`, token);
}

export async function getAdminOrder(token: string, id: number): Promise<Order> {
  const result = await apiFetch<Single<Order>>(`/admin/orders/${id}`, token);
  return result.data;
}

export async function updateOrderStatus(
  token: string,
  id: number,
  status: string
): Promise<Order> {
  const result = await apiFetch<Single<Order>>(`/admin/orders/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return result.data;
}

// Banners (admin)
export async function getAdminBanners(token: string): Promise<Banner[]> {
  const result = await apiFetch<Paginated<Banner>>("/admin/banners", token);
  return result.data;
}

export async function getAdminBanner(token: string, id: number): Promise<Banner> {
  const result = await apiFetch<Single<Banner>>(`/admin/banners/${id}`, token);
  return result.data;
}

export async function createBanner(token: string, formData: FormData): Promise<Banner> {
  const result = await apiFetch<Single<Banner>>("/admin/banners", token, {
    method: "POST",
    body: formData,
  });
  return result.data;
}

export async function updateBanner(
  token: string,
  id: number,
  formData: FormData
): Promise<Banner> {
  formData.append("_method", "PUT");
  const result = await apiFetch<Single<Banner>>(`/admin/banners/${id}`, token, {
    method: "POST",
    body: formData,
  });
  return result.data;
}

export async function deleteBanner(token: string, id: number): Promise<void> {
  await apiFetch<void>(`/admin/banners/${id}`, token, { method: "DELETE" });
}

// Settings (public)
export async function getSettings(): Promise<Settings> {
  const result = await apiFetch<Single<Settings>>("/settings");
  return result.data;
}

// Settings (admin)
export async function getAdminSettings(token: string): Promise<Settings> {
  const result = await apiFetch<Single<Settings>>("/admin/settings", token);
  return result.data;
}

export async function updateSettings(
  token: string,
  formData: FormData
): Promise<Settings> {
  const result = await apiFetch<Single<Settings>>("/admin/settings", token, {
    method: "POST",
    body: formData,
  });
  return result.data;
}
