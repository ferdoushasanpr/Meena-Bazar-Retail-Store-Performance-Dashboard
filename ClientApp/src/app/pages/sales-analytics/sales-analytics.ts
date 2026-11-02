import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { DailyStoreSalesData, SalesData, StoreCategorySalesData } from '../../models/sales';
import { MetricCardProps } from '../../models/matric-card';
import { MetricCard } from '../../shared/metric-card/metric-card';
import { PageHeader } from '../../shared/page-header/page-header';
import { TrendChart } from '../../shared/trend-chart/trend-chart';
import { VerticalBarChart } from '../../shared/vertical-bar-chart/vertical-bar-chart';
import { formatDate } from '../../utilities/date';

@Component({
  imports: [FormsModule, PageHeader, MetricCard, TrendChart, VerticalBarChart],
  selector: 'app-sales-analytics',
  styleUrl: './sales-analytics.css',
  templateUrl: './sales-analytics.html',
})
export class SalesAnalytics implements OnInit {
  private businessKpiService = inject(SalesService);

  //Page Header Component Info
  pageHeaderTitle = "Sales Analytics";
  pageHeaderSubtitle = "In-depth multi-dimensional trend analysis, period-over-period comparisons, and volume metrics.";

  // Filters & State
  selectedTimeRange = 'All';
  timeRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Select Range'];
  private readonly currentDate = new Date(2025, 3, 1);

  customStartDate = signal<string>(formatDate(this.currentDate));
  customEndDate = signal<string>(formatDate(this.currentDate));

  // Sales Data
  filteredSalesData = signal<SalesData>({
    totalSales: 0.0,
    numberOfTransactions: 0,
    averageBasketValue: 0.0,
    averageDailySales: 0.0
  });

  dailyStoreSalesData = signal<DailyStoreSalesData[]>([]);
  filteredStoreCategorySalesData = signal<StoreCategorySalesData[]>([]);

  totalSalesCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'TOTAL SALES',
      icon: 'fa-solid fa-wallet',
      value: `$${sales.totalSales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  transactionsCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'TRANSACTIONS',
      icon: 'fa-solid fa-receipt',
      value: sales.numberOfTransactions.toLocaleString(),
      visualIcon: 'fa-solid fa-chart-column comparison-icon bars-icon'
    };
  });

  averageBasketCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'AVG. BASKET VALUE',
      icon: 'fa-solid fa-bag-shopping',
      value: `$${sales.averageBasketValue.toFixed(2)}`,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    };
  });

  avgDailySalesCard = computed((): MetricCardProps => {
    const sales = this.filteredSalesData();

    return {
      title: 'AVG DAILY SALES',
      icon: 'fa-solid fa-chart-line',
      value: `$${sales.averageDailySales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
    }
  });

  ngOnInit(): void {
    this.setTimeRange('All');
  }

  loadFilteredSalesData(startDate: string, endDate: string): void {
    this.businessKpiService.getFilteredSalesData(startDate, endDate).subscribe({
      next: (response) => { this.filteredSalesData.set(response); },
      error: (error) => { console.error(error) }
    });
  }

  loadDailyStoreSalesData(startDate: string, endDate: string, storeId: string): void {
    this.businessKpiService.getDailyStoresSalesData(startDate, endDate, storeId).subscribe({
      next: (response) => { this.dailyStoreSalesData.set(response); },
      error: (error) => { console.error(error) }
    });
  }

  loadFilteredStoreCategorySalesData(startDate: string, endDate: string, storeId: string): void {
    this.businessKpiService.getFilteredStoreCategorySalesData(startDate, endDate, storeId).subscribe({
      next: (response) => { this.filteredStoreCategorySalesData.set(response); },
      error: (error) => { console.error(error) }
    });
  }

  onStoreChange(storeId: string): void {
    this.loadFilteredStoreCategorySalesData('2025-01-01', '2025-02-01', storeId);
  }

  private loadSalesData(startDate: string, endDate: string): void {
    this.loadFilteredSalesData(startDate, endDate);

    this.loadDailyStoreSalesData(
      startDate,
      endDate,
      'ST008'
    );

    this.loadFilteredStoreCategorySalesData(
      startDate,
      endDate,
      'ST004'
    );
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
}
