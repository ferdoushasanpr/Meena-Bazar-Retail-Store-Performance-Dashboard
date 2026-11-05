import { inject, Injectable, signal } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics-service';
import { OperationsService } from '../../core/services/operations-service';
import { BrandSalesData, DailySalesData, DailyStoreSalesData, MonthlySalesData, ProductSalesResponse, SalesCategoryData, SalesData, StoreCategorySalesData, StoreCategorySalesResponse, StoreSalesData, YearlySalesData } from '../../core/models/sales';
import { StoreData } from '../../core/models/store';

@Injectable({
    providedIn: 'root'
})

export class SalesService {
    private businessKpiService = inject(AnalyticsService);
    private operationsService = inject(OperationsService);

    // Sales Data
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
        this.businessKpiService.getSalesData().subscribe({
            next: (response) => { this.salesKpiData.set(response) },
            error: (error) => { console.error(error) }
        });
    }

    loadSalesCategoryData(startDate?: string, endDate?: string): void {
        this.businessKpiService.getSalesCategoryData(startDate, endDate).subscribe({
            next: (response) => {
                this.salesCategoryData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadDailySalesData(): void {
        this.businessKpiService.getDailySalesData().subscribe({
            next: (response) => {
                this.dailySalesData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadMonthlySalesData(): void {
        this.businessKpiService.getMonthlySalesData().subscribe({
            next: (response) => {
                this.monthlySalesData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadYearlySalesData(): void {
        this.businessKpiService.getYearlySalesData().subscribe({
            next: (response) => {
                this.yearlySalesData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadBrandSalesData(): void {
        this.businessKpiService.getBrandSalesData().subscribe({
            next: (response) => {
                this.brandSalesData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadFilteredSalesData(startDate: string, endDate: string, storeId?: string): void {
        this.businessKpiService.getFilteredSalesData(startDate, endDate, storeId).subscribe({
            next: (response) => { this.salesKpiData.set(response); },
            error: (error) => { console.error(error); }
        });
    }

    loadDailyStoreSalesData(startDate: string, endDate: string, storeId: string): void {
        this.businessKpiService.getDailyStoresSalesData(startDate, endDate, storeId).subscribe({
            next: (response) => { this.dailyStoreSalesData.set(response); },
            error: (error) => { console.error(error) }
        });
    }

    loadFilteredStoreCategorySalesData(startDate: string, endDate: string, storeId?: string): void {
        this.businessKpiService.getFilteredStoreCategorySalesData(startDate, endDate, storeId).subscribe({
            next: (response) => { this.filteredStoreCategorySalesData.set(response); },
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
        this.businessKpiService.getStoresSalesData(startDate, endDate).subscribe({
            next: (response) => {
                this.storesSalesData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadStoreCategorySalesData(pageNumber: number = 1, storeId?: string, startDate?: string, endDate?: string): void {
        this.businessKpiService.getStoreCategorySalesData(pageNumber, 10, storeId, startDate, endDate).subscribe({
            next: (response) => {
                this.paginatedSalesData.set(response);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    loadProductSalesData(pageNumber: number = 1, startDate: string, endDate: string): void {
        this.businessKpiService.getProductSalesData(pageNumber, 10, startDate, endDate).subscribe({
            next: (response) => { this.paginatedSalesData.set(response); },
            error: (error) => { console.error(error); }
        });
    }
}
