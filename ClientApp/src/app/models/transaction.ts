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