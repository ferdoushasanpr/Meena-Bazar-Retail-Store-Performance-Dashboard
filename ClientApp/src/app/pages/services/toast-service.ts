import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastr = inject(ToastrService);

    showSuccess(title: string, message: string) {
        this.toastr.success(title, message);
    }

    showError(title: string, message: string) {
        this.toastr.error(`${title} 😂`, message);
    }
}
