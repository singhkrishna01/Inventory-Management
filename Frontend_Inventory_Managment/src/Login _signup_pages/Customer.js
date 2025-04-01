import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaUser, FaShoppingCart, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useUser } from './UserContext';
import { ToastContainer } from 'react-toastify';
import '../CustomerPages_css/Customer.css';

function Customer() {
    const { userData, logout } = useUser();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth > 768);
            setIsSmallScreen(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to the login page after logout
    };

    if (!userData) {
        return <p>No user data available. Please log in.</p>;
    }

    return (
        <div className="user-portal">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <h2 className="sidebar-title">USER PORTAL</h2>
                <ul className="sidebar-menu">
                    <li className="menu-item">
                        <NavLink to="home" className={({ isActive }) => (isActive ? 'active' : 'link')}>
                            <FaHome className="icon" /> HOME
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="product" className={({ isActive }) => (isActive ? 'active' : 'link')}>
                            <FaBox className="icon" /> PRODUCTS
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="orders" className={({ isActive }) => (isActive ? 'active' : 'link')}>
                            <FaUser className="icon" /> ORDERS
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="account" className={({ isActive }) => (isActive ? 'active' : 'link')}>
                            <FaUser className="icon" /> ACCOUNT INFO
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="cart" className={({ isActive }) => (isActive ? 'active' : 'link')}>
                            <FaShoppingCart className="icon" /> CART
                        </NavLink>
                    </li>
                </ul>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" /> Logout
                </button>
            </aside>

            {isSmallScreen && (
                <nav className="navbar">
                    <button className="navbar-toggle-btn" onClick={toggleSidebar}>
                        <FaBars className="hamburger-icon" />
                    </button>
                    <span className="portal-name">USER PORTAL</span>
                </nav>
            )}

            <div className={`main-content ${isSidebarOpen && isSmallScreen ? 'content-blur' : ''}`}>
                <Outlet />
            </div>

            <ToastContainer />
        </div>
    );
}

export default Customer;
