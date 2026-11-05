import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { DailyStoreSalesData, SalesData, StoreCategorySalesData } from '../../models/sales';
import { MetricCardProps } from '../../models/props';
import { MetricCard } from '../../shared/metric-card/metric-card';
import { PageHeader } from '../../shared/page-header/page-header';
import { TrendChart } from '../../shared/trend-chart/trend-chart';
import { VerticalBarChart } from '../../shared/vertical-bar-chart/vertical-bar-chart';
import { formatDate } from '../../utilities/date';
import { StoreData } from '../../models/store';
import { OperationsService } from '../../services/operations-service';
import { buildCsvContent, downloadCsv } from '../../utilities/csv-exporter';

@Component({
  imports: [FormsModule, PageHeader, MetricCard, TrendChart, VerticalBarChart],
  selector: 'app-sales-analytics',
  styleUrl: './sales-analytics.css',
  templateUrl: './sales-analytics.html',
})
export class SalesAnalytics implements OnInit {
  private businessKpiService = inject(SalesService);
  private operationsService = inject(OperationsService);

  //Page Header Component Info
  pageHeaderTitle = "Sales Analytics";
  pageHeaderSubtitle = "In-depth multi-dimensional trend analysis, period-over-period comparisons, and volume metrics.";

  // Filters & State
  selectedTimeRange = 'All';
  selectedStore = signal<string>('All Stores');
  timeRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Select Range'];
  private readonly currentDate = new Date(2025, 3, 1);

  customStartDate = signal<string>(formatDate(this.currentDate));
  customEndDate = signal<string>(formatDate(this.currentDate));

  // Sales Data
  filteredSalesData = signal<SalesData>({
    totalSales: 0.0,
    numberOfTransactions: 0,
    averageBasketValue: 0.0,
    averageDailySales: 0.0
  });

  dailyStoreSalesData = signal<DailyStoreSalesData[]>([]);
  filteredStoreCategorySalesData = signal<StoreCategorySalesData[]>([]);
  storesArr = signal<StoreData[]>([]);

  totalSalesCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'TOTAL SALES',
      icon: 'fa-solid fa-wallet',
      value: `$${sales.totalSales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  transactionsCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'TRANSACTIONS',
      icon: 'fa-solid fa-receipt',
      value: sales.numberOfTransactions.toLocaleString(),
      visualIcon: 'fa-solid fa-chart-column comparison-icon bars-icon'
    };
  });

  averageBasketCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'AVG. BASKET VALUE',
      icon: 'fa-solid fa-bag-shopping',
      value: `$${sales.averageBasketValue.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  avgDailySalesCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'AVG DAILY SALES',
      icon: 'fa-solid fa-chart-line',
      value: `$${sales.averageDailySales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
    }
  });

  ngOnInit(): void {
    this.setTimeRange('All');
    this.loadStoresData();
  }

  loadFilteredSalesData(startDate: string, endDate: string, storeId?: string): void {
    this.businessKpiService.getFilteredSalesData(startDate, endDate, storeId).subscribe({
      next: (response) => { this.filteredSalesData.set(response); },
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

  private loadSalesData(startDate: string, endDate: string): void {
    const storeId = this.selectedStore() === 'All Stores'
      ? undefined
      : this.selectedStore();

    this.loadFilteredSalesData(startDate, endDate, storeId);

    if (storeId == undefined) {
      this.loadDailyStoreSalesData(startDate, endDate, 'ST001');
      this.loadFilteredStoreCategorySalesData(startDate, endDate, 'ST001');
    } else {
      this.loadDailyStoreSalesData(startDate, endDate, storeId);
      this.loadFilteredStoreCategorySalesData(startDate, endDate, storeId);
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
   * Summary KPIs, Store Breakdown, and Category Breakdown.
   */
  exportConsolidatedReport(): void {
    const kpis = this.filteredSalesData();
    const storeData = this.dailyStoreSalesData();
    const categoryData = this.filteredStoreCategorySalesData();
    const currentStore = this.selectedStore();

    const dateRangeLabel = this.selectedTimeRange === 'Select Range'
      ? `${this.customStartDate()} to ${this.customEndDate()}`
      : this.selectedTimeRange;

    const rows: (string | number)[][] = [];

    // Metadata Section
    rows.push(['SALES ANALYTICS REPORT']);
    rows.push(['Generated Date', new Date().toISOString().split('T')[0]]);
    rows.push(['Selected Store Filter', currentStore]);
    rows.push(['Time Range', dateRangeLabel]);
    rows.push([]);

    // KPI Summary Section
    rows.push(['--- EXECUTIVE SUMMARY ---']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Sales ($)', kpis.totalSales.toFixed(2)]);
    rows.push(['Total Transactions', kpis.numberOfTransactions]);
    rows.push(['Average Basket Value ($)', kpis.averageBasketValue.toFixed(2)]);
    rows.push(['Average Daily Sales ($)', kpis.averageDailySales.toFixed(2)]);
    rows.push([]);

    // Store Performance Section
    rows.push(['--- STORE SALES BREAKDOWN ---']);
    rows.push(['Sales Date', 'Store Name', 'Total Transactions', 'Total Sales ($)', 'Average Basket Value ($)']);
    if (storeData.length > 0) {
      storeData.forEach(item => {
        rows.push([
          item.salesDate,
          item.store_name,
          item.numberOfTransactions,
          item.totalSales.toFixed(2),
          item.averageBasketValue.toFixed(2)
        ]);
      });
    } else {
      rows.push(['No store sales data available']);
    }
    rows.push([]);

    // Category Sales Section
    rows.push(['--- CATEGORY BREAKDOWN ---']);
    rows.push(['Store ID', 'Store Name', 'Category', 'Units Sold', 'Transactions', 'Total Sales ($)']);
    if (categoryData.length > 0) {
      categoryData.forEach(item => {
        rows.push([
          item.store_id,
          item.store_name,
          item.category,
          item.unitsSold,
          item.numberOfTransactions,
          item.totalSales.toFixed(2)
        ]);
      });
    } else {
      rows.push(['No category sales data available']);
    }

    const csvContent = buildCsvContent(rows);
    const sanitizeStoreName = currentStore.toLowerCase().replace(/[^a-z0-0]/gi, '_');
    const fileName = `sales_report_${sanitizeStoreName}_${formatDate(new Date())}.csv`;

    downloadCsv(csvContent, fileName);
  }
}
