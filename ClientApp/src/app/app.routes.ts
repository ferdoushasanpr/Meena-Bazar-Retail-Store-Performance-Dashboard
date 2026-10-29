import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { SalesAnalytics } from './pages/sales-analytics/sales-analytics';
import { ProductCategories } from './pages/product-categories/product-categories';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'sales-analytics',
        component: SalesAnalytics
    },
    {
        path: 'categories',
        component: ProductCategories
    }
];
