import { Routes } from '@angular/router';
import { Dashboard } from './pages/components/dashboard/dashboard';
import { SalesAnalytics } from './pages/components/sales-analytics/sales-analytics';
import { StorePerformance } from './pages/components/store-performance/store-performance';
import { ProductCategories } from './pages/components/product-categories/product-categories';
import { AddData } from './pages/components/add-data/add-data';
import { DataExploration } from './pages/components/data-exploration/components/data-exploration';
import { NotFound } from './pages/components/not-found/not-found';

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
    },
    {
        path: '**',
        component: NotFound
    }
];
