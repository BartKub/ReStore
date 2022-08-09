import {useEffect } from 'react';
import Loading from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchFilters, fetchProductsAsync, productSelectors } from './catalogSlice';
import ProductList from './ProductList';

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const {productsLoaded, status, filtersLoaded} = useAppSelector(state => state.catalog);

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

  if (status.includes('pending')) {
    <Loading message="Loading products..."></Loading>;
  }
  return (
    <>
      <ProductList products={products} />
    </>
  );
}
