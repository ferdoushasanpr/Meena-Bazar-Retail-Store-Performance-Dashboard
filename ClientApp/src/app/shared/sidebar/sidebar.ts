import { Component } from '@angular/core';

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
  imports: [],
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
        { title: 'Dashboard', icon: 'fa-solid fa-border-all', active: true },
        { title: 'Sales Analytics', icon: 'fa-solid fa-chart-line' },
        { title: 'Store Performance', icon: 'fa-solid fa-store' },
        { title: 'Product Categories', icon: 'fa-solid fa-layer-group' }
      ]
    },
    {
      sectionTitle: 'OPERATIONS',
      items: [
        { title: 'Transactions', icon: 'fa-solid fa-receipt' },
        { title: 'Reports & Exports', icon: 'fa-solid fa-file-lines' }
      ]
    },
    {
      sectionTitle: 'SYSTEM',
      items: [
        { title: 'Data Explorer', icon: 'fa-solid fa-database' },
        { title: 'Settings', icon: 'fa-solid fa-gear' }
      ]
    }
  ];

  selectItem(itemTitle: string): void {
    this.activeItem = itemTitle;
  }
}
