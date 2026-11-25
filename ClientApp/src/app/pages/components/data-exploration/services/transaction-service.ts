import { inject, Service, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { TransactionDataResponse } from '../../../../core/models/transaction';

@Service()
export class TransactionService {
    private operationsService = inject(OperationsService);

    // state
    componentDataLoading = signal<boolean>(false);
    componentDataError = signal<string | null>(null);

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

    loadSearchTransactionData(token: string, pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.searchTransactionsData(token, pageNumber, undefined, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to search transactions. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    loadTransactionsData(token: string, pageNumber: number): void {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.getTransactionsData(token, pageNumber).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to load transactions. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    deleteTransaction(token: string, id: string) {
        return this.operationsService.deleteTransactionData(token, id);
    }
}
