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
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';

@Component({
  imports: [FormsModule, PageHeader, Filter, MetricCard, HorizontalBarChart, TableChart],
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
  currentFilters = signal<FilterCriteria>({
    startDate: '',
    endDate: '',
    storeId: 'All Stores'
  });

  // Sales Data
  salesKpiData = this.salesService.salesKpiData;
  storesSalesData = this.salesService.storesSalesData;
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

  loadSalesData({ startDate, endDate, storeId }: FilterCriteria): void {
    this.currentFilters.set({ startDate, endDate, storeId });

    const selectedStore = storeId === 'All Stores'
      ? undefined
      : storeId;

    this.salesService.loadFilteredSalesData(startDate, endDate, selectedStore);
    this.salesService.loadStoresSalesData(startDate, endDate);
    this.salesService.loadStoreCategorySalesData(1, selectedStore, startDate, endDate);
  }

  onPageChange(pageNumber: number): void {
    const filters = this.currentFilters();
    const endDate = new Date(filters.endDate);
    const startDate = new Date(filters.startDate);

    const storeId = filters.storeId === 'All Stores'
      ? undefined
      : filters.storeId;

    if (storeId === 'All Stores') {
      this.salesService.loadStoreCategorySalesData(pageNumber, undefined, formatDate(startDate), formatDate(endDate));
    } else {
      this.salesService.loadStoreCategorySalesData(pageNumber, storeId, formatDate(startDate), formatDate(endDate));
    }
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
    const filters = this.currentFilters();
    const currentStore = this.currentFilters().storeId;

    const dateRangeLabel =
      `${filters.startDate} to ${filters.endDate}`;

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
