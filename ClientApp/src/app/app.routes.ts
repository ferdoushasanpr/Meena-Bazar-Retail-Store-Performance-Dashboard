import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { DataExploration } from './pages/data-exploration/data-exploration';
import { AddData } from './pages/add-data/add-data';
import { SalesAnalytics } from './pages/sales/sales-analytics/sales-analytics';
import { StorePerformance } from './pages/sales/store-performance/store-performance';
import { ProductCategories } from './pages/sales/product-categories/product-categories';

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
        path: 'store-performance',
        component: StorePerformance
    },
    {
        path: 'categories',
        component: ProductCategories
    },
    {
        path: 'add-data',
        component: AddData
    },
    {
        path: 'data-explorer/:type',
        component: DataExploration
    }
];
