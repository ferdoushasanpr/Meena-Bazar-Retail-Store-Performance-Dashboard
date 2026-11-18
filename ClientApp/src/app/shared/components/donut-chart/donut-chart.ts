import {
  AfterViewInit,
  Component,
  ElementRef,
  effect,
  input,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { Chart } from 'chart.js';

import {
  SalesCategoryData,
  SalesData,
  StoreCategorySalesData
} from '../../../core/models/sales';

type CategoryChartData = {
  category: string;
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

  @ViewChild('categoryChartCanvas')
  categoryChartCanvas!: ElementRef<HTMLCanvasElement>;

  private categoryChart?: Chart;

  data = input.required<
    SalesCategoryData[] | StoreCategorySalesData[]
  >();

  salesData = input.required<SalesData>();

  categoryColors: string[] = [
    '#38bdf8',
    '#6366f1',
    '#14b8a6',
    '#a855f7',
    '#f97316',
    '#f43f5e',
    '#eab308'
  ];

  constructor() {
    effect(() => {
      const chartData = this.normalizedData;

      if (this.categoryChart) {
        this.updateCategoryChart(chartData);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initCategoryChart();
  }

  ngOnDestroy(): void {
    this.categoryChart?.destroy();
  }

  get normalizedData(): CategoryChartData[] {
    return this.data().map(item => {

      if ('total_Sales' in item) {
        return {
          category: item.category,
          totalSales: item.total_Sales,
          transactions: item.total_Transactions,
          unitsSold: 0
        };
      }

      return {
        category: item.category,
        totalSales: item.totalSales,
        transactions: item.numberOfTransactions,
        unitsSold: item.unitsSold
      };
    });
  }
  getCategoryPercentage(totalSales: number): number {

    const total = this.normalizedData.reduce(
      (sum, category) => sum + category.totalSales,
      0
    );

    return total > 0
      ? Number(((totalSales / total) * 100).toFixed(1))
      : 0;
  }

  /**
   * Update existing chart.
   */
  private updateCategoryChart(
    categoryData: CategoryChartData[]
  ): void {

    if (!this.categoryChart) return;

    this.categoryChart.data.labels = categoryData.map(
      item => item.category
    );

    this.categoryChart.data.datasets[0].data =
      categoryData.map(item => item.totalSales);

    this.categoryChart.data.datasets[0].backgroundColor =
      categoryData.map(
        (_, index) =>
          this.categoryColors[index % this.categoryColors.length]
      );

    this.categoryChart.update();
  }

  private initCategoryChart(): void {

    const ctx =
      this.categoryChartCanvas.nativeElement.getContext('2d');

    if (!ctx) return;

    const categoryData = this.normalizedData;

    this.categoryChart = new Chart(ctx, {

      type: 'doughnut',

      data: {
        labels: categoryData.map(item => item.category),

        datasets: [{
          data: categoryData.map(item => item.totalSales),

          backgroundColor: categoryData.map(
            (_, index) =>
              this.categoryColors[index % this.categoryColors.length]
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
              label: (ctx) => {

                const value = Number(ctx.raw);

                const total = ctx.dataset.data.reduce(
                  (sum, item) => sum + Number(item),
                  0
                );

                const percentage = total > 0
                  ? ((value / total) * 100).toFixed(1)
                  : '0.0';

                return ` ${ctx.label}: $${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}
