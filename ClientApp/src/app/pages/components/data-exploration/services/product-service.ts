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

    addProduct(token: string, data: any) {
        return this.operationsService.addProductData(token, data);
    }

    loadSearchProductData(token: string, pageNumber: number, searchTerm?: string) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.searchProductsData(token, pageNumber, undefined, searchTerm).subscribe({
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

    loadProductData(token: string, pageNumber: number, pageSize?: number) {
        this.componentDataLoading.set(true);
        this.componentDataError.set(null);
        this.operationsService.getProductsData(token, pageNumber, pageSize).subscribe({
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

    updateProduct(token: string, id: string, data: any) {
        return this.operationsService.updateProductData(token, data, id);
    }

    deleteProduct(token: string, id: string) {
        return this.operationsService.deleteProductData(token, id);
    }
}
