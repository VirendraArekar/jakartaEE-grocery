import { ApiResponse, Category, LiveScopesResponse, OrderRequest, OrderResponse, Product } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.validationErrors) {
          const detail = Object.entries(errJson.validationErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          errorMessage = `${errJson.message}: ${detail}`;
        } else if (errJson.message) {
          errorMessage = errJson.message;
        }
      } catch (_) {}
      throw new Error(errorMessage);
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Categories
  getCategories: () => fetchJSON<Category[]>('/categories'),
  createCategory: (cat: Partial<Category>) =>
    fetchJSON<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(cat),
    }),

  // Products
  getProducts: (categoryId?: number, search?: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId.toString());
    if (search) params.append('search', search);
    const qs = params.toString();
    return fetchJSON<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },
  getProductById: (id: number) => fetchJSON<Product>(`/products/${id}`),
  createProduct: (prod: Partial<Product>) =>
    fetchJSON<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(prod),
    }),
  updateProduct: (id: number, prod: Partial<Product>) =>
    fetchJSON<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prod),
    }),
  deleteProduct: (id: number) =>
    fetchJSON<void>(`/products/${id}`, { method: 'DELETE' }),
  updateStock: (id: number, delta: number) =>
    fetchJSON<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    }),

  // Orders
  placeOrder: (req: OrderRequest) =>
    fetchJSON<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(req),
    }),
  getOrders: () => fetchJSON<OrderResponse[]>('/orders'),

  // Jakarta EE Guide endpoints
  getLiveScopes: () => fetchJSON<LiveScopesResponse>('/jakarta-guide/scopes/live'),
  getAnnotationsCatalog: () =>
    fetchJSON<Record<string, Array<{ name: string; package: string; description: string }>>>(
      '/jakarta-guide/annotations'
    ),
};

