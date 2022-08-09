export interface MetaData{
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export class PaginatedResponse<T>{
    items: T;
    metadata: MetaData;

    constructor(items: T, metadata: MetaData){
        this.items = items;
        this.metadata = metadata;
    }
}