import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { StoreDataResponse } from '../../../../core/models/store';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private operationsService = inject(OperationsService);

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
        this.operationsService.searchStoresData(pageNumber, undefined, searchTerm).subscribe({
            next: (response) => { this.componentData.set(response); },
            error: (error) => { console.error(error) }
        });
    }

    loadStoreData(pageNumber: number, pageSize?: number) {
        this.operationsService.getStoresPaginatedData(pageNumber, pageSize).subscribe({
            next: (response) => { this.componentData.set(response); },
            error: (error) => { console.error(error) }
        })
    }

    updateStore(id: string, data: any) {
        return this.operationsService.updateStoreData(data, id);
    }

    deleteStore(id: string) {
        return this.operationsService.deleteStoreData(id);
    }
}
