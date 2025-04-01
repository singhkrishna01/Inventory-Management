import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../images/image2.png';
import '../Login_signup_css/Signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'customer', // Default role is set to 'customer'
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecialChar: false,
    isValidLength: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordCriteria({
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasDigit: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*]/.test(value),
        isValidLength: value.length >= 8,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const criteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (!criteriaMet) {
      setError('Please ensure the password meets all criteria.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Network response was not ok');
      
      setSuccess(true);
      setError(null);
      navigate('/verify-otp');
    } catch (error) {
      console.error('Error submitting the form:', error.message);
      setError(error.message || 'Error submitting the form. Please try again.');
      setSuccess(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="signup-main-container">
      <div className="signup-container">
        <div className="signup-left-container">
          <div className="signup-form-container">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2 className="signup-title">Sign Up For Free</h2>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
              </div>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                  className="show-password-checkbox"
                />
                {/* <label htmlFor="showPassword" className="show-password-label">Show Password</label> */}
              </div>
              <div className="input-group">
                {/* <label htmlFor="userType" className="user-type-label">Role</label> */}
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  className="signup-select"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="password-criteria">
                <h4>Password Requirements:</h4>
                <ul className="criteria-list">
                  <li className={passwordCriteria.hasUppercase ? 'criteria-met' : 'criteria-unmet'}>
                    At least 1 uppercase letter (A-Z)
                  </li>
                  <li className={passwordCriteria.hasLowercase ? 'criteria-met' : 'criteria-unmet'}>
                   At least 1 lowercase letter (a-z)
                  </li>
                  <li className={passwordCriteria.hasDigit ? 'criteria-met' : 'criteria-unmet'}>
                    At least 1 number (0-9)
                  </li>
                  <li className={passwordCriteria.hasSpecialChar ? 'criteria-met' : 'criteria-unmet'}>
                    At least 1 special character (e.g., !@#$%^&*)
                  </li>
                  <li className={passwordCriteria.isValidLength ? 'criteria-met' : 'criteria-unmet'}>
                    Minimum length of 8 characters
                  </li>
                </ul>
              </div>
              <button type="submit" className="signup-submit-button">Sign Up</button>
            </form>
            <div className="signup-footer">
              <p>Already have an account? <a href="/login" className="login-link">Log In</a></p>
            </div>
          </div>
        </div>
        <div className="signup-right-container">
          <h2>Inventory Management System</h2>
          <div className="signup-image-container">
            <img src={image1} alt="Inventory" className="signup-image" />
          </div>
        </div>
        {error && <p className="signup-error-message">{error}</p>}
        {success && <p className="signup-success-message">Sign up successful! Check your email for the OTP.</p>}
      </div>
    </div>
  );
};

export default SignUp;
