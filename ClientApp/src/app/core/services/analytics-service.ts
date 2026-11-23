import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandSalesData, DailySalesData, DailyStoreSalesData, EntityCountData, MonthlySalesData, ProductSalesData, ProductSalesResponse, SalesCategoryData, SalesData, StoreCategorySalesData, StoreCategorySalesResponse, StoreSalesData, YearlySalesData } from '../models/sales';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private http = inject(HttpClient);

    private readonly apiUrlBase = 'http://localhost:5253/analytics';

    getEntityCountData(token: string): Observable<EntityCountData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<EntityCountData>(`${this.apiUrlBase}/entitycount`, { headers });
    }

    getSalesData(token: string): Observable<SalesData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<SalesData>(`${this.apiUrlBase}/kpis`, { headers });
    }

    getSalesCategoryData(token: string, startDate?: string, endDate?: string): Observable<SalesCategoryData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        if (!startDate && !endDate) {
            return this.http.get<SalesCategoryData[]>(`${this.apiUrlBase}/categories`, { headers });
        } else {
            return this.http.get<SalesCategoryData[]>(`${this.apiUrlBase}/categories?startDate=${startDate}&endDate=${endDate}`, { headers });
        }
    }

    getDailySalesData(token: string): Observable<DailySalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<DailySalesData[]>(`${this.apiUrlBase}/daily-trend`, { headers });
    }

    getMonthlySalesData(token: string): Observable<MonthlySalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<MonthlySalesData[]>(`${this.apiUrlBase}/monthly-trend`, { headers });
    }

    getYearlySalesData(token: string): Observable<YearlySalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<YearlySalesData[]>(`${this.apiUrlBase}/yearly-trend`, { headers });
    }

    getStoresSalesData(token: string, startDate: string, endDate: string): Observable<StoreSalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<StoreSalesData[]>(`${this.apiUrlBase}/stores?startDate=${startDate}&endDate=${endDate}`, { headers });
    }

    getDailyStoresSalesData(token: string, startDate: string, endDate: string, storeId: string): Observable<DailyStoreSalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<DailyStoreSalesData[]>(`${this.apiUrlBase}/daily-sales/filtered?startDate=${startDate}&endDate=${endDate}&storeId=${storeId}`, { headers });
    }

    getBrandSalesData(token: string): Observable<BrandSalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<BrandSalesData[]>(`${this.apiUrlBase}/brands`, { headers });
    }

<<<<<<< HEAD
    getFilteredSalesData(startDate: string | null, endDate: string | null, storeId?: string): Observable<SalesData> {
=======
    getFilteredSalesData(token: string, startDate: string, endDate: string, storeId?: string): Observable<SalesData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
>>>>>>> frontend
        if (storeId) {
            return this.http.get<SalesData>(`${this.apiUrlBase}/kpis/filtered?startDate=${startDate}&endDate=${endDate}&storeId=${storeId}`, { headers });
        } else {
            return this.http.get<SalesData>(`${this.apiUrlBase}/kpis/filtered?startDate=${startDate}&endDate=${endDate}`, { headers });
        }
    }

    getProductSalesData(token: string, pageNumber: number = 1, pageSize: number = 10, startDate?: string, endDate?: string): Observable<ProductSalesResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        if (!startDate && !endDate) {
            return this.http.get<ProductSalesResponse>(`${this.apiUrlBase}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
        } else {
            return this.http.get<ProductSalesResponse>(`${this.apiUrlBase}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`, { headers });
        }
    }

    getStoreProductSalesData(token: string, pageNumber: number = 1, pageSize: number = 10, storeId?: string, startDate?: string, endDate?: string): Observable<any> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        if (storeId) {
            return this.http.get<any>(`${this.apiUrlBase}/store-product?pageNumber=${pageNumber}&pageSize=${pageSize}&storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`, { headers });
        } else {
            return this.http.get<any>(`${this.apiUrlBase}/store-product?pageNumber=${pageNumber}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`, { headers });
        }
    }

    getStoreCategorySalesData(token: string, pageNumber: number = 1, pageSize: number = 10, storeId?: string, startDate?: string, endDate?: string): Observable<StoreCategorySalesResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        if (storeId) {
            return this.http.get<StoreCategorySalesResponse>(`${this.apiUrlBase}/store-category?pageNumber=${pageNumber}&pageSize=${pageSize}&storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`, { headers });
        } else {
            return this.http.get<StoreCategorySalesResponse>(`${this.apiUrlBase}/store-category?pageNumber=${pageNumber}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`, { headers });
        }
    }

    getFilteredStoreCategorySalesData(token: string, startDate: string, endDate: string, storeId?: string): Observable<StoreCategorySalesData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        if (storeId) {
            return this.http.get<StoreCategorySalesData[]>(`${this.apiUrlBase}/store-category/filtered?startDate=${startDate}&endDate=${endDate}&storeId=${storeId}`, { headers });
        } else {
            return this.http.get<StoreCategorySalesData[]>(`${this.apiUrlBase}/store-category/filtered?startDate=${startDate}&endDate=${endDate}`, { headers });
        }
    }
}
