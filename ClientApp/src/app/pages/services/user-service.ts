import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { UserData, UserDataResponse } from '../../core/models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private operationService = inject(OperationsService);

    // Contents
    componentData = signal<UserDataResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    userData = signal<UserData>({
        user_id: "",
        user_name: "",
        user_email: "",
        user_password_hash: "",
        user_role: "",
        user_signup: ""
    });

    loadUserData(token: string, pageNumber: number, pageSize: number = 10) {
        return this.operationService.getUsersData(pageNumber, pageSize, token).subscribe({
            next: (response) => { this.componentData.set(response) },
            error: (error) => { console.log(error) }
        });
    }

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
