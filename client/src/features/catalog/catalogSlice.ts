import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams; 
    metadata: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams){
    const params = new URLSearchParams();
    params.append('orderBy', productParams.orderBy);
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());

    if(productParams.searchTerm){
        params.append('searchTerm', productParams.searchTerm);
    }
    if(productParams.types && productParams.types.length > 0){
        params.append('types', productParams.types.toString());
    }
    if(productParams.brands && productParams.brands.length > 0){
        params.append('brands', productParams.brands.toString());
    }
    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) =>{
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        try{
            const response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetadata(response.metadata));
            return response.items;
        }catch(error: any){
            return thunkAPI.rejectWithValue({error: error.data});
    }
}
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) =>{
        try{
            return await agent.Catalog.details(productId);
        }catch(error: any){
            return thunkAPI.rejectWithValue({error: error.response.data.description});
    }
}
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) =>{
        try{
            return await agent.Catalog.fetchFilters();
        }catch(error: any){
            return thunkAPI.rejectWithValue({error: error.data});
    }
}
)

function InitParams() {
    return {
        pageNumber:1,
        pageSize:6,
        orderBy: 'name',
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: InitParams(),
        metadata: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams ={...state.productParams, ...action.payload};
        },
        setMetadata: (state, action) => {
            state.metadata = action.payload;
        },
        resetProductParams: (state) => {
            state.productParams = InitParams();
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            productsAdapter.setAll(state, action.payload);
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            productsAdapter.upsertOne(state, action.payload);
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.status = 'idle';
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
        });
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const {setProductParams, resetProductParams, setMetadata} = catalogSlice.actions;
