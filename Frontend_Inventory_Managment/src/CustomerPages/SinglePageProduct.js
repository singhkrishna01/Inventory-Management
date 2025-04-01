// SinglePageProduct.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbReplace } from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { MyImage } from './MyImage';
import '../CustomerPages_css/SinglePageProduct.scss';
import { useUser } from '../Login _signup_pages/UserContext';

const SinglePageProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userData } = useUser();
    const [orderQuantity, setOrderQuantity] = useState(1);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/product/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (value > 0 && value <= product.quantity) {
            setOrderQuantity(value);
        } else {
            setOrderQuantity(1);
        }
    };

    const handleNavigateToCart = () => {
        if (product && userData) {
            navigate(`/customer/${userData.id}/cart`, {
                state: {
                    name: product.name,
                    price: product.price,
                    orderQuantity,
                    availableQuantity: product.quantity,
                    imageUrls: product.imageUrls,
                    description: product.description,
                    productId: product.productId,
                    category: product.category
                }
            });
        }
    };

    if (loading) return <p className="loading-message">Loading product...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className='single-product-data'>
            {product && (
                <div className="single-product-grid">
                    <div className="product-image">
                        <MyImage image={product.imageUrls} />
                    </div>
                    <div className="product-data">
                        <h2 style={{ textTransform: 'uppercase' }}>{product.name}</h2>
                        <p className="product-data-price">
                            MRP: <del>₹{product.price + 250000}</del>
                        </p>
                        <p className="product-data-real-price">
                            Deal of the Day: <span>₹{product.price}</span>
                        </p>
                        <p>{product.description}</p>

                        <div className="product-data-warranty">
                            <div className="product-warranty-data">
                                <FaTruckFast className='warranty-icon' />
                                <p>Free Delivery</p>
                            </div>
                            <div className="product-warranty-data">
                                <TbReplace className='warranty-icon' />
                                <p>10 Days Replacement</p>
                            </div>
                            <div className="product-warranty-data">
                                <MdOutlineHealthAndSafety className='warranty-icon' />
                                <p>2 Years Warranty</p>
                            </div>
                            <div className="product-warranty-data">
                                <FaTruckFast className='warranty-icon' />
                                <p>Fast Delivery</p>
                            </div>
                        </div>

                        <div className="product-data-info">
                            <p>Available: <span>{product.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}</span></p>
                            <p>PRODUCT ID: <span>{product.productId}</span></p>
                        </div>

                        <div className='horizontal-line'></div>

                        {product.quantity > 0 && (
                            <div className="quantity-selector">
                                <label htmlFor="quantity">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={orderQuantity}
                                    min="1"
                                    max={product.quantity}
                                    onChange={handleQuantityChange}
                                    className="quantity-input"
                                />
                            </div>
                        )}

                        {product.quantity > 0 && (
                            <button onClick={handleNavigateToCart} className="navigate-cart-button">
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePageProduct;
