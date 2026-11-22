import {
  AfterViewInit,
  Component,
  ElementRef,
  effect,
  input,
  ViewChild,
  OnDestroy,
  computed
} from '@angular/core';

import { Chart } from 'chart.js';

import {
  SalesCategoryData,
  StoreCategorySalesData,
  StoreSalesData
} from '../../../core/models/sales';

type ChartData = {
  label: string;
  totalSales: number;
  transactions: number;
  unitsSold: number;
};

@Component({
  imports: [],
  selector: 'app-donut-chart',
  styleUrl: './donut-chart.css',
  templateUrl: './donut-chart.html',
})
export class DonutChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  data = input.required<
    SalesCategoryData[] |
    StoreCategorySalesData[] |
    StoreSalesData[]
  >();

  chartColors: string[] = [
    '#38bdf8',
    '#6366f1',
    '#14b8a6',
    '#a855f7',
    '#f97316',
    '#f43f5e',
    '#eab308'
  ];

  totalSales = computed(() =>
    this.chartData().reduce(
      (sum, item) => sum + item.totalSales,
      0
    )
  );

  constructor() {
    effect(() => {
      const data = this.chartData();

      if (this.chart) {
        this.updateChart(data);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  chartData = computed<ChartData[]>(() => {
    return this.data().map(item => {
      if ('total_Transactions' in item) {
        return {
          label: 'category' in item
            ? item.category
            : item.store_name,
          totalSales: item.total_Sales,
          transactions: item.total_Transactions,
          unitsSold: 0
        };
      }

      return {
        label: item.category,
        totalSales: item.totalSales,
        transactions: item.numberOfTransactions,
        unitsSold: item.unitsSold
      };

    });

  });

  getPercentage(value: number): number {
    return this.totalSales() > 0
      ? Number(
        ((value / this.totalSales()) * 100).toFixed(1)
      )
      : 0;
  }

  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (!ctx) return;

    const data = this.chartData();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.label),
        datasets: [{
          data: data.map(item => item.totalSales),
          backgroundColor: data.map(
            (_, index) =>
              this.chartColors[index % this.chartColors.length]
          ),
          borderWidth: 4,
          borderColor: '#111827',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = Number(context.raw);
                const total = context.dataset.data.reduce(
                  (sum, item) => sum + Number(item),
                  0
                );

                const percentage = total > 0
                  ? ((value / total) * 100).toFixed(1)
                  : '0.0';

                return ` ${context.label}: $${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private updateChart(data: ChartData[]): void {
    if (!this.chart) return;

    this.chart.data.labels = data.map(item => item.label);

    this.chart.data.datasets[0].data =
      data.map(item => item.totalSales);

    this.chart.data.datasets[0].backgroundColor =
      data.map(
        (_, index) =>
          this.chartColors[index % this.chartColors.length]
      );

    this.chart.update();
  }
}
