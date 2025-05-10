import NavbarEx from "./Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders") // Fetch orders from backend
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  return (
    <>
      <NavbarEx />
      <div className="orderscontain">
        <h3>Orders</h3>
        <div className="orders_details">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="personal_info">
                <h5>Order #{index + 1}</h5>
                <p className="order_address">Address: {order.address}</p>
                <p className="order_finalamt">Total Price : {order.totalAmount}</p>

                {order.products.map((product, pIndex) => (
                  <li key={pIndex} className="order_card">
                    <p className="order_arrival">Arriving: {new Date(product.arrivingDate).toDateString()}</p>
                    <img src={product.imageUrl} alt={product.name} className="order_image" />
                    <p className="order_name">{product.name} </p>
                    <p className="order_category">{product.category}</p>
                    <p className="order_size">Size: {product.size}</p>
                    <p className="order_qty">Qty: {product.quantity}</p>
                    <p className="order_price">Price:{product.mrp}</p>
                  </li>
                ))}

                <hr className='hr2' style={{height:'4px'}}></hr>

              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Orders;
