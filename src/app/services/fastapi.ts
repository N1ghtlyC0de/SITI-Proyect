import { apiRequest } from "./apiClient";

export interface ApiProduct {
    id: string;
    name: string;
    category: string;
    stock: number;
    status: string;
    image?: string;
    price: number;
    emoji?: string;
    lowStockThreshold?: number;
}

export interface ApiSaleItem {
    id: string;
    sale_id: string;
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    emoji?: string;
}

export interface ApiSale {
    id: string;
    total: number;
    time: string;
    itemCount: number;
    paymentMethod: string;
    status: string;
    vendorName?: string;
    amountReceived?: number;
    change?: number;
    transferApp?: string;
    products: ApiSaleItem[];
}

export interface ApiCashboxValidation {
    id: string;
    time: string;
    vendorName?: string;
    total_expected: number;
    total_physical: number;
    difference: number;
    status: string;
}

// Inventario
export const getProducts = () => apiRequest<ApiProduct[]>("/api/v1/inventario/products");
export const createProduct = (product: Omit<ApiProduct, "id">) => apiRequest<ApiProduct>("/api/v1/inventario/products", { method: "POST", body: JSON.stringify(product) });
export const updateProduct = (id: string, product: Partial<ApiProduct>) => apiRequest<ApiProduct>(`/api/v1/inventario/products/${id}`, { method: "PUT", body: JSON.stringify(product) });
export const deleteProduct = (id: string) => apiRequest<{ok: boolean}>(`/api/v1/inventario/products/${id}`, { method: "DELETE" });

// Ventas
export const getSales = () => apiRequest<ApiSale[]>("/api/v1/dashboard-ventas/sales");
export const createSale = (sale: Omit<ApiSale, "id" | "time" | "products"> & { products: Omit<ApiSaleItem, "id" | "sale_id">[] }) => apiRequest<ApiSale>("/api/v1/dashboard-ventas/sales", { method: "POST", body: JSON.stringify(sale) });

// Cierre Caja
export const getValidations = () => apiRequest<ApiCashboxValidation[]>("/api/v1/cierre-caja/validations");
export const createValidation = (validation: Omit<ApiCashboxValidation, "id" | "time">) => apiRequest<ApiCashboxValidation>("/api/v1/cierre-caja/validate", { method: "POST", body: JSON.stringify(validation) });
