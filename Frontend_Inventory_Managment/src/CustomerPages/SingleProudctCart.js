import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CustomerPages_css/SingleProductCart.scss';
import { useUser } from '../Login _signup_pages/UserContext';

const SingleProductCart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = useUser(); 
    const { name = '', price = 0, orderQuantity = 1, imageUrls = [], productId } = location.state || {}; // Extract values safely
    const totalPrice = price * orderQuantity;

    // Image carousel logic
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (imageUrls.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
            }, 3000);
            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [imageUrls]);

    // Navigate to the OrderForm page on checkout
    const handleCheckout = () => {
        navigate(`/customer/${userData.id}/orderform`, {
            state: {
                name,
                price,
                orderQuantity,
                productId,
                totalPrice,
                imageUrls
            }
        });
    };

    return (
        <div className="cart-page">
            <h1 className="cart-title">Product Details</h1>
            <div className="cart-container">
                {imageUrls.length > 0 && (
                    <div className="cart-image-carousel">
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`${name} - Image ${currentImageIndex + 1}`}
                            className="carousel-image"
                        />
                    </div>
                )}

                <div className="cart-item">
                    <div className="cart-item-details">
                        <h3>{name}</h3>
                        <p>Quantity: {orderQuantity}</p>
                        <p>Price per item: ₹{price}</p>
                        <p className="cart-item-total">
                            Total Price: <strong>₹{totalPrice}</strong>
                        </p>
                    </div>
                </div>
                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total-row">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                </button>
                <button className="back-button" onClick={() => navigate(-1)}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default SingleProductCart;
