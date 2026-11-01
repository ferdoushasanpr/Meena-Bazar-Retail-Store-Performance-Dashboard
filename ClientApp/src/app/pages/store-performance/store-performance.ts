import { Component, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { StoreCategorySalesResponse, StoreSalesData } from '../../models/sales';
import { SalesService } from '../../services/sales-service';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';

export interface PageChangeEvent {
  pageNumber: number;
  pageSize: number;
}
import { TableChart } from '../../shared/table-chart/table-chart';

@Component({
  imports: [PageHeader, HorizontalBarChart, TableChart],
  selector: 'app-store-performance',
  styleUrl: './store-performance.css',
  templateUrl: './store-performance.html',
})
export class StorePerformance {
  private businessKpiService = inject(SalesService);
  //Page Header Component Info
  pageHeaderTitle = "Store Performance";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all retail locations.";

  // Filters & State
  selectedTimeRange = 'Last 30 Days';
  timeRanges = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Previous Month'];

  storesSalesData = signal<StoreSalesData[]>([]);

  storeCategorySalesData = signal<StoreCategorySalesResponse>({
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  ngOnInit(): void {
    this.loadStoresSalesData();
    this.loadStoreCategorySalesData(1);
  }

  loadStoresSalesData(): void {
    this.businessKpiService.getStoresSalesData().subscribe({
      next: (response) => {
        this.storesSalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadStoreCategorySalesData(pageNumber: number = 1): void {
    this.businessKpiService.getStoreCategorySalesData(pageNumber).subscribe({
      next: (response) => {
        this.storeCategorySalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onPageChange(pageNumber: number): void {
    this.loadStoreCategorySalesData(pageNumber);
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
  }
}
