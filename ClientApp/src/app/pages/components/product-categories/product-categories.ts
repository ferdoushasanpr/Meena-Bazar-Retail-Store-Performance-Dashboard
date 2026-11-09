import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { CategoryMatrixChart } from '../../../shared/components/category-matrix-chart/category-matrix-chart';
import { HorizontalBarChart } from '../../../shared/components/horizontal-bar-chart/horizontal-bar-chart';
import { SalesService } from '../../services/sales-service';
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';
import { ReportExporter } from '../../services/report-exporter';

@Component({
  imports: [FormsModule, PageHeader, Filter, CategoryMatrixChart, HorizontalBarChart],
  selector: 'app-product-categories',
  styleUrl: './product-categories.css',
  templateUrl: './product-categories.html',
})
export class ProductCategories {
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Product Categories";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all product categories.";

  // Filters & State
  currentFilters = signal<FilterCriteria>({
    startDate: '',
    endDate: '',
    storeId: 'All Stores'
  });

  salesCategoryData = this.salesService.salesCategoryData;
  productSalesData = this.salesService.paginatedSalesData;


  loadSalesData({ startDate, endDate, storeId }: FilterCriteria): void {
    this.currentFilters.set({ startDate, endDate, storeId });

    this.salesService.loadSalesCategoryData(startDate, endDate);
    this.salesService.loadProductSalesData(1, startDate, endDate);
  }

  onPageChange(pageNumber: number): void {
    const filters = this.currentFilters();
    const endDate = filters.endDate;
    const startDate = filters.startDate;

    this.salesService.loadProductSalesData(pageNumber, startDate, endDate);
  }



  // CSV Export Methods

  exportConsolidatedReport(): void {
    const categorySales = this.salesCategoryData();
    const productSales = this.productSalesData().data;
    const filters = this.currentFilters();

    this.reportExportService.export({
      reportTitle: 'PRODUCT CATEGORIES REPORT',
      fileName: 'product_categories',

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
          title: 'PRODUCT SALES BREAKDOWN',
          data: productSales,
          emptyMessage: 'No product sales data available'
        }
      ]
    });
  }
}
