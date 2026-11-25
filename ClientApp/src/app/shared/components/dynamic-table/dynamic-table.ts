import { Component, input, signal, computed, output } from '@angular/core';

export interface ColumnMeta {
  key: string;
  header: string;
  type: 'currency' | 'number' | 'text';
  align: 'left' | 'right';
}

@Component({
  imports: [],
  selector: 'app-dynamic-table',
  styleUrl: './dynamic-table.css',
  templateUrl: './dynamic-table.html',
})
export class DynamicTable {
  // Data Inputs
  title = input<string>('Order Items');
  subtitle = input<string>('');
  loading = input<boolean>(false);
  data = input<any[]>([]);
  canUpdate = input.required<boolean>();
  canDelete = input.required<boolean>();
  canSearch = input.required<boolean>();

  // Pagination Inputs
  pageNumber = input<number>(1);
  pageSize = input<number>(10);
  totalRecords = input<number>(0);
  totalPages = input<number>(0);
  hasPreviousPage = input<boolean>(false);
  hasNextPage = input<boolean>(false);

  // Outputs
  pageChange = output<number>();
  updateRow = output<any>();
  deleteRow = output<any>();

  // State
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  searchQuery = signal('');
  searchTerm = output<string>();

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchTerm.emit(this.searchQuery());
  }

  columns = computed<ColumnMeta[]>(() => {
    const firstRow = this.data()?.[0];
    if (!firstRow) return [];

    return Object.keys(firstRow).map((key) => ({
      key,
      header: this.formatHeader(key),
      type: this.detectType(key, firstRow[key]),
      align: typeof firstRow[key] === 'number' ? 'right' : 'left'
    }));
  });

  sortedData = computed(() => {
    const list = [...(this.data() || [])];
    const key = this.sortColumn();
    const dir = this.sortDirection();

    if (!key) return list;

    return list.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      const res = valA < valB ? -1 : 1;
      return dir === 'asc' ? res : -res;
    });
  });

  private formatHeader(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private detectType(key: string, val: any): 'currency' | 'number' | 'text' {
    if (typeof val === 'number') {
      const lower = key.toLowerCase();
      if (
        lower.includes('price') ||
        lower.includes('amount') ||
        lower.includes('vat') ||
        lower.includes('net') ||
        lower.includes('discount') ||
        lower.includes('sales') ||
        lower.includes('cost')
      ) {
        return 'currency';
      }
      return 'number';
    }
    return 'text';
  }

  toggleSort(key: string): void {
    if (this.sortColumn() === key) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortColumn.set(null);
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumn.set(key);
      this.sortDirection.set('asc');
    }
  }

  formatCell(val: any, type: string): string {
    if (val == null) return '-';
    if (type === 'currency') {
      return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (type === 'number') return Number(val).toLocaleString();
    return String(val);
  }

  onUpdate(row: any): void {
    this.updateRow.emit(row);
  }

  onDelete(row: any): void {
    this.deleteRow.emit(row);
  }

  onPrevPage(): void {
    if (this.hasPreviousPage()) {
      this.pageChange.emit(this.pageNumber() - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNextPage()) {
      this.pageChange.emit(this.pageNumber() + 1);
    }
  }
}
