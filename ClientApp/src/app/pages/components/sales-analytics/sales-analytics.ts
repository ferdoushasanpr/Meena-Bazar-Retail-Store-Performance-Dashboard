import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { MetricCard } from '../../../shared/components/metric-card/metric-card';
import { TrendChart } from '../../../shared/components/trend-chart/trend-chart';
import { VerticalBarChart } from '../../../shared/components/vertical-bar-chart/vertical-bar-chart';
import { MetricCardProps } from '../../../core/models/props';
import { SalesService } from '../../services/sales-service';
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';
import { ReportExporter } from '../../services/report-exporter';
import { Loading } from '../../../shared/components/loading/loading';
import { ErrorDisplay } from '../../../shared/components/error-display/error-display';
import { DonutChart } from '../../../shared/components/donut-chart/donut-chart';

@Component({
  imports: [FormsModule, PageHeader, Filter, Loading, ErrorDisplay, MetricCard, TrendChart, DonutChart, VerticalBarChart],
  selector: 'app-sales-analytics',
  styleUrl: './sales-analytics.css',
  templateUrl: './sales-analytics.html',
})
export class SalesAnalytics {
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Sales Analytics";
  pageHeaderSubtitle = "In-depth multi-dimensional trend analysis, period-over-period comparisons, and volume metrics.";

  // Filter Criteria
  currentFilters = signal<FilterCriteria>({
    startDate: '',
    endDate: '',
    storeId: 'All Stores'
  });

  // Loading States
  salesKpiLoading = this.salesService.salesKpiLoading;
  dailyStoreSalesLoading = this.salesService.dailyStoreSaleLoading;
  filteredStoreCategorySalesLoading = this.salesService.filteredStoreCategorySalesLoading;

  // Error States
  salesKpiError = this.salesService.salesKpiError;
  dailyStoreSaleError = this.salesService.dailyStoreSaleError;
  filteredStoreCategorySalesError = this.salesService.filteredStoreCategorySalesError;

  // Sales Data
  salesKpiData = this.salesService.salesKpiData;
  dailyStoreSalesData = this.salesService.dailyStoreSalesData;
  filteredStoreCategorySalesData = this.salesService.filteredStoreCategorySalesData;

  isLoading = computed(() => {
    return this.salesKpiLoading() || this.dailyStoreSalesLoading() || this.filteredStoreCategorySalesLoading();
  });

  hasError = computed(() => {
    return !!(
      this.salesKpiError() ||
      this.dailyStoreSaleError() ||
      this.filteredStoreCategorySalesError()
    );
  });

  salesAnalyticsErrorMessage = computed(() => {
    return (
      this.salesKpiError() ||
      this.dailyStoreSaleError() ||
      this.filteredStoreCategorySalesError()
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
      ? 'ST001'
      : currentFilter.storeId;

    this.salesService.loadFilteredSalesData(currentFilter.startDate, currentFilter.endDate, selectedStore);
    this.salesService.loadDailyStoreSalesData(currentFilter.startDate, currentFilter.endDate, selectedStore);
    this.salesService.loadFilteredStoreCategorySalesData(currentFilter.startDate, currentFilter.endDate, selectedStore);
  }

  // CSV Export Methods
  exportConsolidatedReport(): void {
    const kpis = this.salesKpiData();
    const storeData = this.salesService.dailyStoreSalesData();
    const categoryData = this.salesService.filteredStoreCategorySalesData();
    const filters = this.currentFilters();

    this.reportExportService.export({
      reportTitle: 'SALES ANALYTICS REPORT',
      fileName: `sales_report_${filters.storeId.toLowerCase().replace(/[^a-z0-9]/gi, '_')}`,

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
          data: storeData,
          headers: [
            'salesDate',
            'store_name',
            'numberOfTransactions',
            'totalSales',
            'averageBasketValue'
          ],
          emptyMessage: 'No store sales data available'
        },
        {
          title: 'CATEGORY BREAKDOWN',
          data: categoryData,
          headers: [
            'store_id',
            'store_name',
            'category',
            'unitsSold',
            'numberOfTransactions',
            'totalSales'
          ],
          emptyMessage: 'No category sales data available'
        }
      ]
    });
  }
}
