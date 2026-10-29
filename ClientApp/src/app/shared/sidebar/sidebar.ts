import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  active?: boolean;
}

interface MenuSection {
  sectionTitle: string;
  items: MenuItem[];
}

@Component({
  imports: [RouterLink],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  activeItem: string = 'Dashboard';

  menuSections: MenuSection[] = [
    {
      sectionTitle: 'OVERVIEW',
      items: [
        { title: 'Dashboard', route: '/dashboard', icon: 'fa-solid fa-border-all', active: true },
        { title: 'Sales Analytics', route: '/sales-analytics', icon: 'fa-solid fa-chart-line' },
        { title: 'Store Performance', route: '/store-performance', icon: 'fa-solid fa-store' },
        { title: 'Product Categories', route: '/categories', icon: 'fa-solid fa-layer-group' }
      ]
    },
    {
      sectionTitle: 'OPERATIONS',
      items: [
        { title: 'Transactions', route: '/transactions', icon: 'fa-solid fa-receipt' },
        { title: 'Reports & Exports', route: '/report-export', icon: 'fa-solid fa-file-lines' }
      ]
    },
    {
      sectionTitle: 'SYSTEM',
      items: [
        { title: 'Data Explorer', route: '/data-explorer', icon: 'fa-solid fa-database' },
        { title: 'Settings', route: '/settings', icon: 'fa-solid fa-gear' }
      ]
    }
  ];

  selectItem(itemTitle: string): void {
    this.activeItem = itemTitle;
  }
}
