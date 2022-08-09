import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import {useEffect } from 'react';
import Loading from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchFilters, fetchProductsAsync, productSelectors } from './catalogSlice';
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
  const {productsLoaded, status, filtersLoaded, brands, types} = useAppSelector(state => state.catalog);

  useEffect(() => {
    if(!productsLoaded){
      console.log('fetching products');
      dispatch(fetchProductsAsync())
    }
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if(!filtersLoaded){
      dispatch(fetchFilters())
    }
  }, [dispatch, filtersLoaded]);

  if (status.includes('pending')) {
    <Loading message="Loading products..."></Loading>;
  }
  return (
    <Grid container spacing ={4}>
      <Grid item xs={3}>
        <Paper sx={{mb:2}}>
         <ProductSearch/>
        </Paper>
        <Paper sx={{mb:2, p:2}}>
          <FormControl>
            <RadioGroup>
              {sortOptions.map(({value, name}) => 
                <FormControlLabel key={value} value={value} control={<Radio />} label={name} />
              
              )}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{mb:2, p:2}}>
          <FormGroup>
            {brands.map(brand =>(
              <FormControlLabel key={brand} control={<Checkbox />} label={brand} />
            ))}
          </FormGroup>
        </Paper>
        <Paper sx={{mb:2, p:2}}>
          <FormGroup>
            {types.map(type =>(
              <FormControlLabel key={type} control={<Checkbox />} label={type} />
            ))}
          </FormGroup>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3}/>
      <Grid item xs={9}>
        <Box display='flex' justifyContent ='space-between' alignItems='center'>
          <Typography>
            Displaying 1-6 of 20 items
          </Typography>
          <Pagination color ='secondary' size='large' count={10} page={2}/>
        </Box>
      </Grid>
    </Grid>
  );
}
