import React, { useEffect, useState } from "react";
import axios from "axios";
import Nike from './images/nike.png'
import Cart from './images/shopping-bag.png'
import './Checkout.css'
import { useLocation,useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import CheckoutButton from "./CheckoutButton";

function Checkout({}) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(""); // Fixed variable name for clarity
  const [lastName, setLastName] = useState(""); // Fixed variable name for clarity
  const [address, setAddress] = useState(""); // Fixed variable name for clarity
  const [email, setEmail] = useState(""); // Fixed variable name for clarity
  const [phoneNo, setPhoneNo] = useState(""); // Fixed variable name for clarity
  const location = useLocation();
  const { subtotal, deliveryFee, totalPrice, estimatedArrival } = location.state || {};
  const [cartItems, setCartItems] = useState([]); // Fixed variable name for clarity


  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cart");
      setCartItems(response.data); // Ensure data is an array
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  //For SubMitting the order details
  const handleOrderSubmit = async () => {
    if (!firstName || !lastName || !address || !email || !phoneNo) {
      alert("Please fill in all required fields.");
      return;
    }
    /**For converting the price into rupees format instead of this:8743 to Rs 8,743.00 */
    const pricefinal=formatPrice(totalPrice);

    const orderData = {
      firstname: firstName,
      lastname: lastName,
      address: address,
      email: email,
      phoneno: phoneNo,
      products: cartItems.map((product) => ({
        name: product.name,
        category: product.category,
        size: product.size,
        quantity: product.quantity,
        mrp: product.price,
        arrivingDate: estimatedArrival,
        imageUrl:product.image
      })),
      totalAmount: pricefinal,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/orders", orderData);
      if (response.status === 201) {
        alert("Order placed successfully!");
        navigate("/orders")
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  

  return (
    <div>

      <div className="navbar_logo">
        <img src={Nike} alt="nike" className="logonike"></img>
        <img src={Cart} alt="cart" className="logocart"></img>
      </div>
      <div className="containered">
        <div className="delivery2">
          <p style={{ marginTop: '5rem', fontSize: '1.7rem', }}>Delivery</p>
          <p className="para">Customs regulation for India require a copy of the recipient's KYC.<strong>The address on the KYC needs to match the shipping address.</strong>The KYC will be stored securely and used solely for the purpose of clearing customs (including sharing it with customs officials) for all orders and returns. If your KYC does not match your shipping address, please click the link for more information.</p>
           <h5>Enter your name and address: </h5>
           <Form.Control className="firstch" type="text" placeholder="First Name" required onChange={(e)=>setFirstName(e.target.value)}></Form.Control>
           <Form.Control className="lastch" type="text" placeholder="Last Name" required onChange={(e)=>setLastName(e.target.value)}></Form.Control>
           <Form.Control className="address" type="text" placeholder="Apt/House Number,City,Pincode" required onChange={(e)=>setAddress(e.target.value)}></Form.Control>
           <h5 style={{marginTop:'2rem'}}>What's your contact information: </h5>
           <Form.Control className="emailch" type="email" placeholder="Email" required onChange={(e)=>setEmail(e.target.value)}></Form.Control>
           <Form.Control className="phonech" type="text" placeholder="Phone Number" required onChange={(e)=>setPhoneNo(e.target.value)}></Form.Control>
          <p className="phonetxt"> A carrier might contact you to confirm delivery.</p>
        </div>

        <div className="summary2">
          <p style={{ marginTop: '5rem', fontSize: '1.5rem', }}>Order Summary</p>
          <p className="subtotalch">Subtotal<span>₹ {subtotal}</span></p>
          <p className="deliverych">Delivery & Handling <span>₹ {deliveryFee}</span></p>
          <hr />
          <p className="totalch"  >Total <span>₹ {totalPrice}</span></p>
          <hr style={{ marginBottom: '3rem' }} />




          <p className="arrivaldate">Arrives {estimatedArrival}</p>
          {cartItems.map((product) => (
            <div key={product._id} className="cart_itemsch">
              <img src={product.image} alt={product.name} className="cart_imagech" />
              <p className="namech">{product.name}</p>
              <p className="pricech">MRP: {product.price}</p>
              <p className="categorych">{product.category}</p>
              <p className="qtych">Qty {product.quantity}</p>
              <p className="sizech">Size UK {product.size}</p>
            </div>
          ))}

          <CheckoutButton  amount={totalPrice} onPaymentSuccess={handleOrderSubmit}></CheckoutButton>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
