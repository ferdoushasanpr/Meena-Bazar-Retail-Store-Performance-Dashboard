import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginRequest } from '../models/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly apiUrlBase = 'http://localhost:5253/auth';

    authData = signal<AuthResponse | null>(null);

    isAuth(): boolean {
        const data = localStorage.getItem('data');
        if (!data) {
            return false;
        }
        this.authData.set(JSON.parse(data));
        return true;
    }

    login(request: LoginRequest): void {
        this.http.post<AuthResponse>(`${this.apiUrlBase}/login`, request).subscribe({
            next: (response) => {
                this.authData.set(response);
                localStorage.setItem('data', JSON.stringify(response.data));
                this.router.navigate(['/']);
            },
            error: (error) => { console.error(error) }
        });
    }
}
