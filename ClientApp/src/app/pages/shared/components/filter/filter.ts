import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { formatDate } from '../../../../shared/utilities/date';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales-service';
import { FilterCriteria } from './models/filter-model';

@Component({
  imports: [FormsModule],
  selector: 'app-filter',
  styleUrl: './filter.css',
  templateUrl: './filter.html',
})
export class Filter implements OnInit {
  private salesService = inject(SalesService);

  timeRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Select Range'];
  selectedTimeRange = 'All';
  selectedStore = signal<string>('All Stores');
  storesArr = this.salesService.storesArr;

  private readonly currentDate = new Date(2025, 11, 30);
  customStartDate = signal<string>(formatDate(this.currentDate));
  customEndDate = signal<string>(formatDate(this.currentDate));

  filterCriteria = output<FilterCriteria>();

  onFilter(startDate: string, endDate: string): void {
    this.filterCriteria.emit({
      startDate, endDate, storeId: this.selectedStore()
    })
  }

  ngOnInit(): void {
    this.setTimeRange('All');
    this.salesService.loadStoresData();
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;

    const endDate = new Date(this.currentDate);
    const startDate = new Date(this.currentDate);

    switch (range) {
      case 'All':
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;

      case 'Today':
        startDate.setDate(startDate.getDate() - 1);
        break;

      case 'Last 7 Days':
        startDate.setDate(startDate.getDate() - 6);
        break;

      case 'Last 30 Days':
        startDate.setDate(startDate.getDate() - 29);
        break;
      case 'Select Range':
        return;
    }

    this.onFilter(formatDate(startDate),
      formatDate(endDate));
  }

  onCustomDateChange(): void {
    if (this.selectedTimeRange === 'Select Range') {
      this.onFilter(this.customStartDate(), this.customEndDate());
    }
  }

  onStoreChange(storeId: string): void {
    this.selectedStore.set(storeId);

    const endDate = this.selectedTimeRange === 'Select Range'
      ? this.customEndDate()
      : formatDate(this.currentDate);

    let startDate: string;

    if (this.selectedTimeRange === 'Select Range') {
      startDate = this.customStartDate();
    } else {
      const start = new Date(this.currentDate);

      switch (this.selectedTimeRange) {
        case 'Today':
          start.setDate(start.getDate() - 1);
          break;
        case 'Last 7 Days':
          start.setDate(start.getDate() - 6);
          break;
        case 'Last 30 Days':
          start.setDate(start.getDate() - 29);
          break;
        default:
          start.setFullYear(start.getFullYear() - 2);
      }

      startDate = formatDate(start);
    }

    this.onFilter(startDate, endDate);
  }

  onResetFilter(): void {
    this.selectedStore.set('All Stores');
    this.setTimeRange('All');
  }
}
