import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandSalesData, DailySalesData, DailyStoreSalesData, MonthlySalesData, ProductSalesData, ProductSalesResponse, SalesCategoryData, SalesData, StoreCategorySalesData, StoreCategorySalesResponse, StoreSalesData, YearlySalesData } from '../models/sales';

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    private http = inject(HttpClient);

    private readonly apiUrlBase = 'http://localhost:5253/analytics';

    getSalesData(): Observable<SalesData> {
        return this.http.get<SalesData>(`${this.apiUrlBase}/kpis`);
    }

    getSalesCategoryData(): Observable<SalesCategoryData[]> {
        return this.http.get<SalesCategoryData[]>(`${this.apiUrlBase}/categories`);
    }

    getDailySalesData(): Observable<DailySalesData[]> {
        return this.http.get<DailySalesData[]>(`${this.apiUrlBase}/daily-trend`);
    }

    getMonthlySalesData(): Observable<MonthlySalesData[]> {
        return this.http.get<MonthlySalesData[]>(`${this.apiUrlBase}/monthly-trend`);
    }

    getYearlySalesData(): Observable<YearlySalesData[]> {
        return this.http.get<YearlySalesData[]>(`${this.apiUrlBase}/yearly-trend`);
    }

    getStoresSalesData(startDate: string, endDate: string): Observable<StoreSalesData[]> {
        return this.http.get<StoreSalesData[]>(`${this.apiUrlBase}/stores?startDate=${startDate}&endDate=${endDate}`);
    }

    getDailyStoresSalesData(startDate: string, endDate: string, storeId: string): Observable<DailyStoreSalesData[]> {
        return this.http.get<DailyStoreSalesData[]>(`${this.apiUrlBase}/daily-sales/filtered?startDate=${startDate}&endDate=${endDate}&storeId=${storeId}`);
    }

    getBrandSalesData(): Observable<BrandSalesData[]> {
        return this.http.get<BrandSalesData[]>(`${this.apiUrlBase}/brands`);
    }

    getFilteredSalesData(startDate: string | null, endDate: string | null, storeId?: string): Observable<SalesData> {
        if (storeId) {
            return this.http.get<SalesData>(`${this.apiUrlBase}/kpis/filtered?startDate=${startDate}&endDate=${endDate}&storeId=${storeId}`);
        } else {
            return this.http.get<SalesData>(`${this.apiUrlBase}/kpis/filtered?startDate=${startDate}&endDate=${endDate}`);
        }
    }

    getProductSalesData(pageNumber: number = 1, pageSize: number = 10): Observable<ProductSalesResponse> {
        return this.http.get<ProductSalesResponse>(`${this.apiUrlBase}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getStoreCategorySalesData(pageNumber: number = 1, pageSize: number = 10): Observable<StoreCategorySalesResponse> {
        return this.http.get<StoreCategorySalesResponse>(`${this.apiUrlBase}/store-category?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getFilteredStoreCategorySalesData(startDate: string, endDate: string, storeId?: string): Observable<StoreCategorySalesData[]> {
        if (storeId) {
            return this.http.get<StoreCategorySalesData[]>(`${this.apiUrlBase}/store-category/filtered?startDate=${startDate}&endDate=${endDate}&storeId=${storeId}`);
        } else {
            return this.http.get<StoreCategorySalesData[]>(`${this.apiUrlBase}/store-category/filtered?startDate=${startDate}&endDate=${endDate}`);
        }
    }
}
