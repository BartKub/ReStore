import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();


export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) =>{
        try{
            return await agent.Catalog.list();
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

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
    }),
    reducers: {},
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
