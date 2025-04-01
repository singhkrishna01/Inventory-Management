import React, { createContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [error, setError] = useState('');
    const isInitialMount = useRef(true); // To prevent saving to localStorage on initial load

    // Load cart data from localStorage when the component mounts
    useEffect(() => {
        try {
            const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const savedTotalBill = JSON.parse(localStorage.getItem('totalBill')) || 0;
            setCartItems(savedCartItems);
            setTotalBill(savedTotalBill);
        } catch (error) {
            console.error('Error loading cart data from localStorage:', error);
        }
    }, []);

    // Save cart data to localStorage whenever it changes, but not on initial mount
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            try {
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                localStorage.setItem('totalBill', JSON.stringify(totalBill));
            } catch (error) {
                console.error('Error saving cart data to localStorage:', error);
            }
        }
    }, [cartItems, totalBill]);

    // Add item to cart
    const addItemToCart = (newItem) => {
        setError(''); // Clear previous error
        const existingItem = cartItems.find(item => item.name === newItem.name);

        if (existingItem) {
            const updatedQuantity = existingItem.orderQuantity + newItem.orderQuantity;

            // Check if the updated quantity exceeds the available stock
            if (updatedQuantity > newItem.availableQuantity) {
                setError(`Only ${newItem.availableQuantity} of ${newItem.name} are available.`);
                return;
            }

            // Update the existing item's quantity
            const updatedItems = cartItems.map(item =>
                item.name === newItem.name
                    ? { ...item, orderQuantity: updatedQuantity }
                    : item
            );
            setCartItems(updatedItems);
        } else {
            // New item, check if it exceeds available stock
            if (newItem.orderQuantity > newItem.availableQuantity) {
                setError(`Only ${newItem.availableQuantity} of ${newItem.name} are available.`);
                return;
            }

            // Add the new item to the cart
            setCartItems(prevItems => [...prevItems, { ...newItem, isOutOfStock: false }]);
        }
    };

    // Remove item from cart
    const removeItemFromCart = (itemName) => {
        setCartItems(prevItems => {
            const itemToRemove = prevItems.find(item => item.name === itemName);
            if (itemToRemove) {
                return prevItems.filter(item => item.name !== itemName);
            }
            return prevItems;
        });
    };

    // Update item in cart
    const updateCartItem = (updatedItem) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.name === updatedItem.name
                    ? { ...item, ...updatedItem }
                    : item
            )
        );
    };

    // Calculate total bill dynamically whenever cart items change
    useEffect(() => {
        const newTotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.orderQuantity,
            0
        );
        setTotalBill(newTotal);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItemToCart,
                removeItemFromCart,
                updateCartItem,
                totalBill,
                error,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
