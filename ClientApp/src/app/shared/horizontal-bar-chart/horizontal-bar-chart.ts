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
import { StoreSalesData } from '../../models/sales';

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

  storesData = input.required<StoreSalesData[]>();

  chartInstance?: Chart;
  private viewInitialized = false;

  totalStoresCount = computed(() => this.storesData().length);

  get maxSales(): number {
    const sales = this.storesData().map(
      store => store.total_Sales
    );

    return sales.length ? Math.max(...sales) : 0;
  }

  get averageSales(): number {
    const stores = this.storesData();

    if (!stores.length) return 0;

    const total = stores.reduce(
      (sum, store) => sum + store.total_Sales,
      0
    );

    return total / stores.length;
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
    if (changes['storesData'] && this.viewInitialized) {
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

    const stores = this.storesData();

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stores.map(store => store.store_name),
        datasets: [
          {
            label: 'Sales Volume ($)',
            data: stores.map(store => store.total_Sales),
            backgroundColor: stores.map((_, index) =>
              this.getBarColorClass(index)
            ),
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
          legend: {
            display: false
          },
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
          x: {
            display: false,
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private updateChart(): void {
    if (!this.chartInstance) {
      this.initChart();
      return;
    }

    const stores = this.storesData();
    const chart = this.chartInstance;

    chart.data.labels = stores.map(store => store.store_name);

    chart.data.datasets[0].data = stores.map(
      store => store.total_Sales
    );

    chart.data.datasets[0].backgroundColor = stores.map(
      (_, index) => this.getBarColorClass(index)
    );

    chart.update();
  }
}
