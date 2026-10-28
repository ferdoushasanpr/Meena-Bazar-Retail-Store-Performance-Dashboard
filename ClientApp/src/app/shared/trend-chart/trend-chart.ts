
import {
  Component,
  ElementRef,
  input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  effect
} from '@angular/core';

import { DailySalesData, MonthlySalesData } from '../../models/sales';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [],
  styleUrl: './trend-chart.css',
  templateUrl: './trend-chart.html',
})
export class TrendChart implements AfterViewInit, OnDestroy {
  @ViewChild('trendChartCanvas')
  trendChartCanvas!: ElementRef<HTMLCanvasElement>;

  dailyData = input.required<DailySalesData[]>();
  monthlyData = input.required<MonthlySalesData[]>();

  selectedViewMode: 'Daily' | 'Monthly' | 'Yearly' = 'Daily';

  private trendChart?: Chart;
  private viewInitialized = false;

  constructor() {
    effect(() => {
      this.dailyData();
      this.monthlyData();

      if (this.viewInitialized) {
        this.updateTrendChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initTrendChart();
  }

  ngOnDestroy(): void {
    this.trendChart?.destroy();
  }

  setViewMode(mode: 'Daily' | 'Monthly' | 'Yearly'): void {
    this.selectedViewMode = mode;
    this.updateTrendChart();
  }

  private initTrendChart(): void {
    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Daily Sales',
          data: [],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#8b5cf6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
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

    this.updateTrendChart();
  }

  private updateTrendChart(): void {
    if (!this.trendChart) return;

    let labels: string[] = [];
    let sales: number[] = [];

    if (this.selectedViewMode === 'Daily') {
      const data = this.dailyData();

      labels = data.map(item =>
        new Date(item.salesDate).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit'
        })
      );

      sales = data.map(item => item.totalSales);
    } else if (this.selectedViewMode === 'Monthly') {
      const data = this.monthlyData();

      labels = data.map(item =>
        new Date(item.month).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        })
      );

      sales = data.map(item => item.total_Sales);
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
}
