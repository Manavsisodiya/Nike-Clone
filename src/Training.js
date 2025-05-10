import { useCallback } from "react";
import Card from 'react-bootstrap/Card';
import NavbarEx from "./Navbar";
import './Shop.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Favourite from './images/heart.png'
import Heartfilled from './images/1love.png'
import Right from './images/check-button.png'

function Training() {
    const [training, setTraining] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null); // Store added product details

    const isLoggedIn = sessionStorage.getItem("userFirstName");

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
    
    
    
    const fetchFavorites = async () => {
        try {
            const response = await axios.get("http://localhost:5000/favorites");
            setFavorites(response.data.map(fav => fav.productId));
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };
    const toggleFavorite = async (product) => {
        if(!isLoggedIn)
        {
            alert("Please SignIn to add items to the favourites!")
            window.location.href = "/Signin";
            return;
        }
        try {
            if (favorites.includes(product._id)) {
                // Remove from favorites
                const response = await axios.get("http://localhost:5000/favorites");
                const favItem = response.data.find(item => item.productId === product._id);

                if (favItem) {
                    await axios.delete(`http://localhost:5000/favorites/${favItem._id}`);
                    setFavorites(favorites.filter(id => id !== product._id));
                }
            } else {
                // Add to favorites
                await axios.post("http://localhost:5000/favorites", {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                });
                setFavorites([...favorites, product._id]);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
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
        axios.get("http://localhost:5000/training").then((response) => {
            setTraining(response.data);
        });
    
        fetchCartCount();
        fetchFavorites();
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
            <div className="Container">

                <div className="SideScroll" style={{ marginTop: '1rem' }}>
                    <h4 className='shophead'>New & Featured</h4>
                    <Link to='/Jordan' style={{ textDecoration: 'none' }}><p className='menuhead'>Jordan</p></Link> <br></br>
                    <Link to='/Running' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-1.8rem' }} >Running</p></Link>
                    <Link to='/Basketball' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-0.5rem' }}>Basketball</p></Link>
                    <Link to='/Football' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-0.5rem' }}>Football</p></Link>
                    <Link to='/Training' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-0.5rem' }}>Training</p></Link>
                    <Link to='/Tennis' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-0.5rem' }}>Tennis</p></Link>
                    <Link to='/Skateboard' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-0.5rem' }}>Skateboard</p></Link>
                    <Link to='/Kidsproduct' style={{ textDecoration: 'none' }}><p className='menuhead' style={{ marginTop: '-0.5rem' }}>Kids</p></Link>
                </div>

                <div className="MainContent">
                    <div className="row">
                        {training.map((product, index) => (
                            <div className="col-md-4" key={index} style={{ marginTop: '1rem' }}>
                                <Card style={{ width: '19rem', border: 'none' }}>

                                    <Card.Img variant="top" src={product.image} />

                                    <Card.Body style={{ marginLeft: '-0.8rem' }}>
                                        {product.newshoe && <p className='offerimg'>{product.newshoe}</p>}
                                        <Card.Title className='shoename'>{product.name}</Card.Title>
                                        <Card.Text className='shoecategory'>
                                            {product.category}
                                        </Card.Text>
                                        <Card.Text className='shoeprice' >
                                            MRP:    {product.price}
                                        </Card.Text>
                                        <img
                                            src={favorites.includes(product._id) ? Heartfilled : Favourite}
                                            alt="favorite"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => toggleFavorite(product)}
                                        />
                                         <Button
                                            onClick={() => addToCart(product)} className='btn2' style={{ marginTop: '0', display: 'inline', marginLeft: '5px' }}>Add to Bag</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </>
    );
}

export default Training




