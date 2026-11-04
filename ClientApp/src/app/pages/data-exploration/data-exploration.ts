import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CustomerDataResponse } from '../../models/customer';
import { OperationsService } from '../../services/operations-service';
import { DynamicTable } from '../../shared/dynamic-table/dynamic-table';
import { ProductDataResponse } from '../../models/product';
import { StoreDataResponse } from '../../models/store';

@Component({
  imports: [PageHeader, DynamicTable],
  selector: 'app-data-exploration',
  styleUrl: './data-exploration.css',
  templateUrl: './data-exploration.html',
})
export class DataExploration {
  private router = inject(Router);
  private operationsService = inject(OperationsService);

  // Header Info
  pageHeaderTitle = signal<string>('');
  pageHeaderSubtitle = signal<string>('');

  // Contents
  componentData = signal<CustomerDataResponse | ProductDataResponse | StoreDataResponse>({
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Table Header Configuration
  private tableConfig: Record<string, { title: string; subtitle: string }> = {
    Customers: {
      title: 'Customers',
      subtitle: 'Overview of customer profiles, demographics, and purchasing behavior.'
    },
    Stores: {
      title: 'Stores',
      subtitle: 'Overview of store locations, performance, and operational metrics.'
    },
    Products: {
      title: 'Products',
      subtitle: 'Breakdown of product categories, pricing, inventory, and sales performance.'
    },
    Orders: {
      title: 'Transactions',
      subtitle: 'Breakdown by order, product, quantity, and amount.'
    }
  };

  tableHeader = computed(() => {
    return this.tableConfig[this.pageHeaderTitle()] ?? {
      title: 'Data',
      subtitle: 'Explore and analyze your data.'
    };
  });

  constructor() {
    this.updatePath();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePath());
  }

  updatePath() {
    const lastSegment = this.router.url
      .split('/')
      .pop() ?? '';

    this.pageHeaderTitle.set(lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : '');
    this.pageHeaderSubtitle.set(`In-depth multi-dimensional ${this.pageHeaderTitle().toLowerCase()} analysis, period-over-period comparisons, and volume metrics.`);

    this.loadComponentData();
  }

  loadComponentData(): void {
    if (this.pageHeaderTitle() === 'Customers') {
      this.loadCustomerData(1);
    } else if (this.pageHeaderTitle() === 'Products') {
      this.loadProductData(1);
    } else if (this.pageHeaderTitle() === 'Stores') {
      this.loadStoreData(1);
    }
  }

  loadCustomerData(pageNumber: number, pageSize?: number) {
    this.operationsService.getCustomersData(pageNumber, pageSize).subscribe({
      next: (response) => { this.componentData.set(response); },
      error: (error) => { console.error(error) }
    })
  }

  loadProductData(pageNumber: number, pageSize?: number) {
    this.operationsService.getProductsData(pageNumber, pageSize).subscribe({
      next: (response) => { this.componentData.set(response); },
      error: (error) => { console.error(error) }
    })
  }

  loadStoreData(pageNumber: number, pageSize?: number) {
    this.operationsService.getStoresPaginatedData(pageNumber, pageSize).subscribe({
      next: (response) => { this.componentData.set(response); },
      error: (error) => { console.error(error) }
    })
  }

  onPageChange(pageNumber: number): void {
    if (this.pageHeaderTitle() === 'Customers') {
      this.loadCustomerData(pageNumber);
    } else if (this.pageHeaderTitle() === 'Products') {
      this.loadProductData(pageNumber);
    } else if (this.pageHeaderTitle() === 'Stores') {
      this.loadStoreData(pageNumber);
    }

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
