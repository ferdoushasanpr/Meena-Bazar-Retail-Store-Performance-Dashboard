import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar {
  selectedDateRange: string = 'Last 30 Days';
  selectedStore: string = 'All Stores (18)';
  lastUpdatedTime: string = '10:42 AM';

  onExportCSV(): void {
    console.log('Exporting CSV...');
  }

  onExportSummary(): void {
    console.log('Exporting Summary...');
  }

  onRefresh(): void {
    console.log('Refreshing data...');
  }
}
