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

// Fired whenever the API rejects a request as unauthenticated, so the
// admin session can be cleared and the user sent back to /login from a
// single place instead of every call site handling it individually.
export const UNAUTHORIZED_EVENT = "bloom-admin:unauthorized";

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

    // A 401 here means the token is missing/expired/revoked — the caller
    // didn't necessarily ask for auth, so make sure the session gets
    // cleared and the admin redirected even if this rejection goes
    // unhandled by the call site.
    if (res.status === 401 && typeof window !== "undefined" && path !== "/login") {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

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

// Dashboard (admin)
export interface DashboardStats {
  revenue: {
    total: number;
    this_month: number;
    average_order_value: number;
    last_14_days: { date: string; total: number }[];
  };
  orders: {
    total: number;
    pending: number;
    by_status: Record<string, number>;
  };
  products: {
    total: number;
    active: number;
    out_of_stock: number;
    low_stock: { id: number; name: string; slug: string; stock: number }[];
  };
  customers: { total: number };
  reviews: { total: number; average_rating: number };
  top_products: { product_id: number; product_name: string; units_sold: number }[];
}

export async function getAdminDashboard(token: string): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/admin/dashboard", token);
}

// Notifications (admin)
export interface AdminNotification {
  id: string;
  type: string;
  data: {
    order_id: number;
    reference: string;
    customer_name: string;
    total: number;
  };
  read_at: string | null;
  created_at: string;
}

export async function getAdminNotifications(
  token: string,
  params?: { page?: number; perPage?: number }
): Promise<Paginated<AdminNotification>> {
  const query = new URLSearchParams();
  query.set("per_page", String(params?.perPage ?? 10));
  if (params?.page) query.set("page", String(params.page));

  return apiFetch<Paginated<AdminNotification>>(
    `/admin/notifications?${query.toString()}`,
    token
  );
}

export async function getUnreadNotificationCount(token: string): Promise<number> {
  const result = await apiFetch<{ count: number }>(
    "/admin/notifications/unread-count",
    token
  );
  return result.count;
}

export async function markNotificationRead(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/admin/notifications/${id}/read`, token, { method: "POST" });
}

export async function markAllNotificationsRead(token: string): Promise<void> {
  await apiFetch<void>("/admin/notifications/read-all", token, { method: "POST" });
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
