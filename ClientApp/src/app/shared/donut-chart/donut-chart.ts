import { AfterViewInit, Component, ElementRef, input, OnChanges, ViewChild } from '@angular/core';
import { SalesCategoryData, SalesData } from '../../models/sales';
import { Chart } from 'chart.js';

@Component({
  imports: [],
  selector: 'app-donut-chart',
  styleUrl: './donut-chart.css',
  templateUrl: './donut-chart.html',
})
export class DonutChart implements AfterViewInit, OnChanges {
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;

  private categoryChart!: Chart;

  data = input.required<SalesCategoryData[]>();
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

  getCategoryPercentage(totalSales: number): number {
    const total = this.data().reduce(
      (sum, category) => sum + category.total_Sales,
      0
    );

    return total > 0
      ? Number(((totalSales / total) * 100).toFixed(1))
      : 0;
  }

  ngAfterViewInit(): void {
    this.initCategoryChart();
  }

  ngOnChanges(): void {
    this.updateCategoryChart();
  }

  private updateCategoryChart(): void {
    if (!this.categoryChart) return;

    const categoryData = this.data();

    this.categoryChart.data.labels = categoryData.map(c => c.category);

    this.categoryChart.data.datasets[0].data =
      categoryData.map(c => c.total_Sales);

    this.categoryChart.data.datasets[0].backgroundColor =
      categoryData.map(
        (_, index) =>
          this.categoryColors[index % this.categoryColors.length]
      );

    this.categoryChart.update();
  }

  // --- Donut Chart Initialization ---
  private initCategoryChart(): void {
    const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const categoryData = this.data();

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryData.map(c => c.category),
        datasets: [{
          data: categoryData.map(c => c.total_Sales),
          backgroundColor: this.categoryColors,
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
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = Number(ctx.raw);
                const total = categoryData.reduce(
                  (sum, category) => sum + category.total_Sales,
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
