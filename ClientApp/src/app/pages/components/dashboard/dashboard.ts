import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../layout/page-header/page-header';
import { MetricCard } from '../../../shared/components/metric-card/metric-card';
import { TrendChart } from '../../../shared/components/trend-chart/trend-chart';
import { HorizontalBarChart } from '../../../shared/components/horizontal-bar-chart/horizontal-bar-chart';
import { DonutChart } from '../../../shared/components/donut-chart/donut-chart';
import { MetricCardProps } from '../../../core/models/props';
import { SalesService } from '../../services/sales-service';
import { ReportExporter } from '../../services/report-exporter';

@Component({
  imports: [FormsModule, PageHeader, MetricCard, TrendChart, HorizontalBarChart, DonutChart],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Sales Overview";
  pageHeaderSubtitle = "Monitor revenue, transactions, and retail performance across your stores.";

  // Sales Data
  salesKpiData = this.salesService.salesKpiData;
  salesCategoryData = this.salesService.salesCategoryData;
  dailySalesData = this.salesService.dailySalesData;
  monthlySalesData = this.salesService.monthlySalesData;
  yearlySalesData = this.salesService.yearlySalesData;
  brandSalesData = this.salesService.brandSalesData;


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
    this.salesService.loadSalesKpiData();
    this.salesService.loadSalesCategoryData();
    this.salesService.loadDailySalesData();
    this.salesService.loadMonthlySalesData();
    this.salesService.loadYearlySalesData();
    this.salesService.loadBrandSalesData();
  }



  // CSV Export Methods
  exportConsolidatedReport(): void {
    const kpis = this.salesKpiData();
    const categories = this.salesCategoryData();
    const brands = this.brandSalesData();
    const daily = this.dailySalesData();
    const monthly = this.monthlySalesData();
    const yearly = this.yearlySalesData();

    this.reportExportService.export({
      reportTitle: 'SALES OVERVIEW DASHBOARD REPORT',
      fileName: 'sales_overview',

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
          title: 'CATEGORY PERFORMANCE',
          data: categories,
          emptyMessage: 'No category sales data available'
        },
        {
          title: 'BRAND PERFORMANCE',
          data: brands,
          emptyMessage: 'No brand sales data available'
        },
        {
          title: 'DAILY SALES BREAKDOWN',
          data: daily,
          emptyMessage: 'No daily sales data available'
        },
        {
          title: 'MONTHLY SALES BREAKDOWN',
          data: monthly,
          emptyMessage: 'No monthly sales data available'
        },
        {
          title: 'YEARLY SALES BREAKDOWN',
          data: yearly,
          emptyMessage: 'No yearly sales data available'
        }
      ]
    });
  }
}
