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

    isSubmitting = signal<boolean>(false);
    authError = signal<string | null>(null);

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
        this.userService.getUserById(parsedData.userId);
        return true;
    }

    login(request: LoginRequest): void {
        this.isSubmitting.set(true);
        this.authError.set(null);
        this.http.post<AuthResponse>(`${this.apiUrlBase}/login`, request).subscribe({
            next: (response) => {
                this.authData.set(response.data);
                localStorage.setItem('data', JSON.stringify(response.data));
                this.userService.getUserById(response.data.userId);
                this.router.navigate(['/']);
                this.isSubmitting.set(false);
            },
            error: (error) => {
                this.authError.set("Incorrect Email or Password.");
                this.isSubmitting.set(false);
            }
        });
    }

    signup(request: RegisterRequest): void {
        this.isSubmitting.set(true);
        this.authError.set(null);
        this.http.post<AuthResponse>(`${this.apiUrlBase}/register`, request).subscribe({
            next: (response) => {
                this.authData.set(response.data);
                localStorage.setItem('data', JSON.stringify(response.data));
                this.userService.getUserById(response.data.userId);
                this.router.navigate(['/']);
                this.isSubmitting.set(false);
            },
            error: (error) => {
                this.authError.set(error.error.message);
                this.isSubmitting.set(false);
            }
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
