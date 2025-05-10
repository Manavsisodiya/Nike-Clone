import { useState, useEffect } from "react";
import axios from "axios";
import "./Adorders.css";

function Adorders() {
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
    <div className="orders-container">
      <h2>Orders</h2>
      <hr style={{ height: "3px", width:'92px', marginLeft:'4.24rem', marginTop:'-0.6rem', backgroundColor: "black", border: "none" }}/>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr className="headings">
              <th>No</th>
              <th>Product Name</th>
              <th>Product Image</th>
              <th>Category</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Address</th>
              <th>Delivery</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) =>
              order.products.map((product, pIndex) => (
                <tr key={`${index}-${pIndex}`}>
                  {pIndex === 0 && (
                    <>
                      <td rowSpan={order.products.length}>{index + 1}</td>
                    </>
                  )}
                  <td>{product.name}</td>
                  <td>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="order-product-image"
                    />
                  </td>
                  <td>{product.category}</td>
                  <td>{product.size}</td>
                  <td>{product.quantity}</td>
                  {pIndex === 0 && (
                    <>
                      <td rowSpan={order.products.length}>{order.totalAmount}</td>
                      <td rowSpan={order.products.length}>{order.address}</td>
                    </>
                  )}
                  <td>{new Date(product.arrivingDate).toDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
    </>
  );
}

export default Adorders;
