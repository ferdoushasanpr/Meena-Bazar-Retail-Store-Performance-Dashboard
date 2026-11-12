import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../pages/services/user-service';

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
  private userService = inject(UserService);
  userData = this.userService.userData;

  userInitials = computed(() => {
    const data = this.userData();
    if (!data.user_name) return '';
    return data.user_name.split(" ").map(item => item[0].toUpperCase()).join('');
  })

  activeItem: string = 'Dashboard';

  isSidebarOpen = false;
  isCollapsed = false;

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
        { title: 'Add Data', route: '/add-data', icon: 'fa-solid fa-square-plus' }
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
            },
            { title: 'Transactions', route: '/data-explorer/transactions', icon: 'fa-solid fa-receipt' }
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

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
