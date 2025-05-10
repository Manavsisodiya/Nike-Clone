import React, { useEffect, useState } from "react";
import "./Checkout.css";

const CheckoutButton = ({ amount, onPaymentSuccess }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true); // Set state when script loads
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK is still loading. Please wait.");
      return;
    }

    try {
      // Request order creation from the backend
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const order = await response.json();

      // Razorpay payment options
      const options = {
        key: "rzp_test_Dy0R4PGSU8yuMl", // Replace with your Razorpay Test Key ID
        amount: order.amount,
        currency: "INR",
        name: "Nike Clone",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log("Payment Response: ", response);

            const verifyRes = await fetch("http://localhost:5000/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment Successful!");
              onPaymentSuccess();
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Something went wrong during payment verification");
          }
        },
        theme: { color: "#3399cc" },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return <button className="btnpay" onClick={handlePayment} disabled={!razorpayLoaded}>Pay Now</button>;
};

export default CheckoutButton;
