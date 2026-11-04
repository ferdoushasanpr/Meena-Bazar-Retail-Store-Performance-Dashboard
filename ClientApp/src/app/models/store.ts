export interface StoreData {
    store_id: string,
    store_name: string,
    city: string
}

export interface StoreDataResponse {
    data: StoreData[],
    pageNumber: number,
    pageSize: number,
    totalRecords: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}