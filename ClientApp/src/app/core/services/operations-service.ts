import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StoreData, StoreDataResponse } from '../models/store';
import { Observable } from 'rxjs';
import { TransactionData, TransactionDataResponse } from '../models/transaction';
import { Customer, CustomerDataResponse } from '../models/customer';
import { Product, ProductDataResponse } from '../models/product';
import { Order, OrderDataResponse } from '../models/order';
import { UserData, UserDataResponse } from '../models/user';
import { NotificationData, NotificationResponse } from '../models/notification';

@Injectable({
    providedIn: "root"
})
export class OperationsService {
    private http = inject(HttpClient);
    private readonly apiUrlBase = 'http://localhost:5253';

    // Customer Operations
    addCustomerData(token: string, customer: Customer): Observable<Customer> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.post<Customer>(`${this.apiUrlBase}/customers`, customer, { headers });
    }

    getCustomersData(token: string, pageNumber: number, pageSize: number = 10): Observable<CustomerDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<CustomerDataResponse>(`${this.apiUrlBase}/customers?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    searchCustomersData(token: string, pageNumber: number, pageSize: number = 10, searchTerm?: string): Observable<CustomerDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<CustomerDataResponse>(`${this.apiUrlBase}/customers/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    updateCustomerData(token: string, customer: Customer, id: string): Observable<Customer> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.put<Customer>(`${this.apiUrlBase}/customers/${id}`, customer, { headers });
    }

    deleteCustomerData(token: string, id: string): Observable<Customer> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.delete<Customer>(`${this.apiUrlBase}/customers/${id}`, { headers });
    }

    // Product Operations
    addProductData(token: string, product: Product): Observable<Product> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.post<Product>(`${this.apiUrlBase}/products`, product, { headers });
    }

    getProductsData(token: string, pageNumber: number, pageSize: number = 10): Observable<ProductDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<ProductDataResponse>(`${this.apiUrlBase}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    searchProductsData(token: string, pageNumber: number, pageSize: number = 10, searchTerm?: string): Observable<ProductDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<ProductDataResponse>(`${this.apiUrlBase}/products/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    updateProductData(token: string, product: Product, id: string): Observable<Product> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.put<Product>(`${this.apiUrlBase}/products/${id}`, product, { headers });
    }

    deleteProductData(token: string, id: string): Observable<Product> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.delete<Product>(`${this.apiUrlBase}/products/${id}`, { headers });
    }

    // Store Operations
    addStoreData(token: string, store: StoreData): Observable<StoreData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.post<StoreData>(`${this.apiUrlBase}/stores`, store, { headers });
    }

    getStoresData(token: string): Observable<StoreData[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<StoreData[]>(`${this.apiUrlBase}/stores`, { headers });
    }

    getStoresPaginatedData(token: string, pageNumber: number, pageSize: number = 10): Observable<StoreDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<StoreDataResponse>(`${this.apiUrlBase}/stores/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    searchStoresData(token: string, pageNumber: number, pageSize: number = 10, searchTerm?: string): Observable<StoreDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<StoreDataResponse>(`${this.apiUrlBase}/stores/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    updateStoreData(token: string, store: StoreData, id: string): Observable<StoreData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.put<StoreData>(`${this.apiUrlBase}/stores/${id}`, store, { headers });
    }

    deleteStoreData(token: string, id: string): Observable<StoreData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.delete<StoreData>(`${this.apiUrlBase}/stores/${id}`, { headers });
    }

    // Order Operations
    getOrdersData(token: string, pageNumber: number, pageSize: number = 10): Observable<OrderDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<OrderDataResponse>(`${this.apiUrlBase}/sales?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    searchOrdersData(token: string, pageNumber: number, pageSize: number = 10, searchTerm?: string): Observable<OrderDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<OrderDataResponse>(`${this.apiUrlBase}/sales/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    // Transactions Operations
    getTransactionsData(token: string, pageNumber: number, pageSize: number = 10): Observable<TransactionDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<TransactionDataResponse>(`${this.apiUrlBase}/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    searchTransactionsData(token: string, pageNumber: number, pageSize: number = 10, searchTerm?: string): Observable<TransactionDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<TransactionDataResponse>(`${this.apiUrlBase}/transactions/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    deleteTransactionData(token: string, id: string): Observable<TransactionData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.delete<TransactionData>(`${this.apiUrlBase}/transactions/${id}`, { headers });
    }

    // User Operations
    getUsersData(pageNumber: number, pageSize: number = 10, token: string): Observable<UserDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }

        return this.http.get<UserDataResponse>(`${this.apiUrlBase}/users?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    getUserData(user_id: string, token: string): Observable<UserData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }

        return this.http.get<UserData>(`${this.apiUrlBase}/users/${user_id}`, { headers });
    }

    searchUsersData(pageNumber: number, pageSize: number = 10, token: string, searchTerm?: string): Observable<UserDataResponse> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }

        return this.http.get<UserDataResponse>(`${this.apiUrlBase}/users/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
    }

    updateUserData(user_id: string, user: any, token: string): Observable<boolean> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }

        return this.http.put<boolean>(`${this.apiUrlBase}/users/${user_id}`, user, { headers });
    }

    deleteUserData(id: string, token: string): Observable<Product> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }

        return this.http.delete<Product>(`${this.apiUrlBase}/users/${id}`, { headers });
    }

    // Notification Operations
    addNotificationData(token: string, notification: NotificationData): Observable<NotificationData> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.post<NotificationData>(`${this.apiUrlBase}/notifications`, notification, { headers });
    }

    getNotificationsData(token: string,): Observable<NotificationResponse[]> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.get<NotificationResponse[]>(`${this.apiUrlBase}/notifications`, { headers });
    }

    updateNotificationData(token: string, notification_id: string, notification: NotificationResponse): Observable<boolean> {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return this.http.put<boolean>(`${this.apiUrlBase}/notifications/${notification_id}`, notification, { headers });
    }
}
