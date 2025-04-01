import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import '../Login_signup_css/User.css';
import { useUser } from './UserContext';

import { useNavigate } from 'react-router-dom';

function Admin() {
    const { userData, logout } = useUser();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate(); // For navigation

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout(); // Clear user data and trigger toast
        navigate('/login'); // Redirect to login page
    };

    if (!userData) {
        return <p>No user data available.</p>;
    }

    return (
        <div className="admin-portal">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <h2 className="admin-sidebar-title">ADMIN PORTAL</h2>
                <ul className="admin-sidebar-menu">
                    <li className="admin-menu-item">
                        <NavLink
                            to="dashboard"
                            className={({ isActive }) => (isActive ? 'admin-active-link' : 'admin-link')}
                        >
                            DASHBOARD
                        </NavLink>
                    </li>
                    <li className="admin-menu-item">
                        <NavLink
                            to="product"
                            className={({ isActive }) => (isActive ? 'admin-active-link' : 'admin-link')}
                        >
                            PRODUCT
                        </NavLink>
                    </li>
                    <li className="admin-menu-item">
                        <NavLink
                            to="order"
                            className={({ isActive }) => (isActive ? 'admin-active-link' : 'admin-link')}
                        >
                            ORDER
                        </NavLink>
                    </li>
                    <li className="admin-menu-item">
                        <NavLink
                            to="stock"
                            className={({ isActive }) => (isActive ? 'admin-active-link' : 'admin-link')}
                        >
                            STOCK
                        </NavLink>
                    </li>
                </ul>
                <button className="admin-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            {/* Navbar for Small Screens */}
            <nav className={`admin-navbar ${isSidebarOpen ? 'open' : ''}`}>
                <button className="navbar-toggle-btn" onClick={toggleSidebar}>
                    <span className="hamburger-icon"></span>
                </button>
                <h2 className="admin-navbar-title">ADMIN PORTAL</h2>
            </nav>

            {/* Main Content */}
            <div className={`admin-main-content ${isSidebarOpen ? 'content-blur' : ''}`}>
                <Outlet />
            </div>
        </div>
    );
}

export default Admin;
