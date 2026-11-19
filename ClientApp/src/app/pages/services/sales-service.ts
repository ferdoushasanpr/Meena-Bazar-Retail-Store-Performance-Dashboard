import { inject, Injectable, signal } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics-service';
import { OperationsService } from '../../core/services/operations-service';
import { BrandSalesData, DailySalesData, DailyStoreSalesData, EntityCountData, MonthlySalesData, ProductSalesResponse, SalesCategoryData, SalesData, StoreCategorySalesData, StoreCategorySalesResponse, StoreProductSalesResponse, StoreSalesData, YearlySalesData } from '../../core/models/sales';
import { StoreData } from '../../core/models/store';

@Injectable({
    providedIn: 'root'
})

export class SalesService {
    private businessKpiService = inject(AnalyticsService);
    private operationsService = inject(OperationsService);

    // Loading States
    entityCountLoading = signal<boolean>(false);
    salesKpiLoading = signal<boolean>(false);
    salesCategoryLoading = signal<boolean>(false);
    dailySalesLoading = signal<boolean>(false);
    monthlySalesLoading = signal<boolean>(false);
    yearlySalesLoading = signal<boolean>(false);
    brandSalesLoading = signal<boolean>(false);
    dailyStoreSaleLoading = signal<boolean>(false);
    filteredStoreCategorySalesLoading = signal<boolean>(false);
    storesSalesLoading = signal<boolean>(false);
    paginatedSalesLoading = signal<boolean>(false);

    // Error States
    entityCountError = signal<string | null>(null);
    salesKpiError = signal<string | null>(null);
    salesCategoryError = signal<string | null>(null);
    dailySalesError = signal<string | null>(null);
    monthlySalesError = signal<string | null>(null);
    yearlySalesError = signal<string | null>(null);
    brandSalesError = signal<string | null>(null);
    dailyStoreSaleError = signal<string | null>(null);
    filteredStoreCategorySalesError = signal<string | null>(null);
    storesSalesError = signal<string | null>(null);
    paginatedSalesError = signal<string | null>(null);

    // Data
    entityCountData = signal<EntityCountData>({
        numberOfCustomer: 0,
        numberOfOrder: 0,
        numberOfProduct: 0,
        numberOfStore: 0,
    });

    salesKpiData = signal<SalesData>({
        totalSales: 0.0,
        numberOfTransactions: 0,
        averageBasketValue: 0.0,
        averageDailySales: 0.0
    });

    paginatedSalesData = signal<StoreCategorySalesResponse | StoreProductSalesResponse | ProductSalesResponse>({
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    salesCategoryData = signal<SalesCategoryData[]>([]);
    dailySalesData = signal<DailySalesData[]>([]);
    monthlySalesData = signal<MonthlySalesData[]>([]);
    yearlySalesData = signal<YearlySalesData[]>([]);
    brandSalesData = signal<BrandSalesData[]>([]);
    dailyStoreSalesData = signal<DailyStoreSalesData[]>([]);
    filteredStoreCategorySalesData = signal<StoreCategorySalesData[]>([]);
    storesSalesData = signal<StoreSalesData[]>([]);
    storesArr = signal<StoreData[]>([]);

    loadEntityCountData(): void {
        this.entityCountLoading.set(true);
        this.entityCountError.set(null);
        this.businessKpiService.getEntityCountData().subscribe({
            next: (response) => {
                this.entityCountData.set(response);
                this.entityCountLoading.set(false);
            },
            error: (error) => {
                this.entityCountError.set(
                    'Unable to load data. Please try again.'
                );
                this.entityCountLoading.set(false);
            }
        });
    }

    loadSalesKpiData(): void {
        this.salesKpiLoading.set(true);
        this.salesKpiError.set(null);
        this.businessKpiService.getSalesData().subscribe({
            next: (response) => {
                this.salesKpiData.set(response);
                this.salesKpiLoading.set(false);
            },
            error: (error) => {
                this.salesKpiError.set(
                    'Unable to load data. Please try again.'
                );
                this.salesKpiLoading.set(false);
            }
        });
    }

    loadSalesCategoryData(startDate?: string, endDate?: string): void {
        this.salesCategoryLoading.set(true);
        this.salesCategoryError.set(null);
        this.businessKpiService.getSalesCategoryData(startDate, endDate).subscribe({
            next: (response) => {
                this.salesCategoryData.set(response);
                this.salesCategoryLoading.set(false);
            },
            error: (error) => {
                this.salesCategoryError.set(
                    'Unable to load data. Please try again.'
                );
                this.salesCategoryLoading.set(false);
            }
        });
    }

    loadDailySalesData(): void {
        this.dailySalesLoading.set(true);
        this.dailySalesError.set(null);
        this.businessKpiService.getDailySalesData().subscribe({
            next: (response) => {
                this.dailySalesData.set(response);
                this.dailySalesLoading.set(false);
            },
            error: (error) => {
                this.dailySalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.dailySalesLoading.set(false);
            }
        });
    }

    loadMonthlySalesData(): void {
        this.monthlySalesLoading.set(true);
        this.monthlySalesError.set(null);
        this.businessKpiService.getMonthlySalesData().subscribe({
            next: (response) => {
                this.monthlySalesData.set(response);
                this.monthlySalesLoading.set(false);
            },
            error: (error) => {
                this.monthlySalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.monthlySalesLoading.set(false);
            }
        });
    }

    loadYearlySalesData(): void {
        this.yearlySalesLoading.set(true);
        this.yearlySalesError.set(null);
        this.businessKpiService.getYearlySalesData().subscribe({
            next: (response) => {
                this.yearlySalesData.set(response);
                this.yearlySalesLoading.set(false);
            },
            error: (error) => {
                this.yearlySalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.yearlySalesLoading.set(false);
            }
        });
    }

    loadBrandSalesData(): void {
        this.brandSalesLoading.set(true);
        this.brandSalesError.set(null);
        this.businessKpiService.getBrandSalesData().subscribe({
            next: (response) => {
                this.brandSalesData.set(response);
                this.brandSalesLoading.set(false);
            },
            error: (error) => {
                this.brandSalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.brandSalesLoading.set(false);
            }
        });
    }

    loadFilteredSalesData(startDate: string, endDate: string, storeId?: string): void {
        this.salesKpiLoading.set(true);
        this.salesKpiError.set(null);
        this.businessKpiService.getFilteredSalesData(startDate, endDate, storeId).subscribe({
            next: (response) => {
                this.salesKpiData.set(response);
                this.salesKpiLoading.set(false);
            },
            error: (error) => {
                this.salesKpiError.set(
                    'Unable to load data. Please try again.'
                );
                this.salesKpiLoading.set(false);
            }
        });
    }

    loadDailyStoreSalesData(startDate: string, endDate: string, storeId: string): void {
        this.dailyStoreSaleLoading.set(true);
        this.dailyStoreSaleError.set(null);
        this.businessKpiService.getDailyStoresSalesData(startDate, endDate, storeId).subscribe({
            next: (response) => {
                this.dailyStoreSalesData.set(response);
                this.dailyStoreSaleLoading.set(false);
            },
            error: (error) => {
                this.dailyStoreSaleError.set(
                    'Unable to load data. Please try again.'
                );
                this.dailyStoreSaleLoading.set(false);
            }
        });
    }

    loadFilteredStoreCategorySalesData(startDate: string, endDate: string, storeId?: string): void {
        this.filteredStoreCategorySalesLoading.set(true);
        this.filteredStoreCategorySalesError.set(null);
        this.businessKpiService.getFilteredStoreCategorySalesData(startDate, endDate, storeId).subscribe({
            next: (response) => {
                this.filteredStoreCategorySalesData.set(response);
                this.filteredStoreCategorySalesLoading.set(false);
            },
            error: (error) => {
                this.filteredStoreCategorySalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.filteredStoreCategorySalesLoading.set(false);
            }
        });
    }

    loadStoresData(): void {
        this.operationsService.getStoresData().subscribe({
            next: (response) => { this.storesArr.set(response); },
            error: (error) => { console.error(error) }
        });
    }

    loadStoresSalesData(startDate: string, endDate: string): void {
        this.storesSalesLoading.set(true);
        this.storesSalesError.set(null);
        this.businessKpiService.getStoresSalesData(startDate, endDate).subscribe({
            next: (response) => {
                this.storesSalesData.set(response);
                this.storesSalesLoading.set(false);
            },
            error: (error) => {
                this.storesSalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.storesSalesLoading.set(false);
            }
        });
    }

    loadStoreProductSalesData(pageNumber: number = 1, startDate?: string, endDate?: string, storeId?: string): void {
        this.paginatedSalesLoading.set(true);
        this.paginatedSalesError.set(null);
        this.businessKpiService.getStoreProductSalesData(pageNumber, 10, storeId, startDate, endDate).subscribe({
            next: (response) => {
                console.log(response);
                this.paginatedSalesData.set(response);
                this.paginatedSalesLoading.set(false);
            },
            error: (error) => {
                this.paginatedSalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.paginatedSalesLoading.set(false);
            }
        });
    }

    loadStoreCategorySalesData(pageNumber: number = 1, storeId?: string, startDate?: string, endDate?: string): void {
        this.paginatedSalesLoading.set(true);
        this.paginatedSalesError.set(null);
        this.businessKpiService.getStoreCategorySalesData(pageNumber, 10, storeId, startDate, endDate).subscribe({
            next: (response) => {
                this.paginatedSalesData.set(response);
                this.paginatedSalesLoading.set(false);
            },
            error: (error) => {
                this.paginatedSalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.paginatedSalesLoading.set(false);
            }
        });
    }

    loadProductSalesData(pageNumber: number = 1, startDate?: string, endDate?: string): void {
        this.paginatedSalesLoading.set(true);
        this.paginatedSalesError.set(null);
        this.businessKpiService.getProductSalesData(pageNumber, 10, startDate, endDate).subscribe({
            next: (response) => {
                this.paginatedSalesData.set(response);
                this.paginatedSalesLoading.set(false);
            },
            error: (error) => {
                this.paginatedSalesError.set(
                    'Unable to load data. Please try again.'
                );
                this.paginatedSalesLoading.set(false);
            }
        });
    }
}
