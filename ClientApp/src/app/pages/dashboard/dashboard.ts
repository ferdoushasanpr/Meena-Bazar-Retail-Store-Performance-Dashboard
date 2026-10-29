import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { BrandSalesData, DailySalesData, MonthlySalesData, SalesCategoryData, SalesData } from '../../models/sales';
import { MetricCardProps } from '../../models/matric-card';
import { MetricCard } from '../../shared/metric-card/metric-card';
import { DonutChart } from '../../shared/donut-chart/donut-chart';
import { TrendChart } from '../../shared/trend-chart/trend-chart';
import { PageHeader } from '../../shared/page-header/page-header';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';

@Component({
  imports: [FormsModule, PageHeader, MetricCard, TrendChart, HorizontalBarChart, DonutChart],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private businessKpiService = inject(SalesService);

  //Page Header Component Info
  pageHeaderTitle = "Sales Overview";
  pageHeaderSubtitle = "Monitor revenue, transactions, and retail performance across your stores.";

  // Sales Data
  salesKpiData = signal<SalesData>({
    totalSales: 0.0,
    numberOfTransactions: 0,
    averageBasketValue: 0.0
  });

  salesCategoryData = signal<SalesCategoryData[]>([]);
  dailySalesData = signal<DailySalesData[]>([]);
  monthlySalesData = signal<MonthlySalesData[]>([]);
  brandSalesData = signal<BrandSalesData[]>([]);



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

  avgDailySalesCard = {
    title: 'AVG DAILY SALES',
    icon: 'fa-solid fa-chart-line',
    value: '$8,286.00',
    visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
  };

  ngOnInit(): void {
    this.loadSalesKpiData();
    this.loadSalesCategoryData();
    this.loadDailySalesData();
    this.loadMonthlySalesData();
    this.loadBrandSalesData();
  }

  loadSalesKpiData(): void {
    this.businessKpiService.getSalesData().subscribe({
      next: (response) => { this.salesKpiData.set(response) },
      error: (error) => { console.error(error) }
    });
  }

  loadSalesCategoryData(): void {
    this.businessKpiService.getSalesCategoryData().subscribe({
      next: (response) => {
        this.salesCategoryData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadDailySalesData(): void {
    this.businessKpiService.getDailySalesData().subscribe({
      next: (response) => {
        this.dailySalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadMonthlySalesData(): void {
    this.businessKpiService.getMonthlySalesData().subscribe({
      next: (response) => {
        this.monthlySalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadBrandSalesData(): void {
    this.businessKpiService.getBrandSalesData().subscribe({
      next: (response) => {
        this.brandSalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
