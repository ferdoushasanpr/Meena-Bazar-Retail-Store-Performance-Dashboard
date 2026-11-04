export interface Product {
    product_id: string;
    product_name: string;
    category: string;
    brand: string;
    unit_cost: number;
    unit_price: number;
    vat_rate: number;
}

export interface ProductDataResponse {
    data: Product[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}