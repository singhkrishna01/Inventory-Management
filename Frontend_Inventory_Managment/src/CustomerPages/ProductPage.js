import React, { useContext, useState, useCallback } from 'react';
import { CustomerContext } from '../ContextApi/CustomerContext';
import ProductList from './ProductList';
import FilterSection from './FilterSection';
import '../CustomerPages_css/ProductPage.scss';
import Loading from '../Login _signup_pages/Loading';

const ProductPage = () => {
  const { products, loading, error } = useContext(CustomerContext);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilter = useCallback((filteredItems) => {
    setFilteredProducts(filteredItems);
  }, []); // Memoize this function

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-main-sec">
      <div className="filter-section">
        <FilterSection items={products} onFilter={handleFilter} />
      </div>
      <section className='product-view-sort'>
        <div className="feature-pro">
          <ProductList products={filteredProducts} />
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
