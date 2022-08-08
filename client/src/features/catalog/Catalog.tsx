import {useEffect } from 'react';
import Loading from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchProductsAsync, productSelectors } from './catalogSlice';
import ProductList from './ProductList';

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const {productsLoaded, status} = useAppSelector(state => state.catalog);

  useEffect(() => {
    if(!productsLoaded){
      dispatch(fetchProductsAsync())
    }
  }, [productsLoaded, dispatch]);

  if (status.includes('pending')) {
    <Loading message="Loading products..."></Loading>;
  }
  return (
    <>
      <ProductList products={products} />
    </>
  );
}
