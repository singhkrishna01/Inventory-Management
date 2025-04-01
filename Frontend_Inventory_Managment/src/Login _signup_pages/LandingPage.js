import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/image2.png";
import top from "../images/Container 4.png";
import rightimg from "../images/Image 84.png";
import leftimg from "../images/Image 85.png";
import footerimg from "../images/Container 6.png";
import '../Login_signup_css/LandingPage.css';
import { Footer } from "./Footer";
const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  return (
    <div className="landing-page-container">
      {/* Navbar Section */}
      <nav className="landing-navbar">
        <div className="navbar-logo-container">
          <img src={logo} className="navbar-logo-image" alt="Logo" />
          <h1 className="navbar-title">InventoryPro</h1>
        </div>

        {/* Desktop Navbar Links */}
        {/* <ul className={`navbar-links ${isMenuOpen ? "navbar-links-open" : ""}`}>
          <li><a href="#features" onClick={toggleMenu}>Features</a></li>
          <li><a href="#resources" onClick={toggleMenu}>Resources</a></li>
          <li><a href="#about" onClick={toggleMenu}>About Us</a></li>
          <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
        </ul> */}

        {/* Auth Buttons */}
        <div className="navbar-auth-buttons">
          <button className="navbar-login-button" onClick={handleLogin}>Login</button>
          <button className="navbar-signup-button" onClick={handleSignUpClick}>Sign Up</button>
        </div>

        {/* Hamburger Menu Icon */}
        <div
          className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <span className="mobile-menu-close" onClick={toggleMenu}>
            &times;
          </span>
          {/* <ul className="navbar-links">
            <li><a href="#features" onClick={toggleMenu}>Features</a></li>
            <li><a href="#resources" onClick={toggleMenu}>Resources</a></li>
            <li><a href="#about" onClick={toggleMenu}>About Us</a></li>
            <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
          </ul> */}
          <div className="navbar-auth-buttons">
            <button
              className="navbar-login-button"
              onClick={() => {
                handleLogin();
                toggleMenu();
              }}
            >
              Login
            </button>
            <button
              className="navbar-signup-button"
              onClick={() => {
                handleSignUpClick();
                toggleMenu();
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="landing-hero-section">
        <div className="hero-image-container">
          <img src={top} alt="Hero Image" className="hero-image" />
          <button
            className="hero-get-started-button"
            onClick={handleSignUpClick}
          >
            Get Started
          </button>
          <div className="hero-description">
            <p className="hero-description-text">
              "Welcome to our app, where we strive to enhance your productivity
              and streamline your daily tasks. Discover features tailored to
              meet your needs and help you achieve your goals efficiently."
            </p>
          </div>
        </div>
      </header>

      {/* Other Sections */}
      <div className="landing-section tracking-section">
        <div className="tracking-text-container">
          <h2 className="tracking-title">Real-Time Tracking</h2>
          <p className="tracking-description">
            Monitor your inventory levels in real-time, ensuring you never run
            out of stock.
          </p>
        </div>
        <div className="tracking-image-container">
          <img
            src={rightimg}
            alt="Real-Time Tracking"
            className="tracking-image"
          />
        </div>
      </div>
      <div className="landing-section reports-section reverse">
        <div className="reports-image-container">
          <img src={leftimg} alt="Automated Reports" className="reports-image" />
        </div>
        <div className="reports-text-container">
          <h2 className="reports-title">Automated Reports</h2>
          <p className="reports-description">
            Generate automated reports to gain valuable insights into your
            inventory.
          </p>
        </div>
      </div>
          <Footer/>
    </div>
  );
};

export default LandingPage;
