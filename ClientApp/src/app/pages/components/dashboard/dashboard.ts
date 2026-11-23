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
import { Loading } from '../../../shared/components/loading/loading';
import { ErrorDisplay } from '../../../shared/components/error-display/error-display';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  imports: [FormsModule, PageHeader, Loading, ErrorDisplay, MetricCard, TrendChart, HorizontalBarChart, DonutChart],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private salesService = inject(SalesService);
  private reportExportService = inject(ReportExporter);

  //Page Header Component Info
  pageHeaderTitle = "Sales Overview";
  pageHeaderSubtitle = "Monitor revenue, transactions, and retail performance across your stores.";

  // User Data
  authData = this.authService.authData;

  // Loading States
  entityCountLoading = this.salesService.entityCountLoading;
  salesKpiLoading = this.salesService.salesKpiLoading;
  salesCategoryLoading = this.salesService.salesCategoryLoading;
  dailySalesLoading = this.salesService.dailySalesLoading;
  monthlySalesLoading = this.salesService.monthlySalesLoading;
  yearlySalesLoading = this.salesService.yearlySalesLoading;
  brandSalesLoading = this.salesService.brandSalesLoading;
  productSalesLoading = this.salesService.productSalesLoading;

  // Error States
  entityCountError = this.salesService.entityCountError;
  salesKpiError = this.salesService.salesKpiError;
  salesCategoryError = this.salesService.salesCategoryError;
  dailySalesError = this.salesService.dailySalesError;
  monthlySalesError = this.salesService.monthlySalesError;
  yearlySalesError = this.salesService.yearlySalesError;
  brandSalesError = this.salesService.brandSalesError;
  productSalesError = this.salesService.productSalesError;

  // Sales Data
  entityCountData = this.salesService.entityCountData;
  salesKpiData = this.salesService.salesKpiData;
  salesCategoryData = this.salesService.salesCategoryData;
  dailySalesData = this.salesService.dailySalesData;
  monthlySalesData = this.salesService.monthlySalesData;
  yearlySalesData = this.salesService.yearlySalesData;
  productSalesData = this.salesService.productSalesData;
  brandSalesData = this.salesService.brandSalesData;

  isLoading = computed(() => {
    return this.entityCountLoading() || this.salesKpiLoading() || this.salesCategoryLoading() || this.dailySalesLoading() || this.monthlySalesLoading() || this.yearlySalesLoading() || this.brandSalesLoading() || this.productSalesLoading();
  });

  hasError = computed(() => {
    return !!(
      this.entityCountError() ||
      this.salesKpiError() ||
      this.salesCategoryError() ||
      this.dailySalesError() ||
      this.monthlySalesError() ||
      this.yearlySalesError() ||
      this.brandSalesError() ||
      this.productSalesError()
    );
  });

  dashboardErrorMessage = computed(() => {
    return (
      this.entityCountError() ||
      this.salesKpiError() ||
      this.salesCategoryError() ||
      this.dailySalesError() ||
      this.monthlySalesError() ||
      this.yearlySalesError() ||
      this.brandSalesError() ||
      this.productSalesError()
    );
  });

  totalCustomerCard = computed((): MetricCardProps => {
    const data = this.entityCountData();

    return {
      title: 'TOTAL CUSTOMERS',
      icon: 'fa-solid fa-users-line',
      value: data.numberOfCustomer,
      visualIcon: 'fa-solid fa-chart-column comparison-icon bars-icon'
    };
  });

  totalProductCard = computed((): MetricCardProps => {
    const data = this.entityCountData();

    return {
      title: 'TOTAL PRODUCTS',
      icon: 'fa-solid fa-box-open',
      value: data.numberOfProduct,
      visualIcon: 'fa-solid fa-cubes comparison-icon sparkline-icon'
    };
  });

  totalStoreCard = computed((): MetricCardProps => {
    const data = this.entityCountData();

    return {
      title: 'TOTAL STORES',
      icon: 'fa-solid fa-store',
      value: data.numberOfStore,
      visualIcon: 'fa-solid fa-gauge-high comparison-icon gauge-icon'
    };
  });

  totalOrderCard = computed((): MetricCardProps => {
    const data = this.entityCountData();

    return {
      title: 'TOTAL ORDERS',
      icon: 'fa-solid fa-cart-shopping',
      value: data.numberOfOrder,
      visualIcon: 'fa-solid fa-chart-line comparison-icon sparkline-icon'
    }
  });

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
    this.onLoadComponent();
  }

  onLoadComponent(): void {
    const token = this.authData()?.token;

    if (token) {
      this.salesService.loadEntityCountData(token);
      this.salesService.loadSalesKpiData(token);
      this.salesService.loadSalesCategoryData(token);
      this.salesService.loadDailySalesData(token);
      this.salesService.loadMonthlySalesData(token);
      this.salesService.loadYearlySalesData(token);
      this.salesService.loadProductSalesData(token);
      this.salesService.loadBrandSalesData(token);
    }
  }

  onPageChange(pageNumber: number): void {
    const token = this.authData()?.token;
    if (token)
      this.salesService.loadProductSalesData(token, pageNumber);

  }

  // CSV Export Methods
  exportConsolidatedReport(): void {
    const entityCount = this.entityCountData();
    const kpis = this.salesKpiData();
    const categories = this.salesCategoryData();
    const brands = this.brandSalesData();
    const daily = this.dailySalesData();
    const monthly = this.monthlySalesData();
    const yearly = this.yearlySalesData();
    const products = this.productSalesData();

    this.reportExportService.export({
      reportTitle: 'SALES OVERVIEW DASHBOARD REPORT',
      fileName: 'sales_overview',

      summary: {
        title: 'EXECUTIVE SUMMARY',
        data: [
          ['Total Customers', entityCount.numberOfCustomer],
          ['Total Products', entityCount.numberOfProduct],
          ['Total Stores', entityCount.numberOfStore],
          ['Total Orders', entityCount.numberOfOrder],
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
        },
        {
          title: 'PRODUCT SALES BREAKDOWN',
          data: products.data,
          emptyMessage: 'No product sales data available'
        }
      ]
    });
  }
}
