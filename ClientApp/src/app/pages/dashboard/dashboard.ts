import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface CategorySales {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild('trendChartCanvas') trendChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Filters & State
  selectedTimeRange = 'Last 30 Days';
  timeRanges = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Previous Month', 'All Time'];
  compareChecked = true;
  selectedStoresCount = 5;
  totalStoresCount = 18;
  selectedViewMode: 'Daily' | 'Weekly' | 'Monthly' = 'Daily';

  // Categories Data
  categories: CategorySales[] = [
    { name: 'Electronics', amount: 84520, percentage: 34, color: '#38bdf8' },
    { name: 'Grocery & Fresh', amount: 64633, percentage: 26, color: '#6366f1' },
    { name: 'Apparel & Footwear', amount: 44746, percentage: 18, color: '#14b8a6' },
    { name: 'Home & Living', amount: 29830, percentage: 12, color: '#a855f7' },
    { name: 'Beauty & Health', amount: 17401, percentage: 7, color: '#f97316' }
  ];

  // Chart instances
  private trendChart!: Chart;
  private categoryChart!: Chart;

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initTrendChart();
    this.initCategoryChart();
  }

  // --- Line Chart Initialization ---
  private initTrendChart(): void {
    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Gradient background for current period line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.45)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');

    const labels = ['Oct 01', 'Oct 06', 'Oct 12', 'Oct 18', 'Oct 24', 'Oct 27', 'Oct 30'];

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Current Period ($248.6k)',
            data: [4200, 6800, 4800, 8900, 6500, 11480, 10200],
            borderColor: '#8b5cf6',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.45,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#ffffff',
            pointRadius: (ctx) => (ctx.dataIndex === 5 ? 6 : 0),
            pointHoverRadius: 8
          },
          {
            label: 'Previous Period ($220.4k)',
            data: [3800, 5200, 6100, 5900, 7800, 6900, 8100],
            borderColor: '#64748b',
            borderWidth: 2,
            borderDash: [4, 4],
            fill: false,
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Target Benchmark ($265.0k)',
            data: [8500, 8500, 8500, 8500, 8500, 8500, 8500],
            borderColor: '#475569',
            borderWidth: 1.5,
            borderDash: [6, 6],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#cbd5e1',
            padding: 12,
            displayColors: false,
            callbacks: {
              title: (items) => `${items[0].label}, 2024  +18.4% YoY`,
              label: (item) => [
                `Gross Sales:   $${item.formattedValue}`,
                `Transactions:  388 orders`,
                `Basket AOV:     $29.58`
              ]
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { size: 12 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 12 },
              callback: (value) => '$' + (Number(value) / 1000) + 'k'
            },
            min: 0,
            max: 16000
          }
        }
      }
    });
  }

  // --- Donut Chart Initialization ---
  private initCategoryChart(): void {
    const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.categories.map(c => c.name),
        datasets: [{
          data: this.categories.map(c => c.percentage),
          backgroundColor: this.categories.map(c => c.color),
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
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
  }
}
