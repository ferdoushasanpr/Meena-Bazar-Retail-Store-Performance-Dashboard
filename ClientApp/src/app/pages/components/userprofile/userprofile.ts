import { Component, computed, input, output } from '@angular/core';
import { UserData } from '../../../core/models/user';
import { DatePipe } from '@angular/common';
import { getNameInitials } from '../../../shared/utilities/name-initials';

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
    return getNameInitials(this.user()?.user_name);
  });

  onClose(): void {
    this.closeModal.emit();
  }
}
