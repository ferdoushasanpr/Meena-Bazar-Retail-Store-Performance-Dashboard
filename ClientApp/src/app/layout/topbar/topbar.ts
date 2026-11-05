import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [RouterLink, TitleCasePipe],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar {
  lastUpdatedTime: string = '10:42 AM';

  private router = inject(Router);

  pathSegments = signal<string[]>([]);

  constructor() {
    this.updatePath();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePath());
  }

  updatePath() {
    const segments = this.router.url
      .split('?')[0]
      .split('/')
      .filter(Boolean);

    this.pathSegments.set(segments);
  }

  onExportCSV(): void {
    console.log('Exporting CSV...');
  }

  onExportSummary(): void {
    console.log('Exporting Summary...');
  }

  onRefresh(): void {
    console.log('Refreshing data...');
  }
}
