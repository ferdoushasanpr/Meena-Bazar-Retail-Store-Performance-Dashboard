import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../services/sales-service';
import { DailySalesData, MonthlySalesData, SalesCategoryData, SalesData } from '../../models/sales';
import { MetricCardProps } from '../../models/matric-card';
import { MetricCard } from '../../shared/metric-card/metric-card';
import { DonutChart } from '../../shared/donut-chart/donut-chart';

Chart.register(...registerables);

@Component({
  imports: [FormsModule, MetricCard, DonutChart],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild('trendChartCanvas') trendChartCanvas!: ElementRef<HTMLCanvasElement>;

  private businessKpiService = inject(SalesService);

  // Filters & State
  selectedTimeRange = 'Last 30 Days';
  timeRanges = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Previous Month'];
  compareChecked = true;
  selectedStoresCount = 5;
  totalStoresCount = 18;
  selectedViewMode: 'Daily' | 'Monthly' | 'Yearly' = 'Daily';

  // Sales Data
  salesKpiData = signal<SalesData>({
    totalSales: 0.0,
    numberOfTransactions: 0,
    averageBasketValue: 0.0
  });

  salesCategoryData = signal<SalesCategoryData[]>([]);
  dailySalesData = signal<DailySalesData[]>([]);
  monthlySalesData = signal<MonthlySalesData[]>([]);

  // Chart instances
  private trendChart!: Chart;


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
  }

  ngAfterViewInit(): void {
    this.initTrendChart();
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
        this.updateTrendChart();
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
        this.updateTrendChart();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // --- Line Chart Initialization ---
  setViewMode(mode: 'Daily' | 'Monthly' | 'Yearly'): void {
    this.selectedViewMode = mode;
    this.updateTrendChart();
  }

  private initTrendChart(): void {
    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const dailySales = this.dailySalesData();

    const labels = dailySales.map(item =>
      new Date(item.salesDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      })
    );

    const sales = dailySales.map(item => item.totalSales);

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Sales',
            data: sales,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#8b5cf6'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (item) => `Sales: $${Number(item.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sales Date'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Sales ($)'
            },
            ticks: {
              callback: (value) => `$${value}`
            }
          }
        }
      }
    });
  }

  private updateTrendChart(): void {
    if (!this.trendChart) return;

    let labels: string[] = [];
    let sales: number[] = [];

    if (this.selectedViewMode === 'Daily') {
      const dailyData = this.dailySalesData();

      labels = dailyData.map(item =>
        new Date(item.salesDate).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit'
        })
      );

      sales = dailyData.map(item => item.totalSales);
    } else if (this.selectedViewMode === 'Monthly') {
      const monthlyData = this.monthlySalesData();

      labels = monthlyData.map(item =>
        new Date(item.month).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        })
      );

      sales = monthlyData.map(item => item.total_Sales);
    } else {
      // Yearly data is not yet implemented.
      labels = [];
      sales = [];
    }

    this.trendChart.data.labels = labels;
    this.trendChart.data.datasets[0].data = sales;
    this.trendChart.data.datasets[0].label =
      this.selectedViewMode === 'Daily'
        ? 'Daily Sales'
        : this.selectedViewMode === 'Monthly'
          ? 'Monthly Sales'
          : 'Yearly Sales';

    this.trendChart.update();
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
  }
}
