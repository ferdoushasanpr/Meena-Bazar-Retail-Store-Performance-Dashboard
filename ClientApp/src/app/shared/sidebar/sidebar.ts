import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  active?: boolean;
  expanded?: boolean;
  children?: MenuItem[];
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
        {
          title: 'Data Explorer',
          icon: 'fa-solid fa-database',
          expanded: false,
          children: [
            {
              title: 'Customers',
              route: '/data-explorer/customers',
              icon: 'fa-solid fa-users'
            },
            {
              title: 'Products',
              route: '/data-explorer/products',
              icon: 'fa-solid fa-box'
            },
            {
              title: 'Stores',
              route: '/data-explorer/stores',
              icon: 'fa-solid fa-shop'
            },
            {
              title: 'Orders',
              route: '/data-explorer/orders',
              icon: 'fa-solid fa-cart-shopping'
            }
          ]
        },
        {
          title: 'Settings',
          route: '/settings',
          icon: 'fa-solid fa-gear'
        }
      ]
    }
  ];

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  selectItem(itemTitle: string): void {
    this.activeItem = itemTitle;
  }
}
