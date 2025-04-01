import React, { useEffect, useState } from 'react';
// Ensure the API is correctly imported, or use the fetch directly
// import { fetchProducts } from '../api'; 
// import '../AdminPages_css/Stock.css';

function Stock() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null); // For error handling
  const [loading, setLoading] = useState(true); // To indicate loading state

  useEffect(() => {
    // Function to fetch data from the API
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/products'); // Your API URL
        const result = await res.json();

        // Filter the products based on a 'status' if it exists in the response (if relevant for your case)
        // Since the provided data doesn't contain 'status', this step can be skipped
        setData(result); // Set data directly
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container-main">
      <div className="newcontainer">
        <h1 className="h1">Stocks</h1>
        {loading ? (
          <p>Loading stocks...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product._id}>
                  <td>{product.productId}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.description.slice(0, 100)}...</td> {/* Display first 100 characters */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Stock;
