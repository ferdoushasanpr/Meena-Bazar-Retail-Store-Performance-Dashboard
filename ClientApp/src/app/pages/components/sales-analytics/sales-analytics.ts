import { Component, computed, inject, signal } from '@angular/core';
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

@Component({
  imports: [FormsModule, PageHeader, Filter, MetricCard, TrendChart, VerticalBarChart],
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
