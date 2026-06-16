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

export interface ApiVendor {
    id: string;
    name: string;
    emoji: string;
    role: string;
    avatarColor: {
        bg: string;
        text: string;
    };
}

export interface ApiShift {
    id: string;
    time: string;
    vendorName?: string;
    total_expected: number;
    total_physical: number;
    difference: number;
    status: string; // "match", "short", "over"
    openedAt?: string;
    closedAt?: string;
    note?: string;
    date?: string;
    empleado_id?: number;
    horas_trabajadas?: number;
    franjas?: number[];
}

export interface ApiDailyGoal {
    goal: number;
}

// 1. Autenticación (Auth)
export const login = (credentials: { id: string }) =>
    apiRequest<{ success: boolean; vendor?: ApiVendor }>("/auth/login", { method: "POST", body: JSON.stringify(credentials) });

export const logout = () =>
    apiRequest<{ success: boolean }>("/auth/logout", { method: "POST" });

// 2. Vendedores
export const getVendors = () =>
    apiRequest<ApiVendor[]>("/vendedores");

export const createVendor = (vendor: Omit<ApiVendor, "id">) =>
    apiRequest<ApiVendor>("/vendedores", { method: "POST", body: JSON.stringify(vendor) });

export const updateVendor = (id: string, vendor: Partial<Omit<ApiVendor, "id">>) =>
    apiRequest<ApiVendor>(`/vendedores/${id}`, { method: "PUT", body: JSON.stringify(vendor) });

export const deleteVendor = (id: string) =>
    apiRequest<{ ok: boolean }>(`/vendedores/${id}`, { method: "DELETE" });

// 3. Productos (Inventario)
export const getProducts = () =>
    apiRequest<ApiProduct[]>("/productos");

export const createProduct = (product: Omit<ApiProduct, "id">) =>
    apiRequest<ApiProduct>("/productos", { method: "POST", body: JSON.stringify(product) });

export const updateProduct = (id: string, product: Partial<ApiProduct>) =>
    apiRequest<ApiProduct>(`/productos/${id}`, { method: "PUT", body: JSON.stringify(product) });

export const deleteProduct = (id: string) =>
    apiRequest<{ ok: boolean }>(`/productos/${id}`, { method: "DELETE" });

// 4. Ventas
export const getSales = (filters?: { date?: string; vendedor?: string }) => {
    let url = "/ventas";
    if (filters) {
        const params = new URLSearchParams();
        if (filters.date) params.append("date", filters.date);
        if (filters.vendedor) params.append("vendedor", filters.vendedor);
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    return apiRequest<ApiSale[]>(url);
};

export const getSaleDetail = (id: string) =>
    apiRequest<ApiSale>(`/ventas/${id}`);

export const createSale = (sale: Omit<ApiSale, "id" | "time" | "products"> & { products: Omit<ApiSaleItem, "id" | "sale_id">[] }) =>
    apiRequest<ApiSale>("/ventas", { method: "POST", body: JSON.stringify(sale) });

export const cancelSale = (id: string) =>
    apiRequest<ApiSale>(`/ventas/${id}/cancelar`, { method: "PATCH" });

// 5. Turnos
export const getShifts = () =>
    apiRequest<ApiShift[]>("/turnos");

export const openShift = (shift: Omit<ApiShift, "id" | "time" | "total_expected" | "total_physical" | "difference"> & Partial<ApiShift>) =>
    apiRequest<ApiShift>("/turnos", { method: "POST", body: JSON.stringify(shift) });

export const closeShift = (id: string, shiftData: Partial<ApiShift>) =>
    apiRequest<ApiShift>(`/turnos/${id}/cerrar`, { method: "PATCH", body: JSON.stringify(shiftData) });

// 6. Configuración
export const getDailyGoal = () =>
    apiRequest<ApiDailyGoal>("/configuracion/meta-diaria");

export const updateDailyGoal = (goal: ApiDailyGoal) =>
    apiRequest<ApiDailyGoal>("/configuracion/meta-diaria", { method: "PUT", body: JSON.stringify(goal) });

// Backwards compatibility aliases (marked as deprecated)
/** @deprecated Use getShifts instead */
export const getValidations = getShifts;
/** @deprecated Use closeShift or openShift instead */
export const createValidation = (validation: Omit<ApiShift, "id" | "time">) =>
    closeShift("current", validation);
