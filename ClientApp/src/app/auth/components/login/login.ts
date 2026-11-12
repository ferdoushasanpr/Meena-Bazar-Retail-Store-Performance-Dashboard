import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  isLoginMode = signal<boolean>(true);

  authError = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  showLoginPassword = signal<boolean>(false);
  showSignupPassword = signal<boolean>(false);

  // Login Form
  loginForm: FormGroup = this.fb.group({
    user_email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // Signup Form
  signupForm: FormGroup = this.fb.group(
    {
      user_name: ['', [Validators.required, Validators.maxLength(50)]],
      user_email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass && confirmPass && pass !== confirmPass ? { passwordMismatch: true } : null;
  }

  toggleAuthMode(): void {
    this.isLoginMode.update((mode) => !mode);
    this.authError.set(null);
    this.loginForm.reset();
    this.signupForm.reset();
  }

  togglePasswordVisibility(form: 'login' | 'signup'): void {
    if (form === 'login') this.showLoginPassword.update((val) => !val);
    if (form === 'signup') this.showSignupPassword.update((val) => !val);
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);
      this.authError.set(null);
      this.authService.login(this.loginForm.value);
      setTimeout(() => { this.isSubmitting.set(false); }, 2000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      this.isSubmitting.set(true);
      this.authError.set(null);
      this.authService.signup(this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
