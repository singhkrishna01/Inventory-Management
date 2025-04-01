import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../ContextApi/CartContext';
import { MdRemoveShoppingCart } from 'react-icons/md';
import '../CustomerPages_css/Cart.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../Login _signup_pages/UserContext';

const CartItem = ({ item, onRemove, onNavigate }) => {
    const { name, price, orderQuantity, imageUrls, availableQuantity, isOutOfStock } = item;
    const totalPrice = price * orderQuantity;
    const stockStatus = isOutOfStock ? "Out of Stock" : availableQuantity > 0 ? "In Stock" : "Out of Stock";

    return (
        <div
            className={`cart-item-card ${isOutOfStock ? 'out-of-stock' : ''}`}
            onClick={() => !isOutOfStock && onNavigate(item)}
            style={{ cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
        >
            <div className="combined-data">
                <img src={imageUrls[0]} alt={name} className="cart-item-image" />
                <div className="cart-item-cell-name">{name}</div>
            </div>
            <div className="cart-item-cell-quantity">{orderQuantity}</div>
            <div className="cart-item-cell-price">₹{price}</div>
            <div className="cart-item-cell-total">₹{totalPrice}</div>
            <div className="cart-item-cell-stock">{stockStatus}</div>
            <div className="cart-item-cell-action">
                <button
                    className="remove-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(name);
                    }}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

const Cart = () => {
    const { cartItems, addItemToCart, removeItemFromCart, totalBill, error, updateCartItem } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = useUser();

    useEffect(() => {
        if (location.state) {
            addItemToCart(location.state);
        }
    }, [location.state]);

    useEffect(() => {
        const checkStockStatus = async () => {
            try {
                const updatedCartItems = await Promise.all(
                    cartItems.map(async (item) => {
                        try {
                            const response = await fetch(`http://localhost:3000/newproduct/${item.productId}`);

                            if (response.ok) {
                                const productDetails = await response.json();
                                const isOutOfStock = productDetails.isOutOfStock <= 0;

                                return {
                                    ...item,
                                    isOutOfStock: productDetails.isOutOfStock,
                                };
                            } else {
                                console.warn(`Failed to fetch data for product ID ${item.productId}`);
                                return { ...item, isOutOfStock: true };
                            }
                        } catch (error) {
                            console.error(`Error fetching stock for item ${item.name}:`, error);
                            return { ...item, isOutOfStock: true };
                        }
                    })
                );

                const hasChanges = updatedCartItems.some(
                    (item, index) => item.isOutOfStock !== cartItems[index].isOutOfStock
                );

                if (hasChanges) {
                    updatedCartItems.forEach((item) => updateCartItem(item));
                }
            } catch (error) {
                console.error('Error during stock status update:', error);
            }
        };

        if (cartItems.length > 0) {
            checkStockStatus();
        }
    }, [cartItems]);

    const handleProductNavigation = (item) => {
        if (item.isOutOfStock) {
            alert("This product is out of stock and cannot be viewed.");
            return;
        }

        navigate(`/customer/${userData.id}/singleproductcart`, {
            state: { ...item },
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <div className="empty-cart-text">No Items in Cart</div>
                <MdRemoveShoppingCart size={70} />
                <button
                    onClick={() => navigate(`/customer/${userData.id}/product`)}
                    className="back-button"
                >
                    Go Back to Product
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            {error && <div className="error-message">{error}</div>}
            <div className="cart-header">
                <div className="cart-header-cell">Product Name</div>
                <div className="cart-header-cell">Quantity</div>
                <div className="cart-header-cell">Price per Item</div>
                <div className="cart-header-cell">Total Price</div>
                <div className="cart-header-cell">Available Stocks</div>
                <div className="cart-header-cell">Actions</div>
            </div>
            {cartItems.map((item, index) => (
                <CartItem
                    key={index}
                    item={item}
                    onRemove={removeItemFromCart}
                    onNavigate={handleProductNavigation}
                />
            ))}
            <div className="total-bill-section">
                Total Bill: <strong>₹{totalBill}</strong>
            </div>
            <button
                onClick={() => navigate(`/customer/${userData.id}/product`)}
                className="back-to-product-button"
            >
                Go Back to Product
            </button>
        </div>
    );
};

export default Cart;
