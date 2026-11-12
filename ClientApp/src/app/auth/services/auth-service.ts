import { inject, Injectable, signal } from '@angular/core';
import { AuthData, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../pages/services/user-service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private userService = inject(UserService);
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

        const parsedData: AuthData = JSON.parse(data)
        this.authData.set(parsedData);
        this.userService.getUserById(parsedData.userId, parsedData.token);
        return true;
    }

    login(request: LoginRequest): void {
        this.http.post<AuthResponse>(`${this.apiUrlBase}/login`, request).subscribe({
            next: (response) => {
                this.authData.set(response.data);
                localStorage.setItem('data', JSON.stringify(response.data));
                this.userService.getUserById(response.data.userId, response.data.token);
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
                this.userService.getUserById(response.data.userId, response.data.token);
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
