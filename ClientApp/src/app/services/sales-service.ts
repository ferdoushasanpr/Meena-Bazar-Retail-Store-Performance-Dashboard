import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailySalesData, SalesCategoryData, SalesData } from '../models/sales';

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
}
