import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Login_signup_css/PasswordReset.css';

function PasswordReset() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!newPassword) {
            toast.error('Please enter a new password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Password reset successful: ${data.message}`, {
                    autoClose: 1000,
                    onClose: () => navigate(`/login`),
                });
            } else {
                toast.error(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="reset-password-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="reset-password-content">
                <h2 className="reset-password-title">Reset Password</h2>
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="password-input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="reset-password-input"
                        />
                        <div className="toggle-password">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={togglePasswordVisibility}
                                className="show-password-checkbox"
                            />
                            <label htmlFor="showPassword" className="show-password-label">Show Password</label>
                        </div>
                    </div>
                    <button type="submit" className="reset-password-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default PasswordReset;
