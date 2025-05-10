import React, { useState } from "react";
import './Signin.css'
import Nike from './images/nike.png'
import Jordan from './images/jordan.png'
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

function Signin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setisRegistered] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      alert("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.existingUser) {
          setisRegistered(true);
        }
        else {
          navigate("/SignMember", { state: { email } });
        }
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, }),
      });

      const data = await response.json();

      if (data.success) {
        
          sessionStorage.setItem("userFirstName", JSON.stringify(data.user2));
          sessionStorage.setItem("isAdmin", JSON.stringify(data.isAdmin));

          if (data.isAdmin) {
            alert("Login successful,Welcome Admin!");
            navigate("/Admin"); // Send admin to Admin.js
          } else {
            alert("Login successful,Welcome User!");
            navigate("/"); // Regular user
          }
        

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <>
      <div className="section3">
        <div className="logo-section">
          <img src={Nike} alt="nike"></img>
          <img src={Jordan} alt="jordan"></img>
        </div>
        <h2>Enter your email to join us or sign <br></br>in.</h2>

        <Form.Control className="form3" type="email" placeholder="Email*" required value={email} onChange={(e) => setEmail(e.target.value)} />

        {isRegistered && (
          <Form.Control
            className="form3"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}


        <h5>By continuing, I agree to Nike's Privacy Policy<br /> and Terms of Use.</h5>

        {isLoading ? (
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden"></span>
          </Spinner>
        ) : (
          isRegistered ? (
            <button className="continue" onClick={loginUser}>Login</button>
          ) : (
            <button className="continue" onClick={sendOtp}>Continue</button>
          )
        )}
      </div>
    </>
  );
}

export default Signin;