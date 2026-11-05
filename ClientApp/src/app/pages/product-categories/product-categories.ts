import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { ProductSalesResponse, SalesCategoryData } from '../../models/sales';
import { CategoryMatrixChart } from '../../shared/category-matrix-chart/category-matrix-chart';
import { PageHeader } from '../../shared/page-header/page-header';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';
import { formatDate } from '../../utilities/date';
import { buildCsvContent, downloadCsv } from '../../utilities/csv-exporter';

@Component({
  imports: [FormsModule, PageHeader, CategoryMatrixChart, HorizontalBarChart],
  selector: 'app-product-categories',
  styleUrl: './product-categories.css',
  templateUrl: './product-categories.html',
})
export class ProductCategories {
  private businessKpiService = inject(SalesService);

  //Page Header Component Info
  pageHeaderTitle = "Product Categories";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all product categories.";

  // Filters & State
  selectedTimeRange = 'All';
  timeRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Select Range'];
  private readonly currentDate = new Date(2025, 3, 1);

  customStartDate = signal<string>(formatDate(this.currentDate));
  customEndDate = signal<string>(formatDate(this.currentDate));

  salesCategoryData = signal<SalesCategoryData[]>([]);
  productSalesData = signal<ProductSalesResponse>({
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  ngOnInit(): void {
    this.setTimeRange('All');
  }

  loadSalesCategoryData(startDate: string, endDate: string): void {
    this.businessKpiService.getSalesCategoryData(startDate, endDate).subscribe({
      next: (response: SalesCategoryData[]) => {
        this.salesCategoryData.set(response);
      },
      error: (error) => {
        console.error('Failed to load sales category data:', error);
      }
    });
  }

  loadProductSalesData(pageNumber: number = 1, startDate: string, endDate: string): void {
    this.businessKpiService.getProductSalesData(pageNumber, 10, startDate, endDate).subscribe({
      next: (response) => { this.productSalesData.set(response); },
      error: (error) => { console.error(error); }
    });
  }

  onPageChange(pageNumber: number): void {
    const endDate = new Date(this.currentDate);
    const startDate = new Date(this.currentDate);

    switch (this.selectedTimeRange) {
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

    this.loadProductSalesData(pageNumber, formatDate(startDate), formatDate(endDate));
  }

  private loadSalesData(startDate: string, endDate: string): void {
    this.loadSalesCategoryData(startDate, endDate);
    this.loadProductSalesData(1, startDate, endDate);
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
    this.setTimeRange('All');
  }



  // --- CSV Export Methods ---

  /**
   * Generates and downloads a consolidated CSV report containing Active Filters,
   * Category Performance Breakdown, and Product Sales Performance Breakdown.
   */
  exportConsolidatedReport(): void {
    const categorySales = this.salesCategoryData();
    const productSales = this.productSalesData().data;

    const dateRangeLabel = this.selectedTimeRange === 'Select Range'
      ? `${this.customStartDate()} to ${this.customEndDate()}`
      : this.selectedTimeRange;

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
