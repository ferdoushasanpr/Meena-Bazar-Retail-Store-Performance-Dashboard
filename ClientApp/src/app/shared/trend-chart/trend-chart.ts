import {
  Component,
  ElementRef,
  input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  effect
} from '@angular/core';

import { DailySalesData, DailyStoreSalesData, MonthlySalesData } from '../../models/sales';
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

  dailyData = input<DailySalesData[]>([]);
  monthlyData = input<MonthlySalesData[]>([]);
  dailyStoreData = input<DailyStoreSalesData[]>([]);
  showControls = input<boolean>(true); // Controls visibility of buttons

  selectedViewMode: 'Daily' | 'Monthly' | 'Yearly' | 'StoreDaily' = 'Daily';

  private trendChart?: Chart;
  private viewInitialized = false;

  private storeColors = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'
  ];

  constructor() {
    effect(() => {
      const hasStoreData = this.dailyStoreData().length > 0;
      const controlsEnabled = this.showControls();

      // If controls are hidden and store data exists, lock view to StoreDaily
      if (!controlsEnabled && hasStoreData) {
        this.selectedViewMode = 'StoreDaily';
      }

      // Track dependencies
      this.dailyData();
      this.monthlyData();
      this.dailyStoreData();
      this.showControls();

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
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              font: {
                size: 14 // Increased store name font size in the legend
              },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: $${Number(item.raw).toFixed(2)}`
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
    let datasets: any[] = [];

    const formatDate = (dateStr: string) =>
      new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    if (this.selectedViewMode === 'Daily') {
      const data = this.dailyData();
      labels = data.map(item => formatDate(item.salesDate));
      datasets = [{
        label: 'Daily Sales',
        data: data.map(item => item.totalSales),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 3
      }];
    } else if (this.selectedViewMode === 'Monthly') {
      const data = this.monthlyData();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels = data.map(item => {
        const monthIndex = new Date(`${item.month} 1, 2000`).getMonth();
        return `${monthNames[monthIndex]} ${item.year}`;
      });
      datasets = [{
        label: 'Monthly Sales',
        data: data.map(item => item.total_Revenue),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 3
      }];
    } else if (this.selectedViewMode === 'StoreDaily') {
      const data = this.dailyStoreData();
      const uniqueDates = Array.from(new Set(data.map(item => item.salesDate))).sort();
      labels = uniqueDates.map(date => formatDate(date));

      const storeMap = new Map<string, DailyStoreSalesData[]>();
      data.forEach(item => {
        if (!storeMap.has(item.store_name)) {
          storeMap.set(item.store_name, []);
        }
        storeMap.get(item.store_name)!.push(item);
      });

      let colorIndex = 0;
      storeMap.forEach((storeRecords, storeName) => {
        const color = this.storeColors[colorIndex % this.storeColors.length];
        const salesData = uniqueDates.map(date => {
          const record = storeRecords.find(r => r.salesDate === date);
          return record ? record.totalSales : 0;
        });

        datasets.push({
          label: storeName,
          data: salesData,
          borderColor: color,
          backgroundColor: 'transparent',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 3
        });
        colorIndex++;
      });
    }

    this.trendChart.data.labels = labels;
    this.trendChart.data.datasets = datasets;

    if (this.trendChart.options.plugins?.legend) {
      this.trendChart.options.plugins.legend.display = (this.selectedViewMode === 'StoreDaily');
    }

    this.trendChart.update();
  }
}