import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../../../core/services/operations-service';
import { ProductDataResponse } from '../../../../core/models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private operationsService = inject(OperationsService);

    // state
    componentDataLoading = signal<boolean>(false);
    componentDataError = signal<string | null>(null);

    // Contents
    componentData = signal<ProductDataResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    addProduct(data: any) {
        return this.operationsService.addProductData(data);
    }

    loadSearchProductData(pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.searchProductsData(pageNumber, undefined, searchTerm).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to search products. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        });
    }

    loadProductData(pageNumber: number, pageSize?: number) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.getProductsData(pageNumber, pageSize).subscribe({
            next: (response) => {
                this.componentData.set(response);
                this.componentDataLoading.set(false);
            },
            error: (error) => {
                this.componentDataError.set(
                    'Unable to load products. Please try again.'
                );
                this.componentDataLoading.set(false);
            }
        })
    }

    updateProduct(id: string, data: any) {
        return this.operationsService.updateProductData(data, id);
    }

    deleteProduct(id: string) {
        return this.operationsService.deleteProductData(id);
    }
}
