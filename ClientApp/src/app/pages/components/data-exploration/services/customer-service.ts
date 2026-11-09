import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { CustomerDataResponse } from '../../../../core/models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private operationsService = inject(OperationsService);

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

    addCustomer(data: any) {
        return this.operationsService.addCustomerData(data);
    }

    loadSearchCustomerData(pageNumber: number, searchTerm?: string) {
        this.operationsService.searchCustomersData(pageNumber, undefined, searchTerm).subscribe({
            next: (response) => { this.componentData.set(response); },
            error: (error) => { console.error(error) }
        });
    }

    loadCustomerData(pageNumber: number, pageSize?: number) {
        this.operationsService.getCustomersData(pageNumber, pageSize).subscribe({
            next: (response) => { this.componentData.set(response); },
            error: (error) => { console.error(error) }
        })
    }

    updateCustomer(id: string, data: any) {
        return this.operationsService.updateCustomerData(data, id);
    }

    deleteCustomer(id: string) {
        return this.operationsService.deleteCustomerData(id);
    }
}
