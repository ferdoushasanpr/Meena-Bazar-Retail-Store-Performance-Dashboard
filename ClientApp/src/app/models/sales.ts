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