import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { BrandSalesData, DailySalesData, MonthlySalesData, SalesCategoryData, SalesData, YearlySalesData } from '../../models/sales';
import { MetricCardProps } from '../../models/props';
import { MetricCard } from '../../shared/metric-card/metric-card';
import { DonutChart } from '../../shared/donut-chart/donut-chart';
import { TrendChart } from '../../shared/trend-chart/trend-chart';
import { PageHeader } from '../../shared/page-header/page-header';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';
import { buildCsvContent, downloadCsv } from '../../utilities/csv-exporter';

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
    averageBasketValue: 0.0,
    averageDailySales: 0.0
  });

  salesCategoryData = signal<SalesCategoryData[]>([]);
  dailySalesData = signal<DailySalesData[]>([]);
  monthlySalesData = signal<MonthlySalesData[]>([]);
  yearlySalesData = signal<YearlySalesData[]>([]);
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

  avgDailySalesCard = computed((): MetricCardProps => {
    const sales = this.salesKpiData();

    return {
      title: 'AVG DAILY SALES',
      icon: 'fa-solid fa-chart-line',
      value: `$${sales.averageDailySales.toFixed(2)}`,
      visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
    }
  });

  ngOnInit(): void {
    this.loadSalesKpiData();
    this.loadSalesCategoryData();
    this.loadDailySalesData();
    this.loadMonthlySalesData();
    this.loadYearlySalesData();
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

  loadYearlySalesData(): void {
    this.businessKpiService.getYearlySalesData().subscribe({
      next: (response) => {
        this.yearlySalesData.set(response);
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



  // --- CSV Export Methods ---

  /**
   * Generates and downloads a consolidated CSV report for the Sales Overview Dashboard.
   */
  exportConsolidatedReport(): void {
    const kpis = this.salesKpiData();
    const categories = this.salesCategoryData();
    const brands = this.brandSalesData();
    const daily = this.dailySalesData();
    const monthly = this.monthlySalesData();
    const yearly = this.yearlySalesData();

    const rows: (string | number)[][] = [];

    // Metadata Header
    rows.push(['SALES OVERVIEW DASHBOARD REPORT']);
    rows.push(['Generated Date', new Date().toISOString().split('T')[0]]);
    rows.push([]);

    // Executive Summary KPIs
    rows.push(['--- EXECUTIVE SUMMARY ---']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Sales ($)', kpis.totalSales.toFixed(2)]);
    rows.push(['Total Transactions', kpis.numberOfTransactions]);
    rows.push(['Average Basket Value ($)', kpis.averageBasketValue.toFixed(2)]);
    rows.push(['Average Daily Sales ($)', kpis.averageDailySales.toFixed(2)]);
    rows.push([]);

    // Category Performance
    rows.push(['--- CATEGORY PERFORMANCE ---']);
    if (categories.length > 0) {
      const catHeaders = Object.keys(categories[0]);
      rows.push(catHeaders);
      categories.forEach((item: Record<string, any>) => {
        rows.push(catHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No category sales data available']);
    }
    rows.push([]);

    // Brand Performance
    rows.push(['--- BRAND PERFORMANCE ---']);
    if (brands.length > 0) {
      const brandHeaders = Object.keys(brands[0]);
      rows.push(brandHeaders);
      brands.forEach((item: Record<string, any>) => {
        rows.push(brandHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No brand sales data available']);
    }
    rows.push([]);

    // Daily Sales Breakdown
    rows.push(['--- DAILY SALES BREAKDOWN ---']);
    if (daily.length > 0) {
      const dailyHeaders = Object.keys(daily[0]);
      rows.push(dailyHeaders);
      daily.forEach((item: Record<string, any>) => {
        rows.push(dailyHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No daily sales data available']);
    }
    rows.push([]);

    // Monthly Sales Breakdown
    rows.push(['--- MONTHLY SALES BREAKDOWN ---']);
    if (monthly.length > 0) {
      const monthlyHeaders = Object.keys(monthly[0]);
      rows.push(monthlyHeaders);
      monthly.forEach((item: Record<string, any>) => {
        rows.push(monthlyHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No monthly sales data available']);
    }
    rows.push([]);

    // Yearly Sales Breakdown
    rows.push(['--- YEARLY SALES BREAKDOWN ---']);
    if (yearly.length > 0) {
      const yearlyHeaders = Object.keys(yearly[0]);
      rows.push(yearlyHeaders);
      yearly.forEach((item: Record<string, any>) => {
        rows.push(yearlyHeaders.map(key => item[key]));
      });
    } else {
      rows.push(['No yearly sales data available']);
    }

    const csvContent = buildCsvContent(rows);
    const fileName = `sales_overview_${new Date().toISOString().slice(0, 10)}.csv`;

    downloadCsv(csvContent, fileName);
  }
}
