import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { MetricCard } from '../../../shared/components/metric-card/metric-card';
import { HorizontalBarChart } from '../../../shared/components/horizontal-bar-chart/horizontal-bar-chart';
import { TableChart } from '../../../shared/components/table-chart/table-chart';
import { formatDate } from '../../../shared/utilities/date';
import { MetricCardProps } from '../../../core/models/props';
import { buildCsvContent, downloadCsv } from '../../../shared/utilities/csv-exporter';
import { SalesService } from '../../services/sales-service';

export interface PageChangeEvent {
  pageNumber: number;
  pageSize: number;
}

@Component({
  imports: [FormsModule, PageHeader, MetricCard, HorizontalBarChart, TableChart],
  selector: 'app-store-performance',
  styleUrl: './store-performance.css',
  templateUrl: './store-performance.html',
})

export class StorePerformance {
  private salesService = inject(SalesService);
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
  salesKpiData = this.salesService.salesKpiData;

  storesSalesData = this.salesService.storesSalesData;
  storesArr = this.salesService.storesArr;

  storeCategorySalesData = this.salesService.paginatedSalesData;

  totalSalesCard = computed((): MetricCardProps => {
    const sales = this.salesKpiData();

    return {
      title: 'TOTAL SALES',
      icon: 'fa-solid fa-wallet',
      value: `$${sales.totalSales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  transactionsCard = computed((): MetricCardProps => {
    const sales = this.salesKpiData();

    return {
      title: 'TRANSACTIONS',
      icon: 'fa-solid fa-receipt',
      value: sales.numberOfTransactions.toLocaleString(),
      visualIcon: 'fa-solid fa-chart-column comparison-icon bars-icon'
    };
  });

  averageBasketCard = computed((): MetricCardProps => {
    const sales = this.salesKpiData();

    return {
      title: 'AVG. BASKET VALUE',
      icon: 'fa-solid fa-bag-shopping',
      value: `$${sales.averageBasketValue.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  avgDailySalesCard = computed((): MetricCardProps => {
    const sales = this.salesKpiData();

    return {
      title: 'AVG DAILY SALES',
      icon: 'fa-solid fa-chart-line',
      value: `$${sales.averageDailySales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
    }
  });

  ngOnInit(): void {
    this.setTimeRange('All');
    this.salesService.loadStoresData();
  }

  private loadSalesData(startDate: string, endDate: string): void {
    const storeId = this.selectedStore() === 'All Stores'
      ? undefined
      : this.selectedStore();

    this.salesService.loadFilteredSalesData(startDate, endDate, storeId);
    this.salesService.loadStoresSalesData(startDate, endDate);
    this.salesService.loadStoreCategorySalesData(1, storeId, startDate, endDate);
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
      this.salesService.loadStoreCategorySalesData(pageNumber, undefined, formatDate(startDate), formatDate(endDate));
    } else {
      this.salesService.loadStoreCategorySalesData(pageNumber, storeId, formatDate(startDate), formatDate(endDate));
    }
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
    const kpis = this.salesKpiData();
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
