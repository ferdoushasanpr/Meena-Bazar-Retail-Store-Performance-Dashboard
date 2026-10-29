import { Component, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { StoreSalesData } from '../../models/sales';
import { SalesService } from '../../services/sales-service';
import { HorizontalBarChart } from '../../shared/horizontal-bar-chart/horizontal-bar-chart';

@Component({
  imports: [PageHeader, HorizontalBarChart],
  selector: 'app-store-performance',
  styleUrl: './store-performance.css',
  templateUrl: './store-performance.html',
})
export class StorePerformance {
  private businessKpiService = inject(SalesService);
  //Page Header Component Info
  pageHeaderTitle = "Store Performance";
  pageHeaderSubtitle = "Benchmark, rank, and analyze revenue, customer volume, and efficiency across all retail locations.";

  // Filters & State
  selectedTimeRange = 'Last 30 Days';
  timeRanges = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Previous Month'];

  storesSalesData = signal<StoreSalesData[]>([]);

  ngOnInit(): void {
    this.loadStoresSalesData();
  }

  loadStoresSalesData(): void {
    this.businessKpiService.getStoresSalesData().subscribe({
      next: (response) => {
        this.storesSalesData.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
  }
}
