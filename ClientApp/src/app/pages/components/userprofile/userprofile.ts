import { Component, computed, input, output } from '@angular/core';
import { UserData } from '../../../core/models/user';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-userprofile',
  styleUrl: './userprofile.css',
  templateUrl: './userprofile.html',
})
export class Userprofile {
  isOpen = input<boolean>(false);
  user = input<UserData | null>(null);

  closeModal = output<void>();

  initials = computed(() => {
    const fullName = this.user()?.user_name?.trim();
    if (!fullName) return 'U';

    const parts = fullName.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  onClose(): void {
    this.closeModal.emit();
  }
}
