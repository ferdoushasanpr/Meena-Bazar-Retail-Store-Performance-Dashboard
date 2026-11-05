import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeader } from '../../layout/page-header/page-header';
import { OperationsService } from '../../core/services/operations-service';

export type DataTab = 'Customer' | 'Product' | 'Store';

@Component({
  imports: [PageHeader, ReactiveFormsModule],
  selector: 'app-add-data',
  styleUrl: './add-data.css',
  templateUrl: './add-data.html',
})
export class AddData {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private operationsService = inject(OperationsService)

  // Page Header Info
  pageHeaderTitle = 'Add Data';
  pageHeaderSubtitle =
    'Upload and manage your data sources to power insightful analytics, accurate reporting, and meaningful business insights.';

  // Active Tab State
  activeTab = signal<DataTab>('Customer');
  tabs: DataTab[] = ['Customer', 'Product', 'Store'];

  // Forms Definition
  customerForm: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    city: ['', [Validators.required, Validators.maxLength(50)]],
  });

  productForm: FormGroup = this.fb.group({
    product_name: ['', [Validators.required, Validators.maxLength(50)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    brand: ['', [Validators.required, Validators.maxLength(50)]],
    unit_cost: [null, [Validators.required, Validators.min(0)]],
    unit_price: [null, [Validators.required, Validators.min(0)]],
    vat_rate: [0, [Validators.required, Validators.min(0)]],
  });

  storeForm: FormGroup = this.fb.group({
    store_name: ['', [Validators.required, Validators.maxLength(50)]],
    city: ['', [Validators.required, Validators.maxLength(50)]],
  });

  setTab(tab: DataTab): void {
    this.activeTab.set(tab);
  }

  // Form Submissions
  onCustomerSubmit(): void {
    if (this.customerForm.valid) {
      //console.log('Customer Data:', this.customerForm.value);
      this.operationsService.addCustomerData(this.customerForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['data-explorer/customers']);
        },
        error: (error) => { console.error(error) }
      });

      this.customerForm.reset();
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  onProductSubmit(): void {
    if (this.productForm.valid) {
      //console.log('Product Data:', this.productForm.value);
      this.operationsService.addProductData(this.productForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['data-explorer/products']);
        },
        error: (error) => { console.error(error) }
      });

      this.productForm.reset();
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onStoreSubmit(): void {
    if (this.storeForm.valid) {
      //console.log('Store Data:', this.storeForm.value);
      this.operationsService.addStoreData(this.storeForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['data-explorer/stores']);
        },
        error: (error) => { console.error(error) }
      });

      this.storeForm.reset();
    } else {
      this.storeForm.markAllAsTouched();
    }
  }
}
