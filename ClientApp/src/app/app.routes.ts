import { Routes } from '@angular/router';
import { Dashboard } from './pages/components/dashboard/dashboard';
import { SalesAnalytics } from './pages/components/sales-analytics/sales-analytics';
import { StorePerformance } from './pages/components/store-performance/store-performance';
import { ProductCategories } from './pages/components/product-categories/product-categories';
import { AddData } from './pages/components/add-data/add-data';
import { DataExploration } from './pages/components/data-exploration/components/data-exploration';
import { NotFound } from './pages/components/not-found/not-found';
import { Settings } from './pages/components/settings/settings';
import { Login } from './auth/components/login/login';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Login,
        canActivate: [authGuard],
    },
    {
        path: 'login',
        component: Login,
        canActivate: [authGuard],
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'sales-analytics',
        component: SalesAnalytics,
        canActivate: [authGuard]
    },
    {
        path: 'store-performance',
        component: StorePerformance,
        canActivate: [authGuard]
    },
    {
        path: 'categories',
        component: ProductCategories,
        canActivate: [authGuard]
    },
    {
        path: 'add-data',
        component: AddData,
        canActivate: [authGuard]
    },
    {
        path: 'data-explorer/:type',
        component: DataExploration,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: NotFound
    }
];
