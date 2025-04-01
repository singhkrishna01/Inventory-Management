import React from 'react';
import '../CustomerPages_css/ProductList.scss';
import { Product } from '../CustomerPages/Product';

const ProductList = ({ products }) => { // Accept products as a prop
  if (!products || products.length === 0) return <div>No products available.</div>;

  return (
    <div className="items">
      {products.map((currpro) => (
        <Product key={currpro.id || currpro.name} {...currpro} />
      ))}
    </div>
  );
};

export default ProductList;
