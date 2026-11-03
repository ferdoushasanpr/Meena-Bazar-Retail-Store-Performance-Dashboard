import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { TransactionDataResponse } from '../../models/transaction';
import { OperationsService } from '../../services/operations-service';
import { TableChart } from '../../shared/table-chart/table-chart';
import { DynamicTable } from '../../shared/dynamic-table/dynamic-table';

@Component({
  imports: [PageHeader, DynamicTable],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit {
  private operationsService = inject(OperationsService);
  // Header Info
  pageHeaderTitle = "Transactions";
  pageHeaderSubtitle = "In-depth multi-dimensional trend analysis, period-over-period comparisons, and volume metrics.";

  transactions = signal<TransactionDataResponse>({
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  ngOnInit(): void {
    this.loadTransactionsData(1)
  }


  loadTransactionsData(pageNumber: number): void {
    this.operationsService.getTransactionsData(pageNumber).subscribe({
      next: (response) => { this.transactions.set(response); console.log(response) },
      error: (error) => { console.error(error) }
    });
  }

  onPageChange(pageNumber: number): void {
    this.loadTransactionsData(pageNumber);
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
