import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { OrderDataResponse } from '../../core/models/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private operationsService = inject(OperationsService);

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

    loadSearchOrderData(pageNumber: number, searchTerm?: string) {
        this.operationsService.searchOrdersData(pageNumber, undefined, searchTerm).subscribe({
            next: (response) => { this.componentData.set(response); },
            error: (error) => { console.error(error) }
        });
    }

    loadOrderData(pageNumber: number, pageSize?: number) {
        this.operationsService.getOrdersData(pageNumber, pageSize).subscribe({
            next: (response) => { this.componentData.set(response); },
            error: (error) => { console.error(error) }
        })
    }
}
