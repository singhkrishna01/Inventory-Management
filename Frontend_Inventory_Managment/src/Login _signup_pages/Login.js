import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import image1 from '../images/image2.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons for password visibility toggle
import '../Login_signup_css/Login.scss';

function Login() {
    // State variables for user input and error handling
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate(); // Hook for programmatic navigation
    const { setUserData } = useUser(); // Context for setting user data globally

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents page reload

        // Validate input fields
        if (!email || !password) {
            setErrorMessage('Please enter both email and password.');
            toast.error('Please enter both email and password.');
            return;
        }

        try {
            // API request to authenticate user
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Show success toast notification
                toast.success(`Login successful: ${data.message}`, {
                    autoClose: 1000,
                    onClose: () => {
                        setUserData(data.user); // Store user data in context
                        // Redirect based on user type
                        if (data.user.userType === 'admin') {
                            navigate(`/admin/${data.user.id}/dashboard`);
                        } else if (data.user.userType === 'customer') {
                            navigate(`/customer/${data.user.id}/home`);
                        }
                    }
                });
            } else {
                // Show error message if login fails
                setErrorMessage(data.message || 'Login failed. Please try again.');
                toast.error(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again later.');
            toast.error('An error occurred. Please try again later.');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className='main-login-new'>
            <div className="login-page">
                {/* Toast container for showing notifications */}
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                
                {/* Left section with image and title */}
                <div className="left-side">
                    <h1>Inventory Management System</h1>
                    <img src={image1} alt="Inventory" className="inventory-image" />
                </div>

                {/* Right section with login form */}
                <div className="right-side">
                    <h2>Welcome</h2>

                    {/* Login form */}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="email-input"
                        />
                        
                        {/* Password input with visibility toggle */}
                        <div className="password-input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="password-input"
                            />
                            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        
                        {/* Forgot password link */}
                        <div className="forgot-password">
                            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>

                    {/* Display error message if login fails */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {/* Signup link */}
                    <div className="footer">
                        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
