import { inject, Injectable, signal } from '@angular/core';
import { OrderDataResponse } from '../../../../core/models/order';
import { OperationsService } from '../../../../core/services/operations-service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private operationsService = inject(OperationsService);

    // state
    componentDataLoading = signal<boolean>(false);
    componentDataError = signal<string | null>(null);

    // Contents
    componentData = signal<OrderDataResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    loadSearchOrderData(token: string, pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.searchOrdersData(token, pageNumber, undefined, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to search orders. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    loadOrderData(token: string, pageNumber: number, pageSize?: number) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.getOrdersData(token, pageNumber, pageSize).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to load orders. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        })
    }

    updateOrder(token: string, id: string, data: any) {
        return this.operationsService.updateOrderData(token, data, id);
    }

    deleteOrder(token: string, id: string) {
        return this.operationsService.deleteOrderData(token, id);
    }
}
