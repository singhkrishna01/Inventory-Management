import React, { createContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    // Fetch orders from the backend
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getorders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Add a new order
    const addOrder = (newOrder) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
    };

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update order status');
            const updatedOrder = await response.json();

            // Update local state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: updatedOrder.status } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Delete an order
    const deleteOrder = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete the order');

            // Remove the deleted order from the state
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            console.log("Order deleted successfully:", orderId);
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    return (
        <OrdersContext.Provider
            value={{ 
                orders, 
                fetchOrders, 
                addOrder, 
                updateOrderStatus, 
                deleteOrder // Expose deleteOrder
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
};

export default OrdersContext;
