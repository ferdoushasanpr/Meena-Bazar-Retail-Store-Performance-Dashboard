import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { UserData } from '../../core/models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private operationService = inject(OperationsService);

    userData = signal<UserData>({
        user_id: "",
        user_name: "",
        user_email: "",
        user_password_hash: "",
        user_role: "",
        user_signup: ""
    });

    getUserById(user_id: string, token: string) {
        return this.operationService.getUserData(user_id, token).subscribe({
            next: (response) => { this.userData.set(response) },
            error: (error) => { console.log(error) }
        });
    }

    updateUser(user_id: string, user: any, token: string) {
        return this.operationService.updateUserData(user_id, user, token);
    }
}
