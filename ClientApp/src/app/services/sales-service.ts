import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandSalesData, DailySalesData, DailyStoreSalesData, MonthlySalesData, SalesCategoryData, SalesData, StoreSalesData } from '../models/sales';

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

    getStoresSalesData(): Observable<StoreSalesData[]> {
        return this.http.get<StoreSalesData[]>(`${this.apiUrlBase}/stores`);
    }

    getDailyStoresSalesData(): Observable<DailyStoreSalesData[]> {
        return this.http.get<DailyStoreSalesData[]>(`${this.apiUrlBase}/daily-sales/filtered?startDate=2025-01-01&endDate=2025-02-01&storeId=ST008`);
    }

    getBrandSalesData(): Observable<BrandSalesData[]> {
        return this.http.get<BrandSalesData[]>(`${this.apiUrlBase}/brands`);
    }

    getFilteredSalesData(startDate: string | null, endDate: string | null, storeId: string | null): Observable<SalesData> {
        return this.http.get<SalesData>(`${this.apiUrlBase}/kpis/filtered?startDate=2025-01-01&endDate=2025-02-01&storeId=ST005`);
    }
}
