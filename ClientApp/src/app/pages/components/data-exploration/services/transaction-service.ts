import { inject, Service, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { TransactionDataResponse } from '../../../../core/models/transaction';

@Service()
export class TransactionService {
    private operationsService = inject(OperationsService);

    // Loading state
    componentDataLoading = signal<boolean>(false);

    // Contents
    componentData = signal<TransactionDataResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    loadSearchTransactionData(pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.operationsService.searchTransactionsData(pageNumber, undefined, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => { console.error(error) }
        });
    }

    loadTransactionsData(pageNumber: number): void {
        this.componentDataLoading.set(true);
        this.operationsService.getTransactionsData(pageNumber).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => { console.error(error) }
        });
    }
}
