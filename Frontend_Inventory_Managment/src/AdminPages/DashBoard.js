import React, { useState, useEffect, useContext } from "react";
import { useUser } from "../Login _signup_pages/UserContext";
import { CountsContext } from "../ContextApi/CountsContext";
import homeImage from "../images/homeimage.png";
import "../AdminPages_css/DashBoard.css";

const Dashboard = () => {
  const { userData } = useUser();
  const { counts, loading, error } = useContext(CountsContext);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStock: 0,
    recentOrders: 0,
  });

  useEffect(() => {
    if (!loading && !error) {
      setDashboardData(prevData => ({
        ...prevData,
        totalOrders: counts.totalOrders,
        totalProducts: counts.totalProducts,
        totalCustomers: counts.totalCustomers,
        lowStock: counts.lowStock, // Set low stock
        recentOrders: counts.recentOrders, // Set recent orders
      }));
    }
  }, [counts, loading, error]);

  if (!userData) {
    return <p>No user data available.</p>;
  }

  if (loading) {
    return <div>Loading counts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">INVENTORY MANAGEMENT SYSTEM</h1>
      </header>

      <main className="dashboard-welcome">
        <div className="welcome-text">
          <h1>
            <span>Welcome {userData.name}</span> to your <b>Inventory Management Dashboard!</b>
          </h1>
        </div>
        <div className="welcome-image">
          <img src={homeImage} alt="Dashboard illustration" />
        </div>
      </main>

      <section className="dashboard-cards">
        <div className="dashboard-card">
          <i className="fas fa-shopping-cart card-icon"></i>
          <h3 className="card-title">Total Orders</h3>
          <p className="card-number">{dashboardData.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <i className="fas fa-boxes card-icon"></i>
          <h3 className="card-title">Total Products</h3>
          <p className="card-number">{dashboardData.totalProducts}</p>
        </div>

        <div className="dashboard-card">
          <i className="fas fa-users card-icon"></i>
          <h3 className="card-title">Total Customers</h3>
          <p className="card-number">{dashboardData.totalCustomers}</p>
        </div>

        <div className="dashboard-card">
          <i className="fas fa-exclamation-triangle card-icon"></i>
          <h3 className="card-title">Low Stock</h3>
          <p className="card-number">{dashboardData.lowStock}</p>
        </div>

        <div className="dashboard-card">
          <i className="fas fa-clock card-icon"></i>
          <h3 className="card-title">Recent Orders</h3>
          <p className="card-number">{dashboardData.recentOrders}</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
