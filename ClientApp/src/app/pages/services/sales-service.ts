import { inject, Injectable, signal } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics-service';
import { OperationsService } from '../../core/services/operations-service';
import { BrandSalesData, DailySalesData, DailyStoreSalesData, EntityCountData, MonthlySalesData, ProductSalesResponse, SalesCategoryData, SalesData, StoreCategorySalesData, StoreCategorySalesResponse, StoreSalesData, YearlySalesData } from '../../core/models/sales';
import { StoreData } from '../../core/models/store';

@Injectable({
    providedIn: 'root'
})

export class SalesService {
    private businessKpiService = inject(AnalyticsService);
    private operationsService = inject(OperationsService);

    entityCountData = signal<EntityCountData>({
        numberOfCustomer: 0,
        numberOfOrder: 0,
        numberOfProduct: 0,
        numberOfStore: 0,
    })

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

    paginatedSalesData = signal<StoreCategorySalesResponse | ProductSalesResponse>({
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

    loadSalesKpiData(): void {
        this.salesKpiLoading.set(true);
        this.businessKpiService.getSalesData().subscribe({
            next: (response) => {
                this.salesKpiData.set(response);
                this.salesKpiLoading.set(false);
            },
            error: (error) => { console.error(error) }
        });
    }

    loadSalesCategoryData(startDate?: string, endDate?: string): void {
        this.salesCategoryLoading.set(true);
        this.businessKpiService.getSalesCategoryData(startDate, endDate).subscribe({
            next: (response) => {
                this.salesCategoryData.set(response);
                this.salesCategoryLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadDailySalesData(): void {
        this.dailySalesLoading.set(true);
        this.businessKpiService.getDailySalesData().subscribe({
            next: (response) => {
                this.dailySalesData.set(response);
                this.dailySalesLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadMonthlySalesData(): void {
        this.monthlySalesLoading.set(true);
        this.businessKpiService.getMonthlySalesData().subscribe({
            next: (response) => {
                this.monthlySalesData.set(response);
                this.monthlySalesLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadYearlySalesData(): void {
        this.yearlySalesLoading.set(true);
        this.businessKpiService.getYearlySalesData().subscribe({
            next: (response) => {
                this.yearlySalesData.set(response);
                this.yearlySalesLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadBrandSalesData(): void {
        this.brandSalesLoading.set(true);
        this.businessKpiService.getBrandSalesData().subscribe({
            next: (response) => {
                this.brandSalesData.set(response);
                this.brandSalesLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadFilteredSalesData(startDate: string, endDate: string, storeId?: string): void {
        this.salesKpiLoading.set(true);
        this.businessKpiService.getFilteredSalesData(startDate, endDate, storeId).subscribe({
            next: (response) => {
                this.salesKpiData.set(response);
                this.salesKpiLoading.set(false);
            },
            error: (error) => { console.error(error); }
        });
    }

    loadDailyStoreSalesData(startDate: string, endDate: string, storeId: string): void {
        this.dailyStoreSaleLoading.set(true);
        this.businessKpiService.getDailyStoresSalesData(startDate, endDate, storeId).subscribe({
            next: (response) => {
                this.dailyStoreSalesData.set(response);
                this.dailyStoreSaleLoading.set(false);
            },
            error: (error) => { console.error(error) }
        });
    }

    loadFilteredStoreCategorySalesData(startDate: string, endDate: string, storeId?: string): void {
        this.filteredStoreCategorySalesLoading.set(true);
        this.businessKpiService.getFilteredStoreCategorySalesData(startDate, endDate, storeId).subscribe({
            next: (response) => {
                this.filteredStoreCategorySalesData.set(response);
                this.filteredStoreCategorySalesLoading.set(false);
            },
            error: (error) => { console.error(error); }
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
        this.businessKpiService.getStoresSalesData(startDate, endDate).subscribe({
            next: (response) => {
                this.storesSalesData.set(response);
                this.storesSalesLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadStoreCategorySalesData(pageNumber: number = 1, storeId?: string, startDate?: string, endDate?: string): void {
        this.paginatedSalesLoading.set(true);
        this.businessKpiService.getStoreCategorySalesData(pageNumber, 10, storeId, startDate, endDate).subscribe({
            next: (response) => {
                this.paginatedSalesData.set(response);
                this.paginatedSalesLoading.set(false);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadProductSalesData(pageNumber: number = 1, startDate: string, endDate: string): void {
        this.paginatedSalesLoading.set(true);
        this.businessKpiService.getProductSalesData(pageNumber, 10, startDate, endDate).subscribe({
            next: (response) => {
                this.paginatedSalesData.set(response);
                this.paginatedSalesLoading.set(false);
            },
            error: (error) => { console.error(error); }
        });
    }
}
