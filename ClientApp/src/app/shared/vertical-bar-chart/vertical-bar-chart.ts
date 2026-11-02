import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreCategorySalesData } from '../../models/sales';

@Component({
  imports: [FormsModule],
  selector: 'app-vertical-bar-chart',
  styleUrl: './vertical-bar-chart.css',
  templateUrl: './vertical-bar-chart.html',
})
export class VerticalBarChart {
  title = input<string>('Store Category Breakdown');
  subtitle = input<string>('Sales revenue by category');

  // Data passed from parent
  data = input<StoreCategorySalesData[]>([]);

  // Custom store list if loaded separately; otherwise auto-derived from data
  stores = input<string[]>([]);

  // Emit selected store for backend API fetch
  storeChange = output<string>();

  // Selected Store state
  selectedStore = signal<string>('');

  // Unique stores dropdown options
  storeOptions = computed(() => {
    if (this.stores().length > 0) return this.stores();
    const unique = new Set(this.data().map((item) => item.store_name));
    return Array.from(unique);
  });

  // Filtered dataset for rendering
  chartData = computed(() => {
    const store = this.selectedStore();
    const raw = this.data();
    if (!store) return raw;
    return raw.filter((item) => item.store_name === store);
  });

  // Calculate maximum value for Y-axis scale
  maxSales = computed(() => {
    const list = this.chartData();
    if (!list.length) return 100;
    const max = Math.max(...list.map((item) => item.totalSales));
    return max > 0 ? max * 1.15 : 100; // 15% padding top
  });

  // Y-axis grid ticks (4 ticks)
  yAxisTicks = computed(() => {
    const max = this.maxSales();
    return [max, max * 0.75, max * 0.5, max * 0.25, 0];
  });

  onStoreSelect(store: string): void {
    this.selectedStore.set(store);
    this.storeChange.emit(store);
  }

  getBarHeightPercentage(value: number): number {
    const max = this.maxSales();
    if (!max) return 0;
    return Math.min(100, Math.max(0, (value / max) * 100));
  }
}
