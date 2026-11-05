export interface Order {
    order_id: string;
    order_datetime: string;
    store_id: string;
    customer_id: string;
    order_channel: string;
    payment_method: string;
    order_status: string;
    subtotal: number;
    discount_total: number;
    vat_total: number;
    delivery_fee: number;
    total_amount: number;
}

export interface OrderDataResponse {
    data: Order[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}