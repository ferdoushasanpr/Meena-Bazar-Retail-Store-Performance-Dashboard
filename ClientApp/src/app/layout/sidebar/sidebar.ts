import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../pages/services/user-service';
import { Userprofile } from '../../pages/components/userprofile/userprofile';
import { getNameInitials } from '../../shared/utilities/name-initials';

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
  imports: [RouterLink, Userprofile],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private userService = inject(UserService);
  userData = this.userService.userData;

  userInitials = computed(() => {
    return getNameInitials(this.userData()?.user_name);
  });

  activeItem: string = 'Dashboard';
  isSidebarOpen = false;
  isCollapsed = false;
  isDropdownOpen = signal<boolean>(false);

  // Profile Modal
  isOpen = signal<boolean>(false);

  menuSections = computed<MenuSection[]>(() => {
    const isAdmin = this.userData().user_role === 'admin';

    return [
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
            expanded: this.isDropdownOpen(),
            children: [
              ...(isAdmin) ? [{
                title: 'Users',
                route: '/data-explorer/users',
                icon: 'fa-solid fa-users'
              }] : [],
              {
                title: 'Customers',
                route: '/data-explorer/customers',
                icon: 'fa-solid fa-people-group'
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
  })

  toggleSubmenu(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
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

  // Profile Modal
  handleProfileModalOpen(): void {
    this.isOpen.set(true);
  }

  handleProfileModalClose(): void {
    this.isOpen.set(false);
  }
}
