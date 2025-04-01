import React, { useContext } from 'react';
import { CustomerContext } from '../ContextApi/CustomerContext'; // Adjust the path as needed
import '../AdminPages_css/Product.css';
import Loading from '../Login _signup_pages/Loading';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../Login _signup_pages/UserContext';

const Product = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const { products, loading, error, removeProduct } = useContext(CustomerContext); // Destructure removeProduct function from context

  if (loading) return <Loading />; // Show loading message
  if (error) return <p>{error}</p>; // Show error message if any

  const clickHandler = () => {
    navigate(`/admin/${userData.id}/addproduct`);
  };

  const handleUpdate = (productId) => {
    navigate(`/admin/${userData.id}/updateproduct/${productId}`); // Navigate to update page for the specific product
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: 'black' }}>PRODUCT LIST</h1>
      <div>
        <button className='dashboard-btn' onClick={clickHandler}>Add Product</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.productId}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img className='img-pro'
                    src={product.imageUrls[0]} // Display the first image in the array
                    alt={product.name}
                    style={{ width: '50px', height: '50px' }}
                  />
                ) : 'No Image'}
              </td>
              <td>
                <button
                  onClick={() => handleUpdate(product._id)}
                  className="update-btn"
                >
                  Update
                </button>
                <button
                  style={{ backgroundColor: "red" }}
                  onClick={() => removeProduct(product._id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
