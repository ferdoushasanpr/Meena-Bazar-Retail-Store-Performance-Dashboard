import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { MetricCard } from '../../../shared/components/metric-card/metric-card';
import { HorizontalBarChart } from '../../../shared/components/horizontal-bar-chart/horizontal-bar-chart';
import { TableChart } from '../../../shared/components/table-chart/table-chart';
import { formatDate } from '../../../shared/utilities/date';
import { MetricCardProps } from '../../../core/models/props';
import { SalesService } from '../../services/sales-service';
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';
import { ReportExporter } from '../../services/report-exporter';
import { Loading } from '../../../shared/components/loading/loading';
import { ErrorDisplay } from '../../../shared/components/error-display/error-display';

@Component({
  imports: [FormsModule, PageHeader, Filter, Loading, ErrorDisplay, MetricCard, HorizontalBarChart, TableChart],
  selector: 'app-store-performance',
  styleUrl: './store-performance.css',
  templateUrl: './store-performance.html',
})

export class StorePerformance {
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Store Performance";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all retail locations.";

  // Filters & State
  currentFilters = signal<FilterCriteria>({
    startDate: '',
    endDate: '',
    storeId: 'All Stores'
  });

  // Loading States
  salesKpiLoading = this.salesService.salesKpiLoading;
  storeSalesLoading = this.salesService.storesSalesLoading;
  storeCategorySalesLoading = this.salesService.paginatedSalesLoading;

  // Error States
  salesKpiError = this.salesService.salesKpiError;
  storesSalesError = this.salesService.storesSalesError;
  paginatedSalesError = this.salesService.paginatedSalesError;


  // Sales Data
  salesKpiData = this.salesService.salesKpiData;
  storesSalesData = this.salesService.storesSalesData;
  storeCategorySalesData = this.salesService.paginatedSalesData;

  isLoading = computed(() => {
    return this.salesKpiLoading()
      || this.storeSalesLoading()
      || this.storeCategorySalesLoading();
  });

  hasError = computed(() => {
    return !!(
      this.salesKpiError() ||
      this.storesSalesError() ||
      this.paginatedSalesError()
    );
  });

  storePerformanceErrorMessage = computed(() => {
    return (
      this.salesKpiError() ||
      this.storesSalesError() ||
      this.paginatedSalesError()
    );
  });

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

  constructor() {
    effect(() => {
      const filters = this.currentFilters();

      if (filters.startDate && filters.endDate) {
        this.loadSalesData();
      }
    });
  }

  loadCurrentFilter({ startDate, endDate, storeId }: FilterCriteria): void {
    this.currentFilters.set({ startDate, endDate, storeId });
  }

  loadSalesData(): void {
    const currentFilter = this.currentFilters();

    const selectedStore = currentFilter.storeId === 'All Stores'
      ? undefined
      : currentFilter.storeId;

    this.salesService.loadFilteredSalesData(currentFilter.startDate, currentFilter.endDate, selectedStore);
    this.salesService.loadStoresSalesData(currentFilter.startDate, currentFilter.endDate);
    this.salesService.loadStoreCategorySalesData(1, selectedStore, currentFilter.startDate, currentFilter.endDate);
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


  // CSV Export Methods

  exportConsolidatedReport(): void {
    const kpis = this.salesKpiData();
    const storeSales = this.storesSalesData();
    const categorySales = this.storeCategorySalesData().data;
    const filters = this.currentFilters();

    this.reportExportService.export({
      reportTitle: 'STORE PERFORMANCE REPORT',
      fileName: `store_performance_${filters.storeId.toLowerCase().replace(/[^a-z0-9]/gi, '_')}`,

      filters: {
        'Selected Store Filter': filters.storeId,
        'Time Range': `${filters.startDate} to ${filters.endDate}`
      },

      summary: {
        title: 'EXECUTIVE SUMMARY',
        data: [
          ['Total Sales ($)', kpis.totalSales.toFixed(2)],
          ['Total Transactions', kpis.numberOfTransactions],
          ['Average Basket Value ($)', kpis.averageBasketValue.toFixed(2)],
          ['Average Daily Sales ($)', kpis.averageDailySales.toFixed(2)]
        ]
      },

      sections: [
        {
          title: 'STORE SALES BREAKDOWN',
          data: storeSales,
          emptyMessage: 'No store sales data available'
        },
        {
          title: 'STORE CATEGORY BREAKDOWN',
          data: categorySales,
          emptyMessage: 'No category sales data available'
        }
      ]
    });
  }
}
