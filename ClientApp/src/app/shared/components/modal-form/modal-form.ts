import { Component, input, output, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntityType, UpdatePayload } from '../../../core/models/props';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-modal-form',
  styleUrl: './modal-form.css',
  templateUrl: './modal-form.html',
})
export class ModalForm {
  private fb = inject(FormBuilder);

  // Inputs
  isOpen = input<boolean>(false);
  entityType = input<EntityType>('Customer');
  initialData = input<any>(null);

  // Outputs
  closeModal = output<void>();
  saveData = output<UpdatePayload>();

  // Reactive Forms
  customerForm: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    city: ['', [Validators.required, Validators.maxLength(50)]]
  });

  productForm: FormGroup = this.fb.group({
    product_name: ['', [Validators.required, Validators.maxLength(50)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    brand: ['', [Validators.required, Validators.maxLength(50)]],
    unit_cost: [0, [Validators.required, Validators.min(0)]],
    unit_price: [0, [Validators.required, Validators.min(0)]],
    vat_rate: [0, [Validators.required, Validators.min(0)]]
  });

  storeForm: FormGroup = this.fb.group({
    store_name: ['', [Validators.required, Validators.maxLength(50)]],
    city: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor() {
    // Populate form fields whenever new initialData is passed to modal
    effect(() => {
      const data = this.initialData();
      const type = this.entityType();

      if (data && this.isOpen()) {
        if (type === 'Customer') {
          this.customerForm.patchValue({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            city: data.city || ''
          });
        } else if (type === 'Product') {
          this.productForm.patchValue({
            product_name: data.product_name || '',
            category: data.category || '',
            brand: data.brand || '',
            unit_cost: data.unit_cost ?? 0,
            unit_price: data.unit_price ?? 0,
            vat_rate: data.vat_rate ?? 0
          });
        } else if (type === 'Store') {
          this.storeForm.patchValue({
            store_name: data.store_name || '',
            city: data.city || ''
          });
        }
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSave(): void {
    const type = this.entityType();
    let form: FormGroup;

    if (type === 'Customer') form = this.customerForm;
    else if (type === 'Product') form = this.productForm;
    else form = this.storeForm;

    if (form.valid) {
      this.saveData.emit({
        type,
        id: this.initialData()[`${type.toLowerCase()}_id`],
        data: form.value
      });
    } else {
      form.markAllAsTouched();
    }
  }
}
