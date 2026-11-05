import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreCategorySalesData } from '../../../core/models/sales';

@Component({
  imports: [FormsModule],
  selector: 'app-vertical-bar-chart',
  styleUrl: './vertical-bar-chart.css',
  templateUrl: './vertical-bar-chart.html',
})
export class VerticalBarChart {
  title = input<string>('Store Category Breakdown');
  subtitle = input<string>('Sales revenue by category');

  data = input<StoreCategorySalesData[]>([]);

  stores = input<string[]>([]);

  maxSales = computed(() => {
    const list = this.data();
    if (!list.length) return 100;
    const max = Math.max(...list.map((item) => item.totalSales));
    return max > 0 ? max * 1.15 : 100; // 15% padding top
  });

  yAxisTicks = computed(() => {
    const max = this.maxSales();
    return [max, max * 0.75, max * 0.5, max * 0.25, 0];
  });

  getBarHeightPercentage(value: number): number {
    const max = this.maxSales();
    if (!max) return 0;
    return Math.min(100, Math.max(0, (value / max) * 100));
  }
}
