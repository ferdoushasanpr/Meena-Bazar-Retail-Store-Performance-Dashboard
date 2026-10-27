import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesData } from '../models/sales';

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    private http = inject(HttpClient);

    private readonly apiUrl = 'http://localhost:5253/analytics/kpis';

    getSalesData(): Observable<SalesData> {
        return this.http.get<SalesData>(this.apiUrl);
    }
}
