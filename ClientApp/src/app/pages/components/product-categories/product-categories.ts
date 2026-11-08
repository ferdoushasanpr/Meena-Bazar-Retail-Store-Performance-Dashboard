import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { CategoryMatrixChart } from '../../../shared/components/category-matrix-chart/category-matrix-chart';
import { HorizontalBarChart } from '../../../shared/components/horizontal-bar-chart/horizontal-bar-chart';
import { formatDate } from '../../../shared/utilities/date';
import { buildCsvContent, downloadCsv } from '../../../shared/utilities/csv-exporter';
import { SalesService } from '../../services/sales-service';
import { Filter } from '../../shared/components/filter/filter';
import { FilterCriteria } from '../../shared/models/filter-model';

@Component({
  imports: [FormsModule, PageHeader, Filter, CategoryMatrixChart, HorizontalBarChart],
  selector: 'app-product-categories',
  styleUrl: './product-categories.css',
  templateUrl: './product-categories.html',
})
export class ProductCategories {
  private salesService = inject(SalesService);

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



  // --- CSV Export Methods ---

  /**
   * Generates and downloads a consolidated CSV report containing Active Filters,
   * Category Performance Breakdown, and Product Sales Performance Breakdown.
   */
  exportConsolidatedReport(): void {
    const categorySales = this.salesCategoryData();
    const productSales = this.productSalesData().data;
    const filters = this.currentFilters();

    const dateRangeLabel =
      `${filters.startDate} to ${filters.endDate}`;

    const rows: (string | number)[][] = [];

    // Metadata Header
    rows.push(['PRODUCT CATEGORIES REPORT']);
    rows.push(['Generated Date', new Date().toISOString().split('T')[0]]);
    rows.push(['Time Range', dateRangeLabel]);
    rows.push([]);

    // Category Sales Breakdown
    rows.push(['--- CATEGORY PERFORMANCE BREAKDOWN ---']);
    if (categorySales.length > 0) {
      const headers = Object.keys(categorySales[0]);
      rows.push(headers);
      categorySales.forEach((item: Record<string, any>) => {
        rows.push(headers.map(key => item[key]));
      });
    } else {
      rows.push(['No category sales data available']);
    }
    rows.push([]);

    // Product Sales Breakdown
    rows.push(['--- PRODUCT SALES BREAKDOWN ---']);
    if (productSales.length > 0) {
      const prodHeaders = Object.keys(productSales[0]);
      rows.push(prodHeaders);
      productSales.forEach((item: Record<string, any>) => {
        rows.push(prodHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No product sales data available']);
    }

    const csvContent = buildCsvContent(rows);
    const fileName = `product_categories_${formatDate(new Date())}.csv`;

    downloadCsv(csvContent, fileName);
  }
}
