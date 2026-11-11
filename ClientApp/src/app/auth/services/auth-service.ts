import { inject, Injectable, signal } from '@angular/core';
import { AuthData, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly apiUrlBase = 'http://localhost:5253/auth';

    authData = signal<AuthData | null>({
        token: "",
        expiresAt: "",
        role: "",
        userId: "",
        userName: "",
        userEmail: "",
    });

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
                this.authData.set(response.data);
                localStorage.setItem('data', JSON.stringify(response.data));
                this.router.navigate(['/']);
            },
            error: (error) => { console.error(error) }
        });
    }

    signup(request: RegisterRequest): void {
        this.http.post<AuthResponse>(`${this.apiUrlBase}/register`, request).subscribe({
            next: (response) => {
                this.authData.set(response.data);
                localStorage.setItem('data', JSON.stringify(response.data));
                this.router.navigate(['/']);
            },
            error: (error) => { console.error(error) }
        });
    }

    logout(): void {
        if (this.authData()) {
            localStorage.removeItem('data');
            this.authData.set(null);
            this.router.navigate(['/']);
        }
    }
}
