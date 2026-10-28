import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export interface StorePerformance {
  id: string;
  rank: number;
  name: string;
  badge?: string;
  transactions: number;
  variance: number; // percentage change e.g. +18.2 or -2.1
  sales: number;    // gross sales amount
}

@Component({
  imports: [],
  selector: 'app-horizontal-bar-chart',
  styleUrl: './horizontal-bar-chart.css',
  templateUrl: './horizontal-bar-chart.html',
})
export class HorizontalBarChart {
  @ViewChild('storesChartCanvas') storesChartCanvas!: ElementRef<HTMLCanvasElement>;

  chartInstance?: Chart;

  // Metadata
  totalStoresCount: number = 18;

  // Dynamic Store Data
  stores: StorePerformance[] = [
    {
      id: 'st-01',
      rank: 1,
      name: 'Downtown Flagship',
      badge: 'TOP PERFORMER',
      transactions: 2410,
      variance: 18.2,
      sales: 78410
    },
    {
      id: 'st-02',
      rank: 2,
      name: 'City Center Galleria',
      transactions: 1890,
      variance: 11.4,
      sales: 56230
    },
    {
      id: 'st-03',
      rank: 3,
      name: 'Northside Mega Mall',
      transactions: 1620,
      variance: 7.9,
      sales: 44890
    },
    {
      id: 'st-04',
      rank: 4,
      name: 'Riverside Plaza',
      transactions: 1380,
      variance: -2.1,
      sales: 38150
    },
    {
      id: 'st-05',
      rank: 5,
      name: 'West End Farmers Market',
      transactions: 1126,
      variance: 4.5,
      sales: 30910
    }
  ];

  // Dynamic getters
  get maxSales(): number {
    return Math.max(...this.stores.map(s => s.sales));
  }

  get averageSales(): number {
    if (!this.stores.length) return 0;
    const total = this.stores.reduce((acc, s) => acc + s.sales, 0);
    return total / this.stores.length;
  }

  get formattedAvgSales(): string {
    return (this.averageSales / 1000).toFixed(1) + 'k';
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  // Calculate dynamic bar progress percentage relative to maximum sales volume
  getBarWidthPercentage(sales: number): number {
    return (sales / this.maxSales) * 100;
  }

  // Format rank numbers (e.g., 1 -> "01")
  formatRank(rank: number): string {
    return rank < 10 ? `0${rank}` : `${rank}`;
  }

  // Determine bar color theme dynamically based on rank and variance
  getBarColorClass(store: StorePerformance): string {
    if (store.rank === 1) return 'bar-purple';
    if (store.variance < 0 || store.rank >= 4) return 'bar-slate';
    return 'bar-cyan';
  }

  // Optional Chart.js horizontal bar chart initialization for canvas integration
  private initChart(): void {
    if (!this.storesChartCanvas) return;

    const ctx = this.storesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stores.map(s => s.name),
        datasets: [{
          label: 'Sales Volume ($)',
          data: this.stores.map(s => s.sales),
          backgroundColor: this.stores.map(s =>
            s.rank === 1 ? '#818cf8' : (s.variance < 0 || s.rank >= 4 ? '#475569' : '#38bdf8')
          ),
          borderRadius: 4,
          barThickness: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `$${context.raw?.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { display: false, grid: { display: false } },
          y: { display: false, grid: { display: false } }
        }
      }
    });
  }
}
