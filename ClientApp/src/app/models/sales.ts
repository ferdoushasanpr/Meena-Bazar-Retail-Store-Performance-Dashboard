export interface SalesData {
    totalSales: number;
    numberOfTransactions: number;
    averageBasketValue: number;
}

export interface SalesCategoryData {
    category: string,
    total_Transactions: number,
    total_Sales: number
}

export interface DailySalesData {
    salesDate: string,
    totalSales: number,
    numberOfTransactions: number,
    averageBasketValue: number
}

export interface MonthlySalesData {
    year: number,
    month: string,
    total_Sales: number,
    total_Revenue: number
}

export interface StoreSalesData {
    store_id: string,
    store_name: string,
    total_Transactions: number,
    total_Sales: number
}

export interface DailyStoreSalesData {
    salesDate: string,
    store_name: string,
    totalSales: number,
    numberOfTransactions: number,
    averageBasketValue: number
}

export interface BrandSalesData {
    brand: string,
    total_Transactions: number,
    total_Sales: number
}

export interface ProductSalesData {
    product_id: string;
    product_name: string;
    total_Transactions: number;
    total_Sales: number;
}

export interface ProductSalesResponse {
    data: ProductSalesData[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}

export interface StoreCategorySalesData {
    store_id: string,
    store_name: string,
    category: string,
    totalSales: number,
    unitsSold: number,
    numberOfTransactions: number
}

export interface StoreCategorySalesResponse {
    data: StoreCategorySalesData[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}

export interface PaginatedResponse<T = any> {
    data: T[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}