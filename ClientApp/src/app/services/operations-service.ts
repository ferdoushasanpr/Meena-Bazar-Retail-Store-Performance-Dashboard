import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class OperationsService {
    private http = inject(HttpClient);
    private readonly apiUrlBase = 'http://localhost:5253/';
}
