import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StoreData, StoreDataResponse } from '../models/store';
import { Observable } from 'rxjs';
import { TransactionDataResponse } from '../models/transaction';
import { Customer, CustomerDataResponse } from '../models/customer';
import { Product, ProductDataResponse } from '../models/product';
import { OrderDataResponse } from '../models/order';

@Injectable({
    providedIn: "root"
})
export class OperationsService {
    private http = inject(HttpClient);
    private readonly apiUrlBase = 'http://localhost:5253';

    // Customer Operations
    addCustomerData(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(`${this.apiUrlBase}/customers`, customer);
    }

    getCustomersData(pageNumber: number, pageSize: number = 10): Observable<CustomerDataResponse> {
        return this.http.get<CustomerDataResponse>(`${this.apiUrlBase}/customers?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    updateCustomerData(customer: Customer, id: string): Observable<Customer> {
        return this.http.put<Customer>(`${this.apiUrlBase}/customers/${id}`, customer);
    }

    deleteCustomerData(id: string): Observable<Customer> {
        return this.http.delete<Customer>(`${this.apiUrlBase}/customers/${id}`);
    }

    // Product Operations
    addProductData(product: Product): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrlBase}/products`, product);
    }

    getProductsData(pageNumber: number, pageSize: number = 10): Observable<ProductDataResponse> {
        return this.http.get<ProductDataResponse>(`${this.apiUrlBase}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    updateProductData(product: Product, id: string): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrlBase}/products/${id}`, product);
    }

    deleteProductData(id: string): Observable<Product> {
        return this.http.delete<Product>(`${this.apiUrlBase}/products/${id}`);
    }

    // Store Operations
    addStoreData(store: StoreData): Observable<StoreData> {
        return this.http.post<StoreData>(`${this.apiUrlBase}/stores`, store);
    }

    getStoresData(): Observable<StoreData[]> {
        return this.http.get<StoreData[]>(`${this.apiUrlBase}/stores`);
    }

    getStoresPaginatedData(pageNumber: number, pageSize: number = 10): Observable<StoreDataResponse> {
        return this.http.get<StoreDataResponse>(`${this.apiUrlBase}/stores/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    updateStoreData(store: StoreData, id: string): Observable<StoreData> {
        return this.http.put<StoreData>(`${this.apiUrlBase}/stores/${id}`, store);
    }

    deleteStoreData(id: string): Observable<StoreData> {
        return this.http.delete<StoreData>(`${this.apiUrlBase}/stores/${id}`);
    }

    // Order Operations
    getOrdersData(pageNumber: number, pageSize: number = 10): Observable<OrderDataResponse> {
        return this.http.get<OrderDataResponse>(`${this.apiUrlBase}/sales?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    // Transactions Operations
    getTransactionsData(pageNumber: number, pageSize: number = 10): Observable<TransactionDataResponse> {
        return this.http.get<TransactionDataResponse>(`${this.apiUrlBase}/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }
}
