import { Box, Grid, Pagination, Paper, Typography } from '@mui/material';
import {useEffect } from 'react';
import AppPagination from '../../app/components/AppPagination';
import CheckboxButtons from '../../app/components/CheckboxButtons';
import RadioButtonGroup from '../../app/components/RadioButtonGroup';
import Loading from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from './catalogSlice';
import ProductList from './ProductList';
import ProductSearch from './ProductSearch';

const sortOptions = [
  {value: 'name', name: 'Alphabetical'},
  {value: 'priceDesc', name: 'Price - High to Low'},
  {value: 'priceAsc', name: 'Price - Low to High'},
]

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const {productsLoaded, status, filtersLoaded, brands, types, productParams, metadata} = useAppSelector(state => state.catalog);

  useEffect(() => {
    if(!productsLoaded){
      dispatch(fetchProductsAsync())
    }
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if(!filtersLoaded){
      dispatch(fetchFilters())
    }
  }, [dispatch, filtersLoaded]);

  if (!filtersLoaded) {
    <Loading message="Loading products..."></Loading>;
  }

  return (
    <Grid container columnSpacing ={4}>
      <Grid item xs={3}>
        <Paper sx={{mb:2}}>
         <ProductSearch/>
        </Paper>
        <Paper sx={{mb:2, p:2}}>
         <RadioButtonGroup 
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={e => dispatch(setProductParams({orderBy: e.target.value}))}
            />
        </Paper>
        <Paper sx={{mb:2, p:2}}>
          <CheckboxButtons 
            items={brands} 
            checked={productParams.brands} 
            onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}/>
        </Paper>
        <Paper sx={{mb:2, p:2}}>
        <CheckboxButtons 
            items={types} 
            checked={productParams.types} 
            onChange={(items: string[]) => dispatch(setProductParams({types: items}))}/>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3}/>
      <Grid item xs={9} sx={{mb:2}}>
        {metadata && <AppPagination 
          metadata={metadata!}
          onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
          /> }
      </Grid>
    </Grid>
  );
}
