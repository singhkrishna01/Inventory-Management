import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../Login_signup_css/VerifyOTP.css';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'otp') {
      setOtp(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }

      setSuccess(true);
      setError(null);

      toast.success(`Signup successful: ${data.message}`, {
        autoClose: 1000,
        onClose: () => navigate(`/`),
      });

    } catch (error) {
      console.error('Error verifying the OTP:', error.message);
      setError(error.message || 'Error verifying the OTP. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className='new-verify-container'>
    <div className="verify-otp-container">
      <h2 className="verify-otp-title">Verify Your OTP</h2>
      <p className="verify-otp-description">Please enter the OTP sent to your email address to verify your account.</p>
      <form onSubmit={handleSubmit} className="verify-otp-form">
        <div className="verify-otp-input-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={handleChange}
            required
            className="verify-otp-input"
          />
        </div>
        <div className="verify-otp-input-group">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleChange}
            required
            className="verify-otp-input"
          />
        </div>
        <button type="submit" className="verify-otp-submit-button">
          Verify OTP
        </button>
      </form>
      {error && <p className="verify-otp-error-message">{error}</p>}
      {success && <p className="verify-otp-success-message">OTP verified successfully!</p>}
    </div>


    </div>
  );
};

export default VerifyOTP;
