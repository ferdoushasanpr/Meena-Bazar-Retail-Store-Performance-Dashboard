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
import { MetricCardProps } from '../../models/props';
import { MetricCard } from '../../shared/metric-card/metric-card';
import { formatDate } from '../../utilities/date';
import { FormsModule } from '@angular/forms';
import { OperationsService } from '../../services/operations-service';
import { StoreData } from '../../models/store';
import { buildCsvContent, downloadCsv } from '../../utilities/csv-exporter';

@Component({
  imports: [FormsModule, PageHeader, MetricCard, HorizontalBarChart, TableChart],
  selector: 'app-store-performance',
  styleUrl: './store-performance.css',
  templateUrl: './store-performance.html',
})
export class StorePerformance {
  private businessKpiService = inject(SalesService);
  private operationsService = inject(OperationsService);
  //Page Header Component Info
  pageHeaderTitle = "Store Performance";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all retail locations.";

  // Filters & State
  selectedTimeRange = 'All';
  selectedStore = signal<string>('All Stores');
  timeRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Select Range'];
  private readonly currentDate = new Date(2025, 3, 1);

  customStartDate = signal<string>(formatDate(this.currentDate));
  customEndDate = signal<string>(formatDate(this.currentDate));

  // Sales Data
  filteredSalesKpiData = signal<SalesData>({
    totalSales: 0.0,
    numberOfTransactions: 0,
    averageBasketValue: 0.0,
    averageDailySales: 0.0
  });

  storesSalesData = signal<StoreSalesData[]>([]);
  storesArr = signal<StoreData[]>([]);

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
    this.setTimeRange('All');
    this.loadStoresData();
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

  loadFilteredSalesData(startDate: string, endDate: string, storeId?: string): void {
    this.businessKpiService.getFilteredSalesData(startDate, endDate, storeId).subscribe({
      next: (response) => { this.filteredSalesKpiData.set(response); },
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
        this.storeCategorySalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadStoresData(): void {
    this.operationsService.getStoresData().subscribe({
      next: (response) => { this.storesArr.set(response); },
      error: (error) => { console.error(error) }
    });
  }

  onStoreChange(storeId: string): void {
    this.selectedStore.set(storeId);

    const endDate = this.selectedTimeRange === 'Select Range'
      ? this.customEndDate()
      : formatDate(this.currentDate);

    let startDate: string;

    if (this.selectedTimeRange === 'Select Range') {
      startDate = this.customStartDate();
    } else {
      const start = new Date(this.currentDate);

      switch (this.selectedTimeRange) {
        case 'Today':
          start.setDate(start.getDate() - 1);
          break;
        case 'Last 7 Days':
          start.setDate(start.getDate() - 6);
          break;
        case 'Last 30 Days':
          start.setDate(start.getDate() - 29);
          break;
        default:
          start.setFullYear(start.getFullYear() - 2);
      }

      startDate = formatDate(start);
    }

    this.loadSalesData(startDate, endDate);
  }

  onPageChange(pageNumber: number): void {
    const endDate = new Date(this.currentDate);
    const startDate = new Date(this.currentDate);

    const storeId = this.selectedStore() === 'All Stores'
      ? undefined
      : this.selectedStore();

    switch (this.selectedTimeRange) {
      case 'All':
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;

      case 'Today':
        startDate.setDate(startDate.getDate() - 1);
        break;

      case 'Last 7 Days':
        startDate.setDate(startDate.getDate() - 6);
        break;

      case 'Last 30 Days':
        startDate.setDate(startDate.getDate() - 29);
        break;
    }

    if (storeId === 'All Stores') {
      this.loadStoreCategorySalesData(pageNumber, undefined, formatDate(startDate), formatDate(endDate));
    } else {
      this.loadStoreCategorySalesData(pageNumber, storeId, formatDate(startDate), formatDate(endDate));
    }
  }

  private loadSalesData(startDate: string, endDate: string): void {
    const storeId = this.selectedStore() === 'All Stores'
      ? undefined
      : this.selectedStore();

    this.loadFilteredSalesData(startDate, endDate, storeId);
    this.loadStoresSalesData(startDate, endDate);
    this.loadStoreCategorySalesData(1, storeId, startDate, endDate);
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;

    const endDate = new Date(this.currentDate);
    const startDate = new Date(this.currentDate);

    switch (range) {
      case 'All':
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;

      case 'Today':
        startDate.setDate(startDate.getDate() - 1);
        break;

      case 'Last 7 Days':
        startDate.setDate(startDate.getDate() - 6);
        break;

      case 'Last 30 Days':
        startDate.setDate(startDate.getDate() - 29);
        break;
    }

    this.loadSalesData(
      formatDate(startDate),
      formatDate(endDate)
    );
  }

  onCustomDateChange(): void {
    if (this.selectedTimeRange === 'Select Range') {
      this.loadSalesData(this.customStartDate(), this.customEndDate());
    }
  }

  onResetFilter(): void {
    this.selectedStore.set('All Stores');
    this.setTimeRange('All');
  }


  // --- CSV Export Methods ---

  /**
   * Generates and downloads a consolidated CSV report containing Active Filters,
   * KPI Summary, Store Sales Performance Breakdown, and Store Category Data.
   */
  exportConsolidatedReport(): void {
    const kpis = this.filteredSalesKpiData();
    const storeSales = this.storesSalesData();
    const categorySales = this.storeCategorySalesData().data;
    const currentStore = this.selectedStore();

    const dateRangeLabel = this.selectedTimeRange === 'Select Range'
      ? `${this.customStartDate()} to ${this.customEndDate()}`
      : this.selectedTimeRange;

    const rows: (string | number)[][] = [];

    // Metadata Header
    rows.push(['STORE PERFORMANCE REPORT']);
    rows.push(['Generated Date', new Date().toISOString().split('T')[0]]);
    rows.push(['Selected Store Filter', currentStore]);
    rows.push(['Time Range', dateRangeLabel]);
    rows.push([]);

    // Executive Summary KPIs
    rows.push(['--- EXECUTIVE SUMMARY ---']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Sales ($)', kpis.totalSales.toFixed(2)]);
    rows.push(['Total Transactions', kpis.numberOfTransactions]);
    rows.push(['Average Basket Value ($)', kpis.averageBasketValue.toFixed(2)]);
    rows.push(['Average Daily Sales ($)', kpis.averageDailySales.toFixed(2)]);
    rows.push([]);

    // Store Sales Breakdown
    rows.push(['--- STORE SALES BREAKDOWN ---']);
    if (storeSales.length > 0) {
      const headers = Object.keys(storeSales[0]);
      rows.push(headers);
      storeSales.forEach((item: Record<string, any>) => {
        rows.push(headers.map(key => item[key]));
      });
    } else {
      rows.push(['No store sales data available']);
    }
    rows.push([]);

    // Store Category Breakdown
    rows.push(['--- STORE CATEGORY BREAKDOWN ---']);
    if (categorySales.length > 0) {
      const catHeaders = Object.keys(categorySales[0]);
      rows.push(catHeaders);
      categorySales.forEach((item: Record<string, any>) => {
        rows.push(catHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No category sales data available']);
    }

    const csvContent = buildCsvContent(rows);
    const sanitizeStoreName = currentStore.toLowerCase().replace(/[^a-z0-9]/gi, '_');
    const fileName = `store_performance_${sanitizeStoreName}_${formatDate(new Date())}.csv`;

    downloadCsv(csvContent, fileName);
  }
}
