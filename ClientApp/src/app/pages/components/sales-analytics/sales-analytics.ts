import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { MetricCard } from '../../../shared/components/metric-card/metric-card';
import { TrendChart } from '../../../shared/components/trend-chart/trend-chart';
import { VerticalBarChart } from '../../../shared/components/vertical-bar-chart/vertical-bar-chart';
import { formatDate } from '../../../shared/utilities/date';
import { MetricCardProps } from '../../../core/models/props';
import { buildCsvContent, downloadCsv } from '../../../shared/utilities/csv-exporter';
import { SalesService } from '../../services/sales-service';
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';

@Component({
  imports: [FormsModule, PageHeader, Filter, MetricCard, TrendChart, VerticalBarChart],
  selector: 'app-sales-analytics',
  styleUrl: './sales-analytics.css',
  templateUrl: './sales-analytics.html',
})
export class SalesAnalytics {
  private salesService = inject(SalesService);

  //Page Header Component Info
  pageHeaderTitle = "Sales Analytics";
  pageHeaderSubtitle = "In-depth multi-dimensional trend analysis, period-over-period comparisons, and volume metrics.";

  // Filter Criteria
  currentFilters = signal<FilterCriteria>({
    startDate: '',
    endDate: '',
    storeId: 'All Stores'
  });

  // Sales Data
  salesKpiData = this.salesService.salesKpiData;
  dailyStoreSalesData = this.salesService.dailyStoreSalesData;
  filteredStoreCategorySalesData = this.salesService.filteredStoreCategorySalesData;

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

  loadSalesData({ startDate, endDate, storeId }: FilterCriteria): void {
    this.currentFilters.set({ startDate, endDate, storeId });

    const selectedStore = storeId === 'All Stores'
      ? undefined
      : storeId;

    this.salesService.loadFilteredSalesData(startDate, endDate, selectedStore);

    if (selectedStore == undefined) {
      this.salesService.loadDailyStoreSalesData(startDate, endDate, 'ST001');
      this.salesService.loadFilteredStoreCategorySalesData(startDate, endDate, 'ST001');
    } else {
      this.salesService.loadDailyStoreSalesData(startDate, endDate, selectedStore);
      this.salesService.loadFilteredStoreCategorySalesData(startDate, endDate, selectedStore);
    }
  }

  // --- CSV Export Methods ---

  /**
   * Generates and downloads a consolidated CSV report containing Active Filters,
   * Summary KPIs, Store Breakdown, and Category Breakdown.
   */
  exportConsolidatedReport(): void {
    const kpis = this.salesKpiData();
    const storeData = this.salesService.dailyStoreSalesData();
    const categoryData = this.salesService.filteredStoreCategorySalesData();
    const filters = this.currentFilters();
    const currentStore = this.currentFilters().storeId;

    const dateRangeLabel =
      `${filters.startDate} to ${filters.endDate}`;

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
