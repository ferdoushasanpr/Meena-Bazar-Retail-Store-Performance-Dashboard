export interface TransactionData {
    order_item_id: string,
    order_id: string,
    product_id: string,
    quantity: number,
    unit_price: number,
    discount_amount: number,
    line_net_amount: number,
    line_vat_amount: number
}

export interface TransactionDataResponse {
    data: TransactionData[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}