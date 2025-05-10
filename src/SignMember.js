import React, { useState } from "react";
import './SignMember.css'
import Nike from './images/nike.png'
import Jordan from './images/jordan.png'
import Refresh from './images/refresh.png'
import { Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import { useLocation, useNavigate } from "react-router-dom";

export default function SignMember() {
  //Code for getting the email passed in signin..
  const location = useLocation();
  const email = location.state?.email || "No Email Provided";
  //to pass the email to home page after successful registration.
  const navigate=useNavigate();

  const[code,setcode]=useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [preference, setPreference] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  
    const sendOtp2 = async () => {
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
          setIsLoading(false);
          alert("OTP has been Sent again..")
        } else {
        setIsLoading(false);
        alert("Failed to send OTP again..");
      }
    } catch (error) {
        setIsLoading(false);
        console.error("Error sending OTP again:", error);
        alert("Something went wrong!");
      } 
      
    };
  
    const Validateotp =async()=>{
      if (!code) {
        alert("Please Enter the Otp.");
        return;
      }
      try {
        const response =await fetch("http://localhost:5000/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            firstName,
            surname,
            password,
            preference,
            dob:`${dob.day}/${dob.month}/${dob.year}`,
            email,
            userOtp: code }),
        });
    
        const data =await response.json();
        if (data.success) {
          alert("OTP Verified! ,You Have Successfully Sign In.");
          sessionStorage.setItem("userFirstName", firstName);
          navigate("/");

        } else {
          alert(data.message); // OTP expired or invalid
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Something went wrong!");
      }
    
    };


  
return(
    <>
    <div className="section4">
      <div className="logo_section2">
        <img src={Nike} alt="nike"></img>
        <img src={Jordan} alt="jordan"></img>
      </div>
      <h2>Now let's make you a Nike<br></br>Member.</h2>
      <h5>We've sent a code to<br></br>{email}</h5>
      
      {isLoading && (
                <Spinner animation="border" role="status" className="loading-spinner2">
                  <span className="visually-hidden"></span>
                </Spinner>
      )
      }
      <Form.Control className="Code" type="text" placeholder="Code*" required onChange={(e)=>setcode(e.target.value)} ></Form.Control>
      <img onClick={sendOtp2} src={Refresh} alt="refreshlogo" className="refreshlogo"></img>

      <div className="namesection">  
        <Form.Control className="firstname" type="text" placeholder="First Name*" required onChange={(e)=>setFirstName(e.target.value)}></Form.Control>
        <Form.Control className="surname" type="text" placeholder="Surname*" required onChange={(e)=>setSurname(e.target.value)}></Form.Control>
      </div>
      <Form.Control className="password" type="password" placeholder="Password*" required onChange={(e)=>setPassword(e.target.value)}></Form.Control>
      <Form.Select className="preference"  required onChange={(e)=>setPreference(e.target.value)}>
        <option value="" disabled selected style={{color:"grey"}}>Shopping Preference*</option>
        <option value="Men's">Men</option>
        <option value="Women's">Women's</option>
      </Form.Select>

      <h6 className="dobtitle">Date of Birth</h6>
      <div className="dobsection">  
        <Form.Control className="day" type="text" placeholder="Day*" required onChange={(e) => setDob({ ...dob, day: e.target.value })}></Form.Control>
        <Form.Control className="month" type="text" placeholder="Month*" required onChange={(e) => setDob({ ...dob, month: e.target.value })}></Form.Control>
        <Form.Control className="year" type="text" placeholder="Year*" required onChange={(e) => setDob({ ...dob, year: e.target.value })}></Form.Control>
      </div>
      <h6 className="dobend">Get a Nike Member Reward on your birthday.</h6>
      
      <div className="checkbox_container" >
        <input type="checkbox" id="newsletter" className="checkbox"></input>
        <h5>Sign up for emails to get updates from Nike on<br/>products,offers and your Member benefits.</h5>
      </div>
      <div className="checkbox_container2" >
        <input type="checkbox" id="newsletter" className="checkbox"></input>
        <h5>I agree to Nike's Privacy Policy. and Terms of Use.</h5>
      </div>

      <button className='account' onClick={Validateotp} >Create Account</button>
      </div>
        </>
  );

}
