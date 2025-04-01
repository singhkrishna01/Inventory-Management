// CustomerContext.js
import React, { createContext, useEffect, useState } from 'react';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Function to remove a product
  const removeProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/remove`, { // Assuming your endpoint is set to handle removal via POST
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }), // Send product ID in the body
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Update the products state to remove the deleted product
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };


  const updateProduct = async (productId, updatedProduct) => {
    console.log(productId);
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'PUT', // Use PUT method for updating a product
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct), // Send updated product details in the body
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();
      // Update the products state with the modified product
      setProducts(products.map(product => (product._id === productId ? data.product : product)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CustomerContext.Provider value={{ products, loading, error, removeProduct,updateProduct }}>
      {children}
    </CustomerContext.Provider>
  );
};
