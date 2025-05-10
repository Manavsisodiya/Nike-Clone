import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topSales, setTopSales] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch Dashboard Summary
  useEffect(() => {
    axios.get("http://localhost:5000/dashboard/summary")
      .then(response => {
        setTotalRevenue(response.data.totalRevenue || 0);
        setTotalOrders(response.data.totalOrders || 0);
      })
      .catch(error => console.error("Error fetching summary data:", error));
  }, []);

  // Fetch Monthly Revenue Data
  useEffect(() => {
    axios.get("http://localhost:5000/dashboard/monthly-revenue")
      .then(response => {
        console.log("Monthly Revenue Data:", response.data); // Debugging
        setMonthlyRevenue(response.data);
      })
      .catch(error => console.error("Error fetching monthly revenue:", error));
  }, []);

  // Fetch Top Sales Data
  useEffect(() => {
    axios.get("http://localhost:5000/dashboard/top-sales")
      .then(response => setTopSales(response.data || []))
      .catch(error => console.error("Error fetching top sales:", error));
  }, []);

  // Fetch Recent Orders
  useEffect(() => {
    axios.get("http://localhost:5000/dashboard/recent-orders")
      .then(response => setRecentOrders(response.data || []))
      .catch(error => console.error("Error fetching recent orders:", error));
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="heading">Dashboard</h2>
      <hr style={{ height: "3px", width:'154px', marginLeft:'2.5rem', marginTop:'-0.6rem', backgroundColor: "black", border: "none" }}/>

      <div className="firstrow">
        <div className="card_trevenue">
          <h6>Total Revenue</h6>
          <h2>₹{totalRevenue ? totalRevenue.toLocaleString() : "0"} <span>INR</span></h2>
        </div>
        <div className="card_trevenue">
          <h6>Total Orders</h6>
          <h2>{totalOrders}</h2>
        </div>
      </div>

      <div className="secondrow">
        <div className="cardrevenue">
          <h5>Revenue</h5>
          <ResponsiveContainer width="100%" height={215}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="cardsales">
          <h5>Top Sales</h5>
          <div className="progress-container">
            {topSales.map((item, index) => (
              <p key={index}>
                {item.name} 
                <span className="progress" style={{ width: `${(item.count / totalOrders) * 100}%` }}></span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="thirdrow">
        <div className="cardOrders">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order Name</th>
                <th># of Products</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.products[0].name}</td>
                  <td>{order.products?.length || 0}</td>
                  <td>{order.totalAmount?.toLocaleString()}</td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
