import {
  Component,
  computed,
  ElementRef,
  input,
  output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface PaginatedResponse<T = any> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

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

  // Accepts either a PaginatedResponse payload or a standard array
  data = input.required<PaginatedResponse<any> | any[]>();

  // Property names to extract labels and sales values
  labelKey = input.required<string>();
  salesKey = input.required<string>();

  // Emits the new page number when pagination buttons are clicked
  pageChange = output<number>();

  chartInstance?: Chart;
  private viewInitialized = false;

  // Signal computations for paginated vs flat array input
  items = computed<any[]>(() => {
    const raw = this.data();
    if (Array.isArray(raw)) return raw;
    return raw?.data ?? [];
  });

  pageNumber = computed(() => {
    const raw = this.data();
    return Array.isArray(raw) ? 1 : (raw?.pageNumber ?? 1);
  });

  pageSize = computed(() => {
    const raw = this.data();
    return Array.isArray(raw) ? raw.length : (raw?.pageSize ?? 10);
  });

  totalRecords = computed(() => {
    const raw = this.data();
    return Array.isArray(raw) ? raw.length : (raw?.totalRecords ?? 0);
  });

  totalPages = computed(() => {
    const raw = this.data();
    return Array.isArray(raw) ? 1 : (raw?.totalPages ?? 1);
  });

  hasPreviousPage = computed(() => {
    const raw = this.data();
    return Array.isArray(raw) ? false : (raw?.hasPreviousPage ?? this.pageNumber() > 1);
  });

  hasNextPage = computed(() => {
    const raw = this.data();
    return Array.isArray(raw) ? false : (raw?.hasNextPage ?? this.pageNumber() < this.totalPages());
  });

  showingStart = computed(() => {
    if (this.totalRecords() === 0) return 0;
    return (this.pageNumber() - 1) * this.pageSize() + 1;
  });

  showingEnd = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalRecords());
  });

  totalCount = computed(() => this.items().length);

  get maxSales(): number {
    const sales = this.items().map(item => Number(item[this.salesKey()]) || 0);
    return sales.length ? Math.max(...sales) : 0;
  }

  get averageSales(): number {
    const itemsList = this.items();
    if (!itemsList.length) return 0;

    const total = itemsList.reduce(
      (sum, item) => sum + (Number(item[this.salesKey()]) || 0),
      0
    );

    return total / itemsList.length;
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

  getGlobalRank(localIndex: number): number {
    return (this.pageNumber() - 1) * this.pageSize() + localIndex + 1;
  }

  getBarWidthPercentage(sales: number): number {
    if (this.maxSales <= 0) return 0;
    return (sales / this.maxSales) * 100;
  }

  formatRank(rank: number): string {
    return String(rank).padStart(2, '0');
  }

  formatSales(value: any): string {
    const num = Number(value) || 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getBarColorClass(globalRankIndex: number): string {
    if (globalRankIndex === 0) return 'bar-purple';
    if (globalRankIndex < 3) return 'bar-cyan';
    return 'bar-slate';
  }

  onPrevPage(): void {
    if (this.hasPreviousPage()) {
      this.pageChange.emit(this.pageNumber() - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNextPage()) {
      this.pageChange.emit(this.pageNumber() + 1);
    }
  }

  private initChart(): void {
    const canvas = this.storesChartCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const items = this.items();
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
            backgroundColor: items.map((_, index) => this.getBarColorClass(this.getGlobalRank(index) - 1)),
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

    const items = this.items();
    const lKey = this.labelKey();
    const sKey = this.salesKey();
    const chart = this.chartInstance;

    chart.data.labels = items.map(item => item[lKey]);
    chart.data.datasets[0].data = items.map(item => item[sKey]);
    chart.data.datasets[0].backgroundColor = items.map((_, index) =>
      this.getBarColorClass(this.getGlobalRank(index) - 1)
    );

    chart.update();
  }
}