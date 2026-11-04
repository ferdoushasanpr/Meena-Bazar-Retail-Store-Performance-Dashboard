import { Component, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [PageHeader],
  selector: 'app-data-exploration',
  styleUrl: './data-exploration.css',
  templateUrl: './data-exploration.html',
})
export class DataExploration {
  private router = inject(Router);

  // Header Info
  pageHeaderTitle = signal<string>('');
  pageHeaderSubtitle = signal<string>('');

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
  }
}
