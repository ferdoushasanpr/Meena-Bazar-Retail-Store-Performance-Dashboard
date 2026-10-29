import {
  Component,
  computed,
  ElementRef,
  input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-horizontal-bar-chart',
  imports: [],
  styleUrl: './horizontal-bar-chart.css',
  templateUrl: './horizontal-bar-chart.html',
})
export class HorizontalBarChart
  implements AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('storesChartCanvas')
  storesChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Generic data input (accepts any array)
  data = input.required<any[]>();

  // Property names to extract labels and sales values
  labelKey = input.required<string>();
  salesKey = input.required<string>();

  chartInstance?: Chart;
  private viewInitialized = false;

  totalCount = computed(() => this.data().length);

  get maxSales(): number {
    const sales = this.data().map(item => Number(item[this.salesKey()]) || 0);
    return sales.length ? Math.max(...sales) : 0;
  }

  get averageSales(): number {
    const items = this.data();
    if (!items.length) return 0;

    const total = items.reduce(
      (sum, item) => sum + (Number(item[this.salesKey()]) || 0),
      0
    );

    return total / items.length;
  }

  get formattedAvgSales(): string {
    return this.averageSales.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['labelKey'] || changes['salesKey']) && this.viewInitialized) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }

  getBarWidthPercentage(sales: number): number {
    if (this.maxSales <= 0) return 0;
    return (sales / this.maxSales) * 100;
  }

  formatRank(rank: number): string {
    return String(rank).padStart(2, '0');
  }

  getBarColorClass(index: number): string {
    if (index === 0) return 'bar-purple';
    if (index < 3) return 'bar-cyan';
    return 'bar-slate';
  }

  private initChart(): void {
    const canvas = this.storesChartCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const items = this.data();
    const lKey = this.labelKey();
    const sKey = this.salesKey();

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: items.map(item => item[lKey]),
        datasets: [
          {
            label: 'Sales Volume ($)',
            data: items.map(item => item[sKey]),
            backgroundColor: items.map((_, index) => this.getBarColorClass(index)),
            borderRadius: 4,
            barThickness: 12
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context =>
                `$${Number(context.raw).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
            }
          }
        },
        scales: {
          x: { display: false, beginAtZero: true, grid: { display: false } },
          y: { display: false, grid: { display: false } }
        }
      }
    });
  }

  private updateChart(): void {
    if (!this.chartInstance) {
      this.initChart();
      return;
    }

    const items = this.data();
    const lKey = this.labelKey();
    const sKey = this.salesKey();
    const chart = this.chartInstance;

    chart.data.labels = items.map(item => item[lKey]);
    chart.data.datasets[0].data = items.map(item => item[sKey]);
    chart.data.datasets[0].backgroundColor = items.map((_, index) => this.getBarColorClass(index));

    chart.update();
  }
}