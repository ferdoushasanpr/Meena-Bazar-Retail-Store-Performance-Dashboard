import { Routes } from '@angular/router';
import { Dashboard } from './pages/components/dashboard/dashboard';
import { SalesAnalytics } from './pages/components/sales-analytics/sales-analytics';
import { AddData } from './pages/components/add-data/add-data';
import { DataExploration } from './pages/components/data-exploration/components/data-exploration';
import { NotFound } from './pages/components/not-found/not-found';
import { Settings } from './pages/components/settings/settings';
import { Login } from './auth/components/login/login';
import { authGuard } from './auth/guards/auth-guard';
import { roleGuard } from './auth/guards/role-guard';
import { SalesBreakdown } from './pages/components/sales-breakdown/sales-breakdown';

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
        path: 'sales-breakdown',
        component: SalesBreakdown,
        canActivate: [authGuard]
    },
    {
        path: 'add-data',
        component: AddData,
        canActivate: [authGuard]
    },
    {
        path: 'data-explorer/users',
        component: DataExploration,
        canActivate: [authGuard, roleGuard]
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
