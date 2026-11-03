import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StoreData } from '../models/store';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class OperationsService {
    private http = inject(HttpClient);
    private readonly apiUrlBase = 'http://localhost:5253';

    getStoresData(): Observable<StoreData[]> {
        return this.http.get<StoreData[]>(`${this.apiUrlBase}/stores`);
    }
}
