import React, { useContext, useEffect } from 'react';
import OrdersContext from '../ContextApi/OrderContext';
import '../AdminPages_css/Order.css';

const Order = () => {
    const { orders, fetchOrders, updateOrderStatus, deleteOrder } = useContext(OrdersContext);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        // If the new status is "Delivered", update stock quantity
        if (newStatus === 'Delivered') {
            const order = orders.find((o) => o._id === orderId);
            if (order) {
                console.log(order);
                await updateStockQuantity(order.productId, order.orderQuantity);
            }
        }

        // Update the order status in the backend
        await updateOrderStatus(orderId, newStatus);
    };

    const updateStockQuantity = async (productId, quantity) => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}/update-stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity, productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock. Please try again.');
            }

            console.log('Stock updated successfully.');
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleCancellationAction = async (orderId, action) => {
        const newStatus = action === 'approve' ? 'Canceled' : 'Order Placed'; // Revert to "Order Placed" if rejected
        await updateOrderStatus(orderId, newStatus); // Update the order status in the backend
    };

    const handleRemoveOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            await deleteOrder(orderId); // Call the context method to delete the order
            fetchOrders(); // Refresh the list after deletion
        }
    };

    if (orders.length === 0) {
        return <p>No orders available.</p>;
    }

    return (
        <div className="order-list-container">
            <h1 className="order-list-title">All Orders</h1>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Address</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                        <th>Order Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>
                                {order.imageUrls?.length > 0 ? (
                                    <img
                                        src={order.imageUrls[0]}
                                        alt={order.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.orderQuantity}</td>
                            <td>₹{order.totalPrice}</td>
                            <td>
                                {order.address.street}, {order.address.city}, {order.address.state}{' '}
                                - {order.address.postalCode}, {order.address.country}
                            </td>
                            <td>{order.phoneNumber}</td>
                            <td>
                                {order.status === 'Canceled' ? (
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>Canceled</span>
                                ) : order.status === 'Cancellation Requested' ? (
                                    <span style={{ color: 'orange' }}>Cancellation Requested</span>
                                ) : order.status === 'Delivered' ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Delivered</span>
                                ) : (
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order._id, e.target.value)
                                        }
                                    >
                                        <option value="Order Placed">Order Placed</option>
                                        <option value="Dispatched">Dispatched</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                )}
                            </td>
                            <td>{order.date}</td>
                            <td>
                                {order.status === 'Cancellation Requested' ? (
                                    <>
                                        <button
                                            className="approve-btn"
                                            onClick={() =>
                                                handleCancellationAction(order._id, 'approve')
                                            }
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() =>
                                                handleCancellationAction(order._id, 'reject')
                                            }
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="remove-btn"
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                        onClick={() => handleRemoveOrder(order._id)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Order;
