import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import Right from './images/check-button.png'
import NavbarEx from "./Navbar";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get("q");
  const [filteredProducts, setFilteredProducts] = useState([]);
      const [showNotification, setShowNotification] = useState(false);
      const [addedProduct, setAddedProduct] = useState(null); // Store added product details
      const isLoggedIn = sessionStorage.getItem("userFirstName");
      const [cartCount, setCartCount] = useState(0);
          
  

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        // Make a single request to the /search API
        const response = await axios.get(`http://localhost:5000/Search?q=${query}`);
        
        // Set the fetched products to state
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);
  const addToCart = async (product) => {
    if(!isLoggedIn)
    {
        alert("Please SignIn to add items to the bag!")
        window.location.href = "/Signin";
        return;
    }
    try {
        await axios.post("http://localhost:5000/cart", {
            productId: product._id || product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            quantity: 1,
        });

        fetchCartCount();
        
        // Show the notification
        setAddedProduct(product);
        setShowNotification(true);

        // Hide the notification after 3-4 seconds
        setTimeout(() => {
            setShowNotification(false);
            setAddedProduct(null);
        }, 10000);

    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

const fetchCartCount = useCallback(async () => {
  if (!isLoggedIn) {
      setCartCount(0);
      return;
  }

  try {
      const response = await axios.get("http://localhost:5000/cart");
      setCartCount(response.data.length);
  } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
  }
}, [isLoggedIn]);

useEffect(() => {
  axios.get("http://localhost:5000/products").then((response) => {
  });

  fetchCartCount();
}, [fetchCartCount]);



  return (
    <>
    <NavbarEx cartCount={cartCount}></NavbarEx>
    {/* Notification Dropdown */}
    {showNotification && addedProduct && (
      <div className="notification-dropdown">
          <img src={Right} className='img12' alt='rightlogo'></img>  
          <h6 className='addbag'>Added to Bag</h6>
          <img src={addedProduct.image} alt={addedProduct.name} className="notification-img" />
          <div className="notification-text">
              <p><strong>{addedProduct.name}</strong></p>
              <p style={{color:'#4b4b4b',fontSize:'17px'}}>{addedProduct.category}</p>
              <p style={{fontSize:'17px'}}><strong>MRP : {addedProduct.price}</strong></p>
              <p className='extra'>Inclusive of all taxes</p>
              <p className='extra'>{"("}Also includes all the applicable duties{")"}</p>
          </div>
         <Link to='/Cart'><Button className='viewbag'>View Bag</Button></Link> 
      </div>
  )}

<div>
      <h1>Search Results for "{query}"</h1>
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-4" key={product._id}>
              <Card style={{ width: '19rem', border: 'none' }}>
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.category}</Card.Text>
                  <Card.Text><strong>MRP: {product.price}</strong></Card.Text>
                  <Button onClick={() => addToCart(product)} className='btn2' style={{ marginTop: '0', display: 'inline', marginLeft: '10px' }}>Add to Bag</Button>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default SearchResults;
