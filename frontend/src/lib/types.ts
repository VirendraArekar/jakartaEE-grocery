export type ProductUnit = 'KG' | 'GRAM' | 'PIECE' | 'LITER' | 'PACKET' | 'BUNCH' | 'DOZEN';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Category {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  unit: ProductUnit;
  imageUrl?: string;
  organic: boolean;
  categoryId: number;
  categoryName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ScopeInfo {
  scope: string;
  instanceId?: string;
  requestId?: string;
  sessionId?: string;
  initializedAt?: string;
  createdAt?: string;
  sessionStarted?: string;
  totalVisitsAcrossAllUsers?: number;
  requestsInThisSession?: number;
  description: string;
}

export interface LiveScopesResponse {
  applicationScopedBean: ScopeInfo;
  requestScopedBean: ScopeInfo;
  sessionScopedBean: ScopeInfo;
}

