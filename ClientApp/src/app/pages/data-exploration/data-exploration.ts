import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CustomerDataResponse } from '../../models/customer';
import { OperationsService } from '../../services/operations-service';
import { DynamicTable } from '../../shared/dynamic-table/dynamic-table';
import { ProductDataResponse } from '../../models/product';
import { StoreDataResponse } from '../../models/store';
import { OrderDataResponse } from '../../models/order';
import { TransactionDataResponse } from '../../models/transaction';
import { ModalForm } from '../../shared/modal-form/modal-form';
import { EntityType, UpdatePayload } from '../../models/props';

@Component({
  imports: [PageHeader, DynamicTable, ModalForm],
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
  componentData = signal<CustomerDataResponse | ProductDataResponse | StoreDataResponse | OrderDataResponse | TransactionDataResponse>({
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
      title: 'Orders',
      subtitle: 'Breakdown by order, product, quantity, and amount.'
    },
    Transactions: {
      title: 'Transactions',
      subtitle: 'Breakdown by transaction, order, product, quantity, and amount.'
    }
  };

  // Modal State Signals
  isModalOpen = signal<boolean>(false);
  selectedRowData = signal<any>(null);
  activeEntityType = signal<EntityType>('Customer');

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
      this.activeEntityType.set('Customer');
      this.loadCustomerData(1);
    } else if (this.pageHeaderTitle() === 'Products') {
      this.activeEntityType.set('Product');
      this.loadProductData(1);
    } else if (this.pageHeaderTitle() === 'Stores') {
      this.activeEntityType.set('Store');
      this.loadStoreData(1);
    } else if (this.pageHeaderTitle() === 'Orders') {
      this.loadOrderData(1);
    } else if (this.pageHeaderTitle() === 'Transactions') {
      this.loadTransactionsData(1);
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

  loadOrderData(pageNumber: number, pageSize?: number) {
    this.operationsService.getOrdersData(pageNumber, pageSize).subscribe({
      next: (response) => { this.componentData.set(response); },
      error: (error) => { console.error(error) }
    })
  }

  loadTransactionsData(pageNumber: number): void {
    this.operationsService.getTransactionsData(pageNumber).subscribe({
      next: (response) => { this.componentData.set(response); },
      error: (error) => { console.error(error) }
    });
  }

  onPageChange(pageNumber: number): void {
    if (this.pageHeaderTitle() === 'Customers') {
      this.loadCustomerData(pageNumber);
    } else if (this.pageHeaderTitle() === 'Products') {
      this.loadProductData(pageNumber);
    } else if (this.pageHeaderTitle() === 'Stores') {
      this.loadStoreData(pageNumber);
    } else if (this.pageHeaderTitle() === 'Orders') {
      this.loadOrderData(pageNumber);
    } else if (this.pageHeaderTitle() === 'Transactions') {
      this.loadTransactionsData(pageNumber);
    }

  }

  // Triggered when Update Icon is clicked in any table
  handleSaveUpdate(payload: UpdatePayload): void {
    payload.data[`${payload.type.toLowerCase()}_id`] = payload.id;

    if (payload.type === "Customer") {
      this.operationsService.updateCustomerData(payload.data, payload.id).subscribe({
        next: (response) => {
          console.log('Customer updated successfully:', response);
          this.isModalOpen.set(false);
          this.loadCustomerData(this.componentData().pageNumber);
        },
        error: (error) => { console.error(error) }
      });
    } else if (payload.type === "Product") {
      this.operationsService.updateProductData(payload.data, payload.id).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.isModalOpen.set(false);
          this.loadProductData(this.componentData().pageNumber);
        },
        error: (error) => { console.error(error) }
      });
    } else if (payload.type === "Store") {
      this.operationsService.updateStoreData(payload.data, payload.id).subscribe({
        next: (response) => {
          console.log('Store updated successfully:', response);
          this.isModalOpen.set(false);
          this.loadStoreData(this.componentData().pageNumber);
        },
        error: (error) => { console.error(error) }
      });
    }
  }

  handleCloseModal(): void {
    this.isModalOpen.set(false);
  }

  handleUpdate(row: any): void {
    console.log('Update clicked for order item:', row);
    this.selectedRowData.set(row);
    this.isModalOpen.set(true);
  }

  handleDelete(row: any): void {
    console.log('Delete clicked for order item:', row);
    if (this.pageHeaderTitle() === 'Customers') {
      this.operationsService.deleteCustomerData(row.customer_id).subscribe({
        next: (response) => {
          console.log('Customer deleted successfully:', response);
          this.loadCustomerData(this.componentData().pageNumber);
        },
        error: (error) => { console.error(error) }
      });
    } else if (this.pageHeaderTitle() === 'Products') {
      this.operationsService.deleteProductData(row.product_id).subscribe({
        next: (response) => {
          console.log('Product deleted successfully:', response);
          this.loadProductData(this.componentData().pageNumber);
        },
        error: (error) => { console.error(error) }
      });
    }
  }
}
