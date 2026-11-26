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

  orderForm: FormGroup = this.fb.group({
    store_id: ['', [Validators.required]],
    customer_id: ['', [Validators.required]],
    order_channel: ['', [Validators.required]],
    payment_method: ['', [Validators.required]],
    order_status: ['', [Validators.required]],
  });

  transactionForm: FormGroup = this.fb.group({
    order_id: ['', [Validators.required]],
    product_id: ['', [Validators.required]],
    quantity: [0, [Validators.required]],
    unit_price: [0, [Validators.required]],
    discount_amount: [0, [Validators.required]]
  });

  userForm: FormGroup = this.fb.group({
    user_name: ['', [Validators.required, Validators.maxLength(50)]],
    user_email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    user_role: ['', [Validators.required]]
  });

  constructor() {
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
        } else if (type === 'Order') {
          this.orderForm.patchValue({
            store_id: data.store_id || '',
            customer_id: data.customer_id || '',
            order_channel: data.order_channel || '',
            payment_method: data.payment_method || '',
            order_status: data.order_status || ''
          });
        } else if (type === 'Transaction') {
          this.transactionForm.patchValue({
            order_id: data.order_id || '',
            product_id: data.product_id || '',
            quantity: data.quantity ?? 0,
            unit_price: data.unit_price ?? 0,
            discount_amount: data.discount_amount ?? 0
          });
        } else if (type === 'User') {
          this.userForm.patchValue({
            user_name: data.user_name || '',
            user_email: data.user_email || '',
            user_role: data.user_role || ''
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
    else if (type === 'Store') form = this.storeForm;
    else if (type === 'Order') form = this.orderForm;
    else if (type === 'Transaction') form = this.transactionForm;
    else form = this.userForm;

    if (form.valid) {
      this.saveData.emit({
        type,
        id: this.initialData()[type === 'Transaction' ? 'order_item_id' : `${type.toLowerCase()}_id`],
        data: form.value
      });
    } else {
      form.markAllAsTouched();
    }
  }
}
