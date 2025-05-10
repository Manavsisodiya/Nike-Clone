import React, { useEffect, useState } from "react";
import axios from "axios";
import './Shop.css';
import NavbarEx from "./Navbar";
import Footer from "./Footer";
import Favourited from './images/1love.png'
import './Favourites.css'
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Right from './images/check-button.png'

function Favourite() {
    const [favorites, setFavorites] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null); // Store added product details



    const addToCart = async (product) => {
        console.log("Adding to cart:", product); // Debugging
        try {
            const response = await axios.post("http://localhost:5000/cart", {
                productId: product._id || product.id, // Use `id` as fallback
                name: product.name,
                price: product.price,
                category: product.category,
                image: product.image,
                quantity: 1,
            });
            console.log("Cart Response:", response.data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
        fetchCartCount();

        // Show the notification
        setAddedProduct(product);
        setShowNotification(true);

        // Hide the notification after 3-4 seconds
        setTimeout(() => {
            setShowNotification(false);
            setAddedProduct(null);
        }, 8000);

    };
    const fetchCartCount = async () => {
        const response = await axios.get("http://localhost:5000/cart");
        setCartCount(response.data.length);
    };
    useEffect(() => {
        const isActive = sessionStorage.getItem("userFirstName");
        if (!isActive) {
            setFavorites([]);
        } else {
            fetchFavorites();
        }
    }, []);


    const fetchFavorites = async () => {
        try {
            const response = await axios.get("http://localhost:5000/favorites");
            setFavorites(response.data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const removeFromFavorites = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/favorites/${id}`);
            setFavorites(favorites.filter(fav => fav._id !== id));
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    };

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
                        <p style={{ color: '#4b4b4b', fontSize: '17px' }}>{addedProduct.category}</p>
                        <p style={{ fontSize: '17px' }}><strong>MRP : {addedProduct.price}</strong></p>
                        <p className='extra'>Inclusive of all taxes</p>
                        <p className='extra'>{"("}Also includes all the applicable duties{")"}</p>
                    </div>
                    <Link to='/Cart'><Button className='viewbag'>View Bag</Button></Link>
                </div>
            )}



            <p style={{ marginTop: '3rem', marginLeft: '4rem', fontSize: '1.5rem', marginBottom: '-1rem' }}>
                Favourites
            </p>
            <div className="container3">

                {favorites.length === 0 ? (
                    <p className="emptycart">Items added to your favourites will be saved here.</p>
                ) : (
                    favorites.map((product) => (
                        <div key={product._id} className="favourite-item">
                            <img src={product.image} alt={product.name} className="favourite-image" />
                            <p className="namef">{product.name}</p>
                            <p className="pricef">MRP: {product.price}</p>
                            <p className="categoryf">{product.category}</p>

                            <button onClick={() => addToCart(product)} className='btn2' style={{ marginTop: '0', display: 'inline', marginLeft: 0, padding: '8px', width: '130px', borderRadius: '28px', fontSize: '15px', height: '40px' }}>Add to Bag</button>

                            <button className="removefav" onClick={() => removeFromFavorites(product._id)}>
                                <img src={Favourited} alt="favourite icon" className="favouritedicon" />
                            </button>





                        </div>
                    ))
                )}
            </div>
            <Footer></Footer>
        </>
    );
}

export default Favourite;
