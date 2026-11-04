export interface Customer {
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    city: string;
    signup_date: string;
    loyalty_tier: "Bronze" | "Silver" | "Gold" | "Platinum";
    customer_segment: string;
}

export interface CustomerDataResponse {
    data: Customer[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}