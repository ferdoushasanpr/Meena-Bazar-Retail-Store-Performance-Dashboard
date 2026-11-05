import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-dialog-box',
  styleUrl: './dialog-box.css',
  templateUrl: './dialog-box.html',
})
export class DialogBox {
  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('Confirm Deletion');
  itemName = input<string>('');
  message = input<string>(
    'Are you sure you want to delete this record? This action cannot be undone.'
  );

  // Outputs
  closeModal = output<void>();
  confirmDelete = output<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirm(): void {
    this.confirmDelete.emit();
  }
}
