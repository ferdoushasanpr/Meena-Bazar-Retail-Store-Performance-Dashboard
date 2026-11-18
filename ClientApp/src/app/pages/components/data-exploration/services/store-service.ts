import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { StoreDataResponse } from '../../../../core/models/store';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private operationsService = inject(OperationsService);

    // state
    componentDataLoading = signal<boolean>(false);
    componentDataError = signal<string | null>(null);

    // Contents
    componentData = signal<StoreDataResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    addStore(data: any) {
        return this.operationsService.addStoreData(data);
    }

    loadSearchStoreData(pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.searchStoresData(pageNumber, undefined, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to search stores. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    loadStoreData(pageNumber: number, pageSize?: number) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.getStoresPaginatedData(pageNumber, pageSize).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to load stores. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        })
    }

    updateStore(id: string, data: any) {
        return this.operationsService.updateStoreData(data, id);
    }

    deleteStore(id: string) {
        return this.operationsService.deleteStoreData(id);
    }
}
