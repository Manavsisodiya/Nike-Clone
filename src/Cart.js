import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './Cart.css';
import NavbarEx from "./Navbar";
import Footer from "./Footer";
import Delete from "./images/delete.png";
import Add from "./images/add.png";
import Minus from "./images/minus.png";
import Question from "./images/question.png";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const tooltipRef = useRef(null); // Reference for detecting outside click
  const navigate = useNavigate();


  useEffect(() => {
    const isActive = sessionStorage.getItem("userFirstName");
    if (!isActive) {
      // Session ended, clear cart locally
      setCart([]);
    } else {
      fetchCartItems();
    }
  }, []);
  

  const fetchCartItems = async () => {
    const response = await axios.get("http://localhost:5000/cart");
    setCart(response.data);
  };

  const removeFromCart = async (id) => {
    await axios.delete(`http://localhost:5000/cart/${id}`);
    fetchCartItems();
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // **Fixed: Subtotal Calculation**
  const subtotal = cart.reduce((total, item) => {
    // Convert formatted price string (₹18,395.00) to a number
    const price = parseFloat(item.price.replace(/₹|,/g, ''));
    return total + price * item.quantity;
  }, 0);

  // Estimated delivery charge (can be adjusted)
  const deliveryFee = subtotal > 0 ? 250 : 0;

  // Total Price Calculation
  const totalPrice = subtotal + deliveryFee;


  const toggleMessage = () => {
    setShowMessage(!showMessage);
  };

  // Function to detect outside click and close tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowMessage(false);
      }
    };

    if (showMessage) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessage]);

  const generateArrivalDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // Random number between 6 and 10
    today.setDate(today.getDate() + randomDays); // Add random days
  
    // Format the date like "Sat, 6 Apr 2025"
    return today.toLocaleDateString("en-GB", {
      weekday: "short", // Sat
      day: "numeric",   // 6
      month: "short",   // Apr
      year: "numeric",  // 2025
    });
  };
  

  const Checkout2 = () => {
    const estimatedArrival=generateArrivalDate();
    navigate('/Checkout', { state: { subtotal, deliveryFee, totalPrice,estimatedArrival } });
  }

  const updateSize = async (id, size) => {
    try {
      await axios.put(`http://localhost:5000/cart/${id}`, { size }); // Update size in MongoDB
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === id ? { ...item, size } : item
        )
      );
    } catch (error) {
      console.error("Error updating size:", error);
    }
  };



  return (
    <>
      <NavbarEx />
      <div className="container">
        <div className="bag-details">
          <p style={{ marginTop: '1rem', marginLeft: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Bag
          </p>




          {cart.length === 0 ? (
            <p className="emptycart">There are no items in your bag.</p>
          ) : (
            cart.map((product) => (
              <div key={product._id} className="cart-item">
                <img src={product.image} alt={product.name} className="cart-image" />
                <p className="name">{product.name}</p>
                <p className="price">MRP: {product.price}</p>
                <p className="category">{product.category}</p>

                <div className="size-selector">
                  <label>Select Size:</label>
                  <select
                    value={product.size ? product.size : "8"} // Ensure product.size is set
                    onChange={(e) => updateSize(product._id, e.target.value)}
                  >

                    {[5,6,7,8, 9, 10, 11,12,13].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>




                <section className="btn_contain">
                  <button className="delbtn" onClick={() => removeFromCart(product._id)}>
                    <img src={Delete} alt="delete icon" className="deleteicon" />
                  </button>

                  <p className="quantity">{product.quantity}</p>
                  <button className="addbutton" onClick={() => increaseQuantity(product._id)}>
                    <img src={Add} alt="add icon" className="addicon" />
                  </button>
                  <button className="minusbutton" onClick={() => decreaseQuantity(product._id)}>
                    <img src={Minus} alt="minus icon" className="minusicon" />
                  </button>
                </section>

                <hr className="hr1" />
              </div>
            ))
          )}
        </div>


        {/* Tooltip Box Positioned Above the Summary */}
        {showMessage && (
          <div className="tooltip-box" ref={tooltipRef}>
            <p>The subtotal reflects the price of your order,including all duties and taxes.</p>
            <div className="tooltip-arrow"></div> {/* Arrow pointing to the question mark */}
          </div>
        )}
        {/* Summary Section */}
        <div className="summary">
          <p style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Summary</p>
          <p className="subtotal">Subtotal<img onClick={toggleMessage} src={Question} alt="questionmark" /> <span>₹ {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>


          <p className="delivery">Estimated Delivery & Handling <span>₹ {deliveryFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
          <hr />
          <p className="total" >Total <span>₹ {totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
          <hr />
          <button onClick={Checkout2} className="checkout" disabled={cart.length === 0 ? true : false}>Member Checkout</button>
        </div>
      </div>

      <Footer />
    </>
  );
}
