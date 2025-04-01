import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../Login_signup_css/ForgotPassword.css'
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password reset link sent to your email.');
                setTimeout(() => navigate('/login'), 2000);  // Redirect after success
            } else {
                toast.error(data.message || 'Failed to send reset link.');
            }
        } catch (error) {
            console.error('Error requesting password reset:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="forgot-password-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="forgot-password-content">
                <h2 className="forgot-password-title">Forgot Password</h2>
                <p className="forgot-password-description">
                    Enter your email address below and we’ll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="forgot-password-input"
                    />
                    <button type="submit" className="forgot-password-button">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
