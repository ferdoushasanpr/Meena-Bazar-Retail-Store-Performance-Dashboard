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

@Component({
  imports: [FormsModule, PageHeader, Filter, Loading, ErrorDisplay, VerticalBarChart, DonutChart, HorizontalBarChart, TableChart],
  selector: 'app-sales-breakdown',
  styleUrl: './sales-breakdown.css',
  templateUrl: './sales-breakdown.html',
})
export class SalesBreakdown {
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Sales Breakdown";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all product, categories and stores.";

  // Loading States
  salesCategoryLoading = this.salesService.salesCategoryLoading;
  storeSalesLoading = this.salesService.storesSalesLoading;
  productSalesLoading = this.salesService.productSalesLoading;
  storeCategorySalesLoading = this.salesService.storeCategorySalesLoading;

  // Error States
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
  salesCategoryData = this.salesService.salesCategoryData;
  storesSalesData = this.salesService.storesSalesData;
  productSalesData = this.salesService.productSalesData;
  storeCategorySalesData = this.salesService.storeCategorySalesData;

  isLoading = computed(() => {
    return this.salesCategoryLoading() || this.storeSalesLoading() || this.productSalesLoading() || this.storeCategorySalesLoading();;
  });

  hasError = computed(() => {
    return !!(
      this.salesCategoryError() ||
      this.storesSalesError() ||
      this.storeCategorySalesError() ||
      this.productSalesError()
    );
  });

  productCategoriesErrorMessage = computed(() => {
    return (
      this.salesCategoryError() ||
      this.storesSalesError() ||
      this.storeCategorySalesError() ||
      this.productSalesError()
    );
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

    this.salesService.loadSalesCategoryData(currentFilter.startDate, currentFilter.endDate);
    this.salesService.loadStoresSalesData(currentFilter.startDate, currentFilter.endDate);
    this.salesService.loadProductSalesData(1, currentFilter.startDate, currentFilter.endDate);
    this.salesService.loadStoreCategorySalesData(1, undefined, currentFilter.startDate, currentFilter.endDate);
  }

  onHorizontalBarChartPageChange(pageNumber: number): void {
    const filters = this.currentFilters();
    const endDate = filters.endDate;
    const startDate = filters.startDate;

    this.salesService.loadProductSalesData(pageNumber, startDate, endDate);
  }

  onTableChartPageChange(pageNumber: number): void {
    const filters = this.currentFilters();
    const endDate = filters.endDate;
    const startDate = filters.startDate;

    this.salesService.loadStoreCategorySalesData(pageNumber, undefined, startDate, endDate);
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
