import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login_signup_css/Footer.scss';
import { FaLinkedinIn } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const clickHandler = () => {
    navigate('/ContactUs');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Simulate sending email to the backend
    console.log(`Subscribing with email: ${email}`);
    setMessage('Thank you for subscribing!');
    setEmail(''); // Clear the email input
  };

  return (
    <div className="footerr">
      <div className="footer-content">
        <div className="contact-short">
          <div className="footer-text">
            <div className='footer-text-inner'>Ready to get started?</div>
            {/* <div className='footer-text-inner'>Talk to us today</div> */}
          </div>
          <div className='footer-button'>
            {/* <div className="btn" onClick={clickHandler}>hello</div> */}
            <button type="submit" className="hero-get-started-button" onClick={clickHandler}>Signup Now</button>
          </div>
        </div>
      </div>
      <footer className='main-footer'>
        <div className="brand-name">
          <div className="brand">InventoryPro</div>
          <p>Experience refined elegance with our minimalist brand.</p>
        </div>
        <div className="subscribe">
          <div className="brand">Subscribe to get important updates</div>
          <form className='formspree' onSubmit={handleSubscribe}>
            <input
              className='email-box'
              type="email"
              placeholder='YOUR EMAIL'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="hero-get-started-button">Subscribe</button>
          </form>
          {message && <p className="subscribe-message">{message}</p>}
        </div>
        <div className="social-media">
          <div className="brand">Follow Us</div>
          <div className="social-icons">
            <a href='https://www.linkedin.com/in/krishnasingh20/' className="social-icon">
              <FaLinkedinIn size={28} color='#7a39fa' />
            </a>
            <a href='https://x.com/Krishnasingh_99' className="social-icon">
              <BsTwitterX size={28} color='#7a39fa' />
            </a>
            <a href='#' className="social-icon">
              <SiDiscord size={28} color='#7a39fa' />
            </a>
          </div>
        </div>
        <div className="contacting">
          <div className="brand">Call Us</div>
          <div className="number">+91 6307533030</div>
        </div>
      </footer>
      <div className="last">
        <div className="copyright">
          @{new Date().getFullYear()} InventoryPro. All Rights Reserved
        </div>
        <div className="privacy">
          <div>PRIVACY POLICY</div>
          <div>TERMS & CONDITIONS</div>
        </div>
      </div>
    </div>
  );
};
