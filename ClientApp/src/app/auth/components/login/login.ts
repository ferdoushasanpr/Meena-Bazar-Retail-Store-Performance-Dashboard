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
  authSuccess = signal<string | null>(null);
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
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
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
    this.authSuccess.set(null);
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
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      this.isSubmitting.set(true);
      this.authError.set(null);
      console.log('Signup Payload:', this.signupForm.value);

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.authSuccess.set('Account created successfully! You can now log in.');
        setTimeout(() => this.toggleAuthMode(), 1200);
      }, 600);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
