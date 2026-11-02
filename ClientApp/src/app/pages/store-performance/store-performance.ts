import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { SalesData, StoreCategorySalesResponse, StoreSalesData } from '../../models/sales';
import { SalesService } from '../../services/sales-service';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';

export interface PageChangeEvent {
  pageNumber: number;
  pageSize: number;
}
import { TableChart } from '../../shared/table-chart/table-chart';
import { MetricCardProps } from '../../models/matric-card';
import { MetricCard } from '../../shared/metric-card/metric-card';

@Component({
  imports: [PageHeader, MetricCard, HorizontalBarChart, TableChart],
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

  // Sales Data
  filteredSalesKpiData = signal<SalesData>({
    totalSales: 0.0,
    numberOfTransactions: 0,
    averageBasketValue: 0.0,
    averageDailySales: 0.0
  });

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
    this.loadFilteredSalesKpiData();
    this.loadStoresSalesData();
    this.loadStoreCategorySalesData(1);
  }

  totalSalesCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesKpiData();

    return {
      title: 'TOTAL SALES',
      icon: 'fa-solid fa-wallet',
      value: `$${sales.totalSales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  transactionsCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesKpiData();

    return {
      title: 'TRANSACTIONS',
      icon: 'fa-solid fa-receipt',
      value: sales.numberOfTransactions.toLocaleString(),
      visualIcon: 'fa-solid fa-chart-column comparison-icon bars-icon'
    };
  });

  averageBasketCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesKpiData();

    return {
      title: 'AVG. BASKET VALUE',
      icon: 'fa-solid fa-bag-shopping',
      value: `$${sales.averageBasketValue.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  avgDailySalesCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesKpiData();

    return {
      title: 'AVG DAILY SALES',
      icon: 'fa-solid fa-chart-line',
      value: `$${sales.averageDailySales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
    }
  });

  loadFilteredSalesKpiData(): void {
    this.businessKpiService.getFilteredSalesData('2025-01-01', '2025-02-01').subscribe({
      next: (response) => { this.filteredSalesKpiData.set(response) },
      error: (error) => { console.error(error) }
    });
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
