import { Component } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  imports: [PageHeader],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions {
  pageHeaderTitle = "Transactions";
  pageHeaderSubtitle = "In-depth multi-dimensional trend analysis, period-over-period comparisons, and volume metrics.";
}
