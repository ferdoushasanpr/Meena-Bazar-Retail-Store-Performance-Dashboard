import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../../auth/services/auth-service';
import { ToastService } from '../../services/toast-service';
import { Loading } from '../../../shared/components/loading/loading';
import { ErrorDisplay } from '../../../shared/components/error-display/error-display';

@Component({
  imports: [ReactiveFormsModule, PageHeader, Loading, ErrorDisplay],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  // Auth Data
  authData = this.authService.authData;

  // User Data
  userDataLoading = this.userService.userDataLoading;
  userDataError = this.userService.userDataError;
  userData = this.userService.userData;

  // Page Header Metadata
  pageHeaderTitle = 'Account Settings';
  pageHeaderSubtitle =
    'Update your profile details and security credentials in one place.';

  // Feedback State & Loading
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<boolean>(false);
  showCurrentPassword = signal<boolean>(false);
  showNewPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  hasError = computed(() => {
    return !!(this.userDataError());
  });

  settingsErrorMessage = computed(() => {
    return (this.userDataError());
  });

  // Settings Form
  settingsForm: FormGroup = this.fb.group(
    {
      user_name: ['', [Validators.required, Validators.maxLength(50)]],
      user_email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    },
    { validators: this.passwordValidationHandler }
  );

  constructor() {
    effect(() => {
      const user = this.userData();

      if (user) {
        this.settingsForm.patchValue({
          user_name: user.user_name,
          user_email: user.user_email
        });
      }
    });
  }

  loadComponentData(): void {
    this.authService.isAuth();
  }

  // Custom Validator
  private passwordValidationHandler(group: AbstractControl): ValidationErrors | null {
    const currentPass = group.get('currentPassword')?.value;
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    const errors: ValidationErrors = {};

    if (newPass && !currentPass) {
      errors['currentRequired'] = true;
    }

    if (newPass && currentPass && newPass === currentPass) {
      errors['currentRequired'] = true;
    }

    if (newPass && newPass !== confirmPass) {
      errors['passwordMismatch'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.isSubmitting.set(true);

      const formValue = this.settingsForm.getRawValue();
      const auth = this.authData();

      if (!auth?.userId || !auth?.token) {
        return;
      }

      const user: any = {
        user_id: auth.userId,
        user_name: formValue.user_name,
        user_email: formValue.user_email
      }

      if (formValue.newPassword) {
        user.updated_password = formValue.newPassword;
      }

      this.userService.updateUser(auth.userId, user, auth.token).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.toastService.showSuccess("Update", "Account settings updated successfully!");
          this.settingsForm.patchValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
          this.settingsForm.markAsPristine();
          this.userService.getUserById(auth.userId, auth.token);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else {
      this.settingsForm.markAllAsTouched();
    }
  }

  togglePassword(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') this.showCurrentPassword.update((val) => !val);
    if (field === 'new') this.showNewPassword.update((val) => !val);
    if (field === 'confirm') this.showConfirmPassword.update((val) => !val);
  }
}
