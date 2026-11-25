import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { HorizontalBarChart } from '../../../shared/components/horizontal-bar-chart/horizontal-bar-chart';
import { SalesService } from '../../services/sales-service';
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';
import { ReportExporter } from '../../services/report-exporter';
import { Loading } from '../../../shared/components/loading/loading';
import { ErrorDisplay } from '../../../shared/components/error-display/error-display';
import { VerticalBarChart } from '../../../shared/components/vertical-bar-chart/vertical-bar-chart';
import { TableChart } from '../../../shared/components/table-chart/table-chart';
import { DonutChart } from '../../../shared/components/donut-chart/donut-chart';
import { AuthService } from '../../../auth/services/auth-service';
import { MetricCardProps } from '../../../core/models/props';
import { MetricCard } from '../../../shared/components/metric-card/metric-card';

@Component({
  imports: [FormsModule, PageHeader, Filter, Loading, ErrorDisplay, MetricCard, VerticalBarChart, DonutChart, HorizontalBarChart, TableChart],
  selector: 'app-sales-breakdown',
  styleUrl: './sales-breakdown.css',
  templateUrl: './sales-breakdown.html',
})
export class SalesBreakdown {
  private authService = inject(AuthService);
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Sales Breakdown";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all product, categories and stores.";

  // User Data
  authData = this.authService.authData;

  // Loading States
  entityCountLoading = this.salesService.entityCountLoading;
  salesCategoryLoading = this.salesService.salesCategoryLoading;
  storeSalesLoading = this.salesService.storesSalesLoading;
  productSalesLoading = this.salesService.productSalesLoading;
  storeCategorySalesLoading = this.salesService.storeCategorySalesLoading;

  // Error States
  entityCountError = this.salesService.entityCountError;
  salesCategoryError = this.salesService.salesCategoryError;
  storesSalesError = this.salesService.storesSalesError;
  productSalesError = this.salesService.productSalesError;
  storeCategorySalesError = this.salesService.storeCategorySalesError;

  // Filters & State
  currentFilters = signal<FilterCriteria>({
    startDate: '',
    endDate: '',
    storeId: 'All Stores'
  });

  // Data
  entityCountData = this.salesService.entityCountData;
  salesCategoryData = this.salesService.salesCategoryData;
  storesSalesData = this.salesService.storesSalesData;
  productSalesData = this.salesService.productSalesData;
  storeCategorySalesData = this.salesService.storeCategorySalesData;

  totalCategoryCard = computed((): MetricCardProps => {
    const data = this.entityCountData();

    return {
      title: 'TOTAL CATEGORIES',
      icon: 'fa-solid fa-shapes',
      value: data.numberOfCategory,
      visualIcon: 'fa-solid fa-chart-column comparison-icon'
    };
  });

  totalProductCard = computed((): MetricCardProps => {
    const data = this.entityCountData();

    return {
      title: 'TOTAL PRODUCTS',
      icon: 'fa-solid fa-box-open',
      value: data.numberOfProduct,
      visualIcon: 'fa-solid fa-tags comparison-icon'
    };
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
    const token = this.authData()?.token;
    const currentFilter = this.currentFilters();

    if (token) {
      this.salesService.loadEntityCountData(token);
      this.salesService.loadSalesCategoryData(token, currentFilter.startDate, currentFilter.endDate);
      this.salesService.loadStoresSalesData(token, currentFilter.startDate, currentFilter.endDate);
      this.salesService.loadProductSalesData(token, 1, currentFilter.startDate, currentFilter.endDate);
      this.salesService.loadStoreCategorySalesData(token, 1, undefined, currentFilter.startDate, currentFilter.endDate);
    }
  }

  onHorizontalBarChartPageChange(pageNumber: number): void {
    const token = this.authData()?.token;
    const filters = this.currentFilters();
    const endDate = filters.endDate;
    const startDate = filters.startDate;

    if (token)
      this.salesService.loadProductSalesData(token, pageNumber, startDate, endDate);
  }

  onTableChartPageChange(pageNumber: number): void {
    const token = this.authData()?.token;
    const filters = this.currentFilters();
    const endDate = filters.endDate;
    const startDate = filters.startDate;

    if (token)
      this.salesService.loadStoreCategorySalesData(token, pageNumber, undefined, startDate, endDate);
  }

  // CSV Export Methods
  exportConsolidatedReport(): void {
    const categorySales = this.salesCategoryData();
    const storeSales = this.storesSalesData();
    const productSales = this.productSalesData().data;
    const filters = this.currentFilters();

    this.reportExportService.export({
      reportTitle: 'SALES BREAKDOWN REPORT',
      fileName: 'sales_breakdown',

      filters: {
        'Time Range': `${filters.startDate} to ${filters.endDate}`
      },

      sections: [
        {
          title: 'CATEGORY PERFORMANCE BREAKDOWN',
          data: categorySales,
          emptyMessage: 'No category sales data available'
        },
        {
          title: 'STORE SALES BREAKDOWN',
          data: storeSales,
          emptyMessage: 'No store sales data available'
        },
        {
          title: 'PRODUCT SALES BREAKDOWN',
          data: productSales,
          emptyMessage: 'No product sales data available'
        }
      ]
    });
  }
}
