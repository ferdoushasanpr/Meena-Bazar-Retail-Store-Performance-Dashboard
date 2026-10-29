import { Component } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  imports: [PageHeader],
  selector: 'app-store-performance',
  styleUrl: './store-performance.css',
  templateUrl: './store-performance.html',
})
export class StorePerformance {
  //Page Header Component Info
  pageHeaderTitle = "Store Performance";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all retail locations.";

  // Filters & State
  selectedTimeRange = 'Last 30 Days';
  timeRanges = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Previous Month'];

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
  }
}
