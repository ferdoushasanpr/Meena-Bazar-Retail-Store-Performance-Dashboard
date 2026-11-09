import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';

@Component({
  imports: [ReactiveFormsModule, PageHeader],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  private fb = inject(FormBuilder);

  // Page Header Metadata
  pageHeaderTitle = 'Account Settings';
  pageHeaderSubtitle =
    'Update your profile details and security credentials in one place.';

  // Feedback State & Loading
  saveSuccess = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  // Password Visibility Toggles
  showCurrentPassword = signal<boolean>(false);
  showNewPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  // Unified Single Form
  settingsForm: FormGroup = this.fb.group(
    {
      firstName: ['John', [Validators.required, Validators.maxLength(50)]],
      lastName: ['Doe', [Validators.required, Validators.maxLength(50)]],
      email: ['john.doe@example.com', [Validators.required, Validators.email, Validators.maxLength(50)]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    },
    { validators: this.passwordValidationHandler }
  );

  // Custom Validator: Validates password requirements when changing password
  private passwordValidationHandler(group: AbstractControl): ValidationErrors | null {
    const currentPass = group.get('currentPassword')?.value;
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    const errors: ValidationErrors = {};

    if (newPass && !currentPass) {
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
      console.log('Updating Account Settings:', this.settingsForm.value);

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.saveSuccess.set('Account settings updated successfully.');
        this.settingsForm.patchValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
        this.settingsForm.markAsPristine();

        setTimeout(() => this.saveSuccess.set(null), 4000);
      }, 600);
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
