import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import NavbarEx from './Navbar';
import Hero from './Hero';
import ImageSlider from './ImageSlider';
import HeroSection2 from './HeroSection2';
import Footer from './Footer';
import HeroFotter from './HeroFooter';

import Shop from './Shop'; 
import Jordan from './Jordan';  
import Running from './Running';  
import Football from './Football';
import Basketball from './Basketball';
import Training from './Training';
import Men from './Men';
import Women from './Women';
import Kids from './Kids'
import Favourites from './Favourites'
import Cart from './Cart'
import Signin from './Signin'


import Tennis from './Tennis';
import Skateboard from './Skateboard';
import Kidsproduct from './Kidsproduct';
import SearchResults from './Searchresults';
import SignMember from './SignMember';
import Checkout from './Checkout';
import Admin from './Admin';

import Orders from './Orders';
import Dashboard from './Dashboard';
import Adorders from './Adorders';
import Adproducts from './Adproducts';

function App() {
  // Set active session
  useEffect(() => {
    sessionStorage.setItem("activeSession", "true");
  
    const handleBeforeUnload = async () => {
      sessionStorage.removeItem("activeSession");
  
      try {
        await fetch("http://localhost:5000/clear-cart", { method: "DELETE" });
        await fetch("http://localhost:5000/clear-favorites", { method: "DELETE" });
      } catch (err) {
        console.error("Error clearing cart/favorites on session end", err);
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  

  return (
    <Router>
      <Routes>
        {/* Default route,renders the full layout */}
        <Route path="/" element={
          <div className="App">
            <NavbarEx />
            <Hero />
            <Main />
            <ImageSlider />
            <HeroSection2 />
            <HeroFotter />
            <Footer />
          </div>
        } />

        {/* Route for Shop page ,renders Shop only */}
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Jordan" element={<Jordan />} />
        <Route path="/Running" element={<Running />} />
        <Route path="/Basketball" element={<Basketball />} />
        <Route path="/Football" element={<Football />} />
        <Route path="/Training" element={<Training />} />
        <Route path="/Skateboard" element={<Skateboard />} />
        <Route path="/Kidsproduct" element={<Kidsproduct />} />
        <Route path="/Tennis" element={<Tennis />} />
        <Route path="/Men" element={<Men />} />
        <Route path="/Women" element={<Women />} />
        <Route path="/Kids" element={<Kids />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/Favourites" element={<Favourites />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/SignMember" element={<SignMember />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Admin" element={<Admin/>} >
                    <Route index element={<Dashboard />} /> 
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="Adorders" element={<Adorders />} />
                    <Route path="Adproducts" element={<Adproducts />} />
        </Route>
        
        {/* Signin Routes*/ }
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Cart/Signin" element={<Signin />} />
        <Route path="/Shop/Signin" element={<Signin />} />
        <Route path="/Favourites/Signin" element={<Signin />} />
        <Route path="/Kids/Signin" element={<Signin />} />
        <Route path="/Men/Signin" element={<Signin />} />
        <Route path="/Women/Signin" element={<Signin />} />
        <Route path="/Cart/Signin" element={<Signin />} />
        <Route path="/Football/Signin" element={<Signin />} />
        <Route path="/Running/Signin" element={<Signin />} />
        <Route path="/Training/Signin" element={<Signin />} />
        <Route path="/Tennis/Signin" element={<Signin />} />
        <Route path="/Basketball/Signin" element={<Signin />} />
        <Route path="/Jordan/Signin" element={<Signin />} />
        <Route path="/Skateboard/Signin" element={<Signin />} />
        <Route path="/Search" element={<SearchResults />} />
        <Route path="/Orders" element={<Orders />} />

        

        <Route path="/Men/Football" element={<Football />} />
        <Route path="/Men/Running" element={<Running />} />
        <Route path="/Men/Training" element={<Training />} />
        <Route path="/Men/Tennis" element={<Tennis />} />
        <Route path="/Men/Basketball" element={<Basketball />} />
        <Route path="/Men/Skateboard" element={<Skateboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
