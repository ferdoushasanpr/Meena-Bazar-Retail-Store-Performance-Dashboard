import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PageHeader } from '../../../../layout/page-header/page-header';
import { DynamicTable } from '../../../../shared/components/dynamic-table/dynamic-table';
import { ModalForm } from '../../../../shared/components/modal-form/modal-form';
import { DialogBox } from '../../../../shared/components/dialog-box/dialog-box';
import { EntityType, UpdatePayload } from '../../../../core/models/props';
import { CustomerService } from '../services/customer-service';
import { ProductService } from '../services/product-service';
import { StoreService } from '../services/store-service';
import { OrderService } from '../services/order-service';
import { TransactionService } from '../services/transaction-service';
import { UserService } from '../../../services/user-service';
import { AuthService } from '../../../../auth/services/auth-service';
import { Loading } from '../../../../shared/components/loading/loading';
import { ToastService } from '../../../services/toast-service';
import { NotificationService } from '../../../services/notification-service';

@Component({
  imports: [PageHeader, Loading, DynamicTable, ModalForm, DialogBox],
  selector: 'app-data-exploration',
  styleUrl: './data-exploration.css',
  templateUrl: './data-exploration.html',
})
export class DataExploration {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private orderService = inject(OrderService);
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);
  private notificationService = inject(NotificationService);

  // Header Info
  pageHeaderTitle = signal<string>('');
  pageHeaderSubtitle = signal<string>('');

  authData = this.authService.authData();
  userRole = this.authData?.role;
  token = this.authData?.token;
  userData = this.userService.userData;
  // Search Input
  searchQuery = signal<string>('');

  // Loading State
  componentDataLoading = computed(() => {
    const title = this.pageHeaderTitle();

    switch (title) {
      case 'Users': return this.userService.componentDataLoading();
      case 'Customers': return this.customerService.componentDataLoading();
      case 'Products': return this.productService.componentDataLoading();
      case 'Stores': return this.storeService.componentDataLoading();
      case 'Orders': return this.orderService.componentDataLoading();
      case 'Transactions': return this.transactionService.componentDataLoading();
      default: return { data: [], pageNumber: 1, pageSize: 10, totalRecords: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
    }
  });

  // Contents
  componentData = computed(() => {
    const title = this.pageHeaderTitle();

    switch (title) {
      case 'Users': return this.userService.componentData();
      case 'Customers': return this.customerService.componentData();
      case 'Products': return this.productService.componentData();
      case 'Stores': return this.storeService.componentData();
      case 'Orders': return this.orderService.componentData();
      case 'Transactions': return this.transactionService.componentData();
      default: return { data: [], pageNumber: 1, pageSize: 10, totalRecords: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
    }
  });

  isLoading = computed(() => {
    const title = this.pageHeaderTitle();
    return this.componentDataLoading();
  });

  // Table Header Configuration
  private tableConfig: Record<string, { title: string; subtitle: string }> = {
    Users: {
      title: 'Users',
      subtitle: 'Overview of user profiles, and demographics.'
    },
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
  isDeleteModalOpen = signal<boolean>(false);
  itemToDelete = signal<any>(null);

  constructor() {
    this.updatePath();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePath());
  }

  tableHeader = computed(() => {
    return this.tableConfig[this.pageHeaderTitle()] ?? {
      title: 'Data',
      subtitle: 'Explore and analyze your data.'
    };
  });

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
      this.customerService.loadCustomerData(1);
    } else if (this.pageHeaderTitle() === 'Products') {
      this.activeEntityType.set('Product');
      this.productService.loadProductData(1);
    } else if (this.pageHeaderTitle() === 'Stores') {
      this.activeEntityType.set('Store');
      this.storeService.loadStoreData(1);
    } else if (this.pageHeaderTitle() === 'Orders') {
      this.orderService.loadOrderData(1);
    } else if (this.pageHeaderTitle() === 'Transactions') {
      this.transactionService.loadTransactionsData(1);
    } else if (this.pageHeaderTitle() === 'Users') {
      this.activeEntityType.set('User');
      if (this.token && this.userRole === 'admin') {
        this.userService.loadUserData(this.token, 1);
      }
    }
  }

  onSearch(searchTerm: string): void {
    this.searchQuery.set(searchTerm);

    if (this.pageHeaderTitle() === 'Customers') {
      if (this.searchQuery() === '') {
        this.customerService.loadCustomerData(1);
      } else {
        this.customerService.loadSearchCustomerData(1, searchTerm);
      }
    } else if (this.pageHeaderTitle() === 'Products') {
      if (this.searchQuery() === '') {
        this.productService.loadProductData(1);
      } else {
        this.productService.loadSearchProductData(1, searchTerm);
      }
    } else if (this.pageHeaderTitle() === 'Stores') {
      if (this.searchQuery() === '') {
        this.storeService.loadStoreData(1);
      } else {
        this.storeService.loadSearchStoreData(1, searchTerm);
      }
    } else if (this.pageHeaderTitle() === 'Orders') {
      if (this.searchQuery() === '') {
        this.orderService.loadOrderData(1);
      } else {
        this.orderService.loadSearchOrderData(1, searchTerm);
      }
    } else if (this.pageHeaderTitle() === 'Transactions') {
      if (this.searchQuery() === '') {
        this.transactionService.loadTransactionsData(1);
      } else {
        this.transactionService.loadSearchTransactionData(1, searchTerm);
      }
    } else if (this.pageHeaderTitle() === 'Users') {
      if (this.token && this.userRole === 'admin') {
        if (this.searchQuery() === '') {
          this.userService.loadUserData(this.token, 1);
        } else {
          this.userService.loadSearchUserData(1, this.token, searchTerm);
        }
      }
    }
  }

  onPageChange(pageNumber: number): void {
    if (this.pageHeaderTitle() === 'Customers') {
      if (this.searchQuery() === '') {
        this.customerService.loadCustomerData(pageNumber);
      } else {
        this.customerService.loadSearchCustomerData(pageNumber, this.searchQuery());
      }
    } else if (this.pageHeaderTitle() === 'Products') {
      if (this.searchQuery() === '') {
        this.productService.loadProductData(pageNumber);
      } else {
        this.productService.loadSearchProductData(pageNumber, this.searchQuery());
      }
    } else if (this.pageHeaderTitle() === 'Stores') {
      if (this.searchQuery() === '') {
        this.storeService.loadStoreData(pageNumber);
      } else {
        this.storeService.loadSearchStoreData(pageNumber, this.searchQuery());
      }
    } else if (this.pageHeaderTitle() === 'Orders') {
      if (this.searchQuery() === '') {
        this.orderService.loadOrderData(pageNumber);
      } else {
        this.orderService.loadSearchOrderData(pageNumber, this.searchQuery());
      }
    } else if (this.pageHeaderTitle() === 'Transactions') {
      if (this.searchQuery() === '') {
        this.transactionService.loadTransactionsData(pageNumber);
      } else {
        this.transactionService.loadSearchTransactionData(pageNumber, this.searchQuery());
      }
    } else if (this.pageHeaderTitle() === 'Users') {
      if (this.token && this.userRole === 'admin') {
        if (this.searchQuery() === '') {
          this.userService.loadUserData(this.token, pageNumber);
        } else {
          this.userService.loadSearchUserData(pageNumber, this.token, this.searchQuery());
        }
      }
    }
  }

  //  Update Data in any Table
  handleUpdate(row: any): void {
    console.log('Update clicked for order item:', row);
    this.selectedRowData.set(row);
    this.isModalOpen.set(true);
  }

  handleSaveUpdate(payload: UpdatePayload): void {
    payload.data[`${payload.type.toLowerCase()}_id`] = payload.id;

    if (payload.type === "Customer") {
      this.customerService.updateCustomer(payload.id, payload.data).subscribe({
        next: (response) => {
          const data = this.userData();
          if (data.user_id) {
            this.notificationService.addNotification({
              user_id: data.user_id,
              message: `updated customer of customer id ${payload.id}.`,
              isRead: 0
            }).subscribe({
              next: () => { console.log("Customer Updated Successfully!") },
              error: (error) => { console.error(error) }
            });
          }
          this.isModalOpen.set(false);
          this.toastService.showSuccess("Update", "Customer Updated Successfully!");
          this.customerService.loadCustomerData(this.componentData().pageNumber);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else if (payload.type === "Product") {
      this.productService.updateProduct(payload.id, payload.data).subscribe({
        next: (response) => {
          const data = this.userData();
          if (data.user_id) {
            this.notificationService.addNotification({
              user_id: data.user_id,
              message: `updated product of product id ${payload.id}.`,
              isRead: 0
            }).subscribe({
              next: () => { console.log("Product Updated Successfully!") },
              error: (error) => { console.error(error) }
            });
          }
          this.isModalOpen.set(false);
          this.toastService.showSuccess("Update", "Product Updated Successfully!");
          this.productService.loadProductData(this.componentData().pageNumber);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else if (payload.type === "Store") {
      this.storeService.updateStore(payload.id, payload.data).subscribe({
        next: (response) => {
          const data = this.userData();
          if (data.user_id) {
            this.notificationService.addNotification({
              user_id: data.user_id,
              message: `updated store of store id ${payload.id}.`,
              isRead: 0
            }).subscribe({
              next: () => { console.log("Store Updated Successfully!") },
              error: (error) => { console.error(error) }
            });
          }
          this.isModalOpen.set(false);
          this.toastService.showSuccess("Update", "Store Updated Successfully!");
          this.storeService.loadStoreData(this.componentData().pageNumber);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else if (payload.type === "User") {
      if (this.token) {
        this.userService.updateUser(payload.id, payload.data, this.token).subscribe({
          next: (response) => {
            const data = this.userData();
            if (data.user_id) {
              this.notificationService.addNotification({
                user_id: data.user_id,
                message: `updated user of user id ${payload.id}.`,
                isRead: 0
              }).subscribe({
                next: () => { console.log("User Updated Successfully!") },
                error: (error) => { console.error(error) }
              });
            }
            this.isModalOpen.set(false);
            this.toastService.showSuccess("Update", "User Updated Successfully!");
            if (this.token) {
              this.userService.loadUserData(this.token, this.componentData().pageNumber);
            }
          },
          error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
        });
      }
    }
  }

  handleCloseModal(): void {
    this.isModalOpen.set(false);
  }

  // Delete Data in any Table
  handleDelete(row: any): void {
    console.log('Delete clicked for item:', row);
    this.itemToDelete.set(row);
    this.isDeleteModalOpen.set(true);
  }

  onConfirmDelete(): void {
    const record = this.itemToDelete();
    console.log('Deleting record from backend:', record);

    if (this.pageHeaderTitle() === 'Customers') {
      this.customerService.deleteCustomer(record.customer_id).subscribe({
        next: (response) => {
          const data = this.userData();
          if (data.user_id) {
            this.notificationService.addNotification({
              user_id: data.user_id,
              message: `deleted customer of customer id ${record.customer_id}.`,
              isRead: 0
            }).subscribe({
              next: () => { console.log("Customer Deleted Successfully!") },
              error: (error) => { console.error(error) }
            });
          }
          this.toastService.showSuccess("Delete", "Customer Deleted Successfully!");
          this.customerService.loadCustomerData(this.componentData().pageNumber);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else if (this.pageHeaderTitle() === 'Products') {
      this.productService.deleteProduct(record.product_id).subscribe({
        next: (response) => {
          const data = this.userData();
          if (data.user_id) {
            this.notificationService.addNotification({
              user_id: data.user_id,
              message: `deleted product of product id ${record.product_id}.`,
              isRead: 0
            }).subscribe({
              next: () => { console.log("Product Deleted Successfully!") },
              error: (error) => { console.error(error) }
            });
          }
          this.toastService.showSuccess("Delete", "Product Deleted Successfully!");
          this.productService.loadProductData(this.componentData().pageNumber);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else if (this.pageHeaderTitle() === 'Stores') {
      this.storeService.deleteStore(record.store_id).subscribe({
        next: (response) => {
          const data = this.userData();
          if (data.user_id) {
            this.notificationService.addNotification({
              user_id: data.user_id,
              message: `deleted store of store id ${record.store_id}.`,
              isRead: 0
            }).subscribe({
              next: () => { console.log("Store Deleted Successfully!") },
              error: (error) => { console.error(error) }
            });
          }
          this.toastService.showSuccess("Delete", "Store Deleted Successfully!");
          this.storeService.loadStoreData(this.componentData().pageNumber);
        },
        error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
      });
    } else if (this.pageHeaderTitle() === 'Users') {
      if (this.userRole === 'admin' && this.token) {
        this.userService.deleteUser(record.user_id, this.token).subscribe({
          next: (response) => {
            const data = this.userData();
            if (data.user_id) {
              this.notificationService.addNotification({
                user_id: data.user_id,
                message: `deleted user of user id ${record.user_id}.`,
                isRead: 0
              }).subscribe({
                next: () => { console.log("User Deleted Successfully!") },
                error: (error) => { console.error(error) }
              });
            }
            this.toastService.showSuccess("Delete", "User Deleted Successfully!");
            if (this.token) {
              this.userService.loadUserData(this.token, this.componentData().pageNumber);
            }
          },
          error: (error) => { this.toastService.showError("Something Went Wrong!", "Error") }
        });
      }
    }

    this.isDeleteModalOpen.set(false);
    this.itemToDelete.set(null);
  }


  onCloseDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.itemToDelete.set(null);
  }
}
