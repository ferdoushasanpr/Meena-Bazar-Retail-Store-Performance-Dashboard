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