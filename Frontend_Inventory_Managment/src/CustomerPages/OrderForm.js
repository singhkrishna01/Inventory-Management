import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import '../CustomerPages_css/Order.css';
import OrdersContext from '../ContextApi/OrderContext';
import { loadRazorpayScript } from '../utils/rzpUtil';

const OrderForm = () => {
    const location = useLocation();
    const { addOrder } = useContext(OrdersContext); // Use the context's addOrder function

    const { name, price, orderQuantity, totalPrice, imageUrls = [],productId } = location.state || {};
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // Default payment method
    const [captchaInput, setCaptchaInput] = useState('');
    const [captcha, setCaptcha] = useState(generateCaptcha());

    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

    const handleCaptchaChange = (e) => setCaptchaInput(e.target.value);

    function generateCaptcha() {
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    const validateCaptcha = () => captchaInput.toUpperCase() === captcha;

    const handlePayment = async () => {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
              console.error({ type: 'error', message: 'Failed to load Razorpay SDK. Please check your connection.' });
              return;
            }

        if (paymentMethod === 'Razorpay') {
          try {
            // create the Razorpay order on the server
            const response = await fetch('http://localhost:3000/api/payment/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: totalPrice,
                currency: 'INR',
                receipt: `order_${new Date().getTime()}`,
              }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to create Razorpay order.');
            }
      
            const { order } = await response.json();
      
            // Now that we have the order, initiate Razorpay payment
            const razorpayOptions = {
              key: process.env.RZP_KEY_ID,
              amount: totalPrice * 100,
              currency: 'INR',
              name: 'InventryPro',
              description: 'Order Payment',
              order_id: order.id,
              handler: function (response) {
                // You should verify the payment signature in your backend
                fetch('http://localhost:3000/api/payment/verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) {
                        // Payment is successful, submit the order to the backend
                        submitOrder();
                        alert('Payment Successful! Order has been placed.');
                    } else {
                      alert('Payment verification failed.');
                    }
                  })
                  .catch((err) => {
                    alert('Error verifying payment: ' + err.message);
                  });
              },
              prefill: {
                name: name || 'Guest',
                email: 'customer@example.com',
                contact: phoneNumber,
              },
              theme: {
                color: '#F37254',
              },
            };
      
            const razorpayInstance = new window.Razorpay(razorpayOptions);
            razorpayInstance.open();
          } catch (err) {
            console.error('Error initiating Razorpay payment:', err);
            setError('Payment failed. Please try again.');
          }
        } else if (paymentMethod === 'COD') {
            // For COD, directly submit the order without Razorpay
            if (!validateCaptcha()) {
              setError('Invalid CAPTCHA. Please try again.');
              return;
            }
            submitOrder();
          }
        };
      

    const submitOrder = async () => {
        const orderData = {
            name,
            price,
            orderQuantity,
            totalPrice,
            address,
            phoneNumber,
            productId,
            imageUrls,
            date: new Date().toLocaleString(),
            status: paymentMethod === 'COD' ? 'Order Placed (COD)' : 'Order Placed',
        };

        try {
            const response = await fetch('http://localhost:3000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit order: ${response.statusText}`);
            }

            const savedOrder = await response.json();

            addOrder(savedOrder); // Add the new order to the global orders list
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error placing order:', err);
            setError('Failed to place the order. Please try again later.');
        }
    };

    return (
        <div className="order-form">
            <h1 className="order-form-title">Order Form</h1>
            {isSubmitted ? (
                <div className="order-success">
                    <h2>Order Submitted Successfully!</h2>
                    <p>Your order has been placed. We will contact you shortly.</p>
                </div>
            ) : (
                <div className="order-form-container">
                    {error && <p className="order-form-error">{error}</p>}
                    <div className="order-item">
                        {imageUrls.length > 0 && (
                            <img src={imageUrls[0]} alt={name} className="order-item-img" />
                        )}
                        <div className="order-item-details">
                            <h3>{name}</h3>
                            <p>Quantity: {orderQuantity}</p>
                            <p>Price per item: ₹{price}</p>
                            <p className="order-item-total">
                                Total Price: <strong>₹{totalPrice}</strong>
                            </p>
                        </div>
                    </div>
                    <form className="order-form-fields" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="street">Street Address:</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={address.street}
                            onChange={handleAddressChange}
                            required
                        />
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={address.city}
                            onChange={handleAddressChange}
                            required
                        />
                        <label htmlFor="state">State:</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={address.state}
                            onChange={handleAddressChange}
                            required
                        />
                        <label htmlFor="postalCode">Postal Code:</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={address.postalCode}
                            onChange={handleAddressChange}
                            required
                        />
                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={address.country}
                            onChange={handleAddressChange}
                            required
                        />
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                        />
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Razorpay"
                                    checked={paymentMethod === 'Razorpay'}
                                    onChange={() => setPaymentMethod('Razorpay')}
                                />
                                Razorpay
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => setPaymentMethod('COD')}
                                />
                                Cash on Delivery (COD)
                            </label>
                        </div>
                        {paymentMethod === 'COD' && (
                            <>
                                <label htmlFor="captchaInput">Enter CAPTCHA: {captcha}</label>
                                <input
                                    type="text"
                                    id="captchaInput"
                                    value={captchaInput}
                                    onChange={handleCaptchaChange}
                                    required
                                />
                            </>
                        )}
                        <button type="button" onClick={handlePayment} className="order-form-button">
                            Place Order
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrderForm;
