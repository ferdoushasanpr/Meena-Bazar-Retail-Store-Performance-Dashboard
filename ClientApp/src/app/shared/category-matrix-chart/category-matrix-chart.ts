import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  input,
  effect
} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../services/sales-service';
import { SalesCategoryData } from '../../models/sales';

Chart.register(...registerables);

@Component({
  selector: 'app-category-matrix-chart',
  imports: [],
  styleUrl: './category-matrix-chart.css',
  templateUrl: './category-matrix-chart.html',
})
export class CategoryMatrixChart
  implements AfterViewInit, OnDestroy {

  @ViewChild('matrixChartCanvas')
  matrixChartCanvas!: ElementRef<HTMLCanvasElement>;

  private businessKpiService = inject(SalesService);

  inputData = input<SalesCategoryData[]>([]);

  chartInstance?: Chart;

  readonly barColors: string[] = [
    '#a5b4fc',
    '#38bdf8',
    '#c084fc',
    '#818cf8',
    '#22d3ee'
  ];

  constructor() {
    effect(() => {
      const data = this.inputData();

      if (this.chartInstance) {
        this.updateChartData(data);
      }
    });
  }

  getMaxSales(): number {
    const data = this.inputData();

    return Math.max(
      ...data.map(item => Number(item.total_Sales) || 0),
      1
    );
  }

  getSalesPercentage(sales: number): number {
    const totalSales = this.inputData().reduce(
      (sum, item) => sum + (Number(item.total_Sales) || 0),
      0
    );

    if (totalSales === 0) return 0;

    return Number(((Number(sales) / totalSales) * 100).toFixed(1));
  }

  ngAfterViewInit(): void {
    this.initChartInstance();
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }

  getBarColor(index: number): string {
    return this.barColors[index % this.barColors.length];
  }

  private initChartInstance(): void {
    const canvas = this.matrixChartCanvas?.nativeElement;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.inputData();

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.category),
        datasets: [
          {
            label: 'Total Sales',
            data: data.map(item => item.total_Sales),
            backgroundColor: this.barColors,
            borderRadius: 6,
            barThickness: 12
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
              label: (context) =>
                ` Sales: ${Number(context.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            display: false,
            grid: { display: false }
          },
          y: {
            display: false,
            grid: { display: false }
          }
        }
      }
    });
  }

  private updateChartData(data: SalesCategoryData[]): void {
    const chart = this.chartInstance;

    if (!chart) return;

    chart.data.labels = data.map(
      item => item.category
    );

    chart.data.datasets[0].data = data.map(
      item => Number(item.total_Sales) || 0
    );

    chart.data.datasets[0].backgroundColor = data.map(
      (_, index) => this.getBarColor(index)
    );

    chart.update();
  }
}