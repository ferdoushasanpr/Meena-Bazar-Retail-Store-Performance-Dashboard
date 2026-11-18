import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { UserData, UserDataResponse } from '../../core/models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private operationService = inject(OperationsService);

    // state State
    componentDataLoading = signal<boolean>(false);
    userDataLoading = signal<boolean>(false);

    // Error State
    componentDataError = signal<string | null>(null);
    userDataError = signal<string | null>(null);

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

    loadSearchUserData(pageNumber: number, token: string, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationService.searchUsersData(pageNumber, undefined, token, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to search users. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    loadUserData(token: string, pageNumber: number, pageSize: number = 10) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationService.getUsersData(pageNumber, pageSize, token).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to load users. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    getUserById(user_id: string, token: string) {
        this.userDataLoading.set(true);
        this.userDataError.set(null);
        return this.operationService.getUserData(user_id, token).subscribe({
            next: (response) => {
                this.userData.set(response);
                this.userDataLoading.set(false);
            },
            error: (error) => {
                this.userDataLoading.set(false);
                this.userDataError.set("Unable to load user data. Please try again.");
            }
        });
    }

    updateUser(user_id: string, user: any, token: string) {
        return this.operationService.updateUserData(user_id, user, token);
    }

    deleteUser(id: string, token: string) {
        return this.operationService.deleteUserData(id, token);
    }
}
