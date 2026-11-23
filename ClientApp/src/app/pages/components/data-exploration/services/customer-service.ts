import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { CustomerDataResponse } from '../../../../core/models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private operationsService = inject(OperationsService);

    // state
    componentDataLoading = signal<boolean>(false);
    componentDataError = signal<string | null>(null);

    // Contents
    componentData = signal<CustomerDataResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    addCustomer(token: string, data: any) {
        return this.operationsService.addCustomerData(token, data);
    }

    loadSearchCustomerData(token: string, pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.searchCustomersData(token, pageNumber, undefined, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to search customers. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    loadCustomerData(token: string, pageNumber: number, pageSize?: number) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.getCustomersData(token, pageNumber, pageSize).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to load customers. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        })
    }

    updateCustomer(token: string, id: string, data: any) {
        return this.operationsService.updateCustomerData(token, data, id);
    }

    deleteCustomer(token: string, id: string) {
        return this.operationsService.deleteCustomerData(token, id);
    }
}
