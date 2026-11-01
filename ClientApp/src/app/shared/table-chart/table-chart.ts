import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PageChangeEvent {
  pageNumber: number;
  pageSize: number;
}

interface AutoColumn {
  key: string;
  header: string;
  type: 'currency' | 'number' | 'text';
  align: 'left' | 'right';
}

@Component({
  imports: [CommonModule],
  selector: 'app-table-chart',
  styleUrl: './table-chart.css',
  templateUrl: './table-chart.html',
})
export class TableChart {
  title = input<string>('');
  subtitle = input<string>('');
  data = input<any[]>([]);

  // Pagination Inputs
  pageNumber = input<number>(1);
  pageSize = input<number>(10);
  totalRecords = input<number>(0);
  totalPages = input<number>(0);
  hasPreviousPage = input<boolean>(false);
  hasNextPage = input<boolean>(false);

  pageChange = output<PageChangeEvent>();

  // Sorting
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Automatically compute column schema based on the first item in the data array
  columns = computed<AutoColumn[]>(() => {
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

  // Converts camelCase or snake_case keys (e.g., totalSales, store_name) to "Total Sales", "Store Name"
  private formatHeader(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Auto-detect formatting based on column name or value type
  private detectType(key: string, val: any): 'currency' | 'number' | 'text' {
    if (typeof val === 'number') {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('sales') || lowerKey.includes('price') || lowerKey.includes('revenue') || lowerKey.includes('cost')) {
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
    if (type === 'currency') return `$${Number(val).toFixed(2)}`;
    if (type === 'number') return Number(val).toLocaleString();
    return String(val);
  }

  onPrev(): void {
    if (this.hasPreviousPage()) {
      this.pageChange.emit({ pageNumber: this.pageNumber() - 1, pageSize: this.pageSize() });
    }
  }

  onNext(): void {
    if (this.hasNextPage()) {
      this.pageChange.emit({ pageNumber: this.pageNumber() + 1, pageSize: this.pageSize() });
    }
  }
}
