import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { ProductSalesResponse } from '../../models/sales';
import { CategoryMatrixChart } from '../../shared/category-matrix-chart/category-matrix-chart';
import { PageHeader } from '../../shared/page-header/page-header';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';

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
  selectedTimeRange = 'Last 30 Days';
  timeRanges = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Previous Month'];

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
    this.loadProductSalesData(1, '2020-01-01', '2026-01-01');
  }

  loadProductSalesData(pageNumber: number = 1, startDate: string, endDate: string): void {
    this.businessKpiService.getProductSalesData(pageNumber, 10, startDate, endDate).subscribe({
      next: (response) => { this.productSalesData.set(response); },
      error: (error) => { console.error(error); }
    });
  }

  onPageChange(pageNumber: number): void {
    this.loadProductSalesData(pageNumber, '2020-01-01', '2026-01-01');
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
  }
}
