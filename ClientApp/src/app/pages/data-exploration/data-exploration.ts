import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CustomerDataResponse } from '../../models/customer';
import { OperationsService } from '../../services/operations-service';
import { DynamicTable } from '../../shared/dynamic-table/dynamic-table';

@Component({
  imports: [PageHeader, DynamicTable],
  selector: 'app-data-exploration',
  styleUrl: './data-exploration.css',
  templateUrl: './data-exploration.html',
})
export class DataExploration implements OnInit {
  private router = inject(Router);
  private operationsService = inject(OperationsService);

  // Header Info
  pageHeaderTitle = signal<string>('');
  pageHeaderSubtitle = signal<string>('');

  // Contents
  componentData = signal<CustomerDataResponse>({
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  constructor() {
    this.updatePath();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePath());
  }

  ngOnInit(): void {
    this.loadCustomerData(1);
  }

  updatePath() {
    const lastSegment = this.router.url
      .split('/')
      .pop() ?? '';

    this.pageHeaderTitle.set(lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : '');
    this.pageHeaderSubtitle.set(`In-depth multi-dimensional ${this.pageHeaderTitle().toLowerCase()} analysis, period-over-period comparisons, and volume metrics.`);
  }

  loadCustomerData(pageNumber: number, pageSize?: number) {
    this.operationsService.getCustomersData(pageNumber, pageSize).subscribe({
      next: (response) => { this.componentData.set(response); },
      error: (error) => { console.error(error) }
    })
  }

  onPageChange(pageNumber: number): void {
    this.loadCustomerData(pageNumber);
  }

  handleUpdate(row: any): void {
    console.log('Update clicked for order item:', row.order_item_id, row);
    // Trigger modal or navigation logic here
  }

  handleDelete(row: any): void {
    console.log('Delete clicked for order item:', row.order_item_id, row);
    // Trigger delete confirmation logic here
  }
}
