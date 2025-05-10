import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Nav.css';
import jordan from './images/jordan.png';
import nike from './images/nike.png';
import { Link } from 'react-router-dom';
import search from './images/search.png';
import favourite from './images/heart.png';
import cart from './images/shopping-bag.png';
import profileImage from './images/person.png';
import './Cart.css'


function NavbarEx({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check localStorage for logged-in user on component mount
  useEffect(() => {
    const storedFirstName = sessionStorage.getItem("userFirstName");
    if (storedFirstName) {
      setFirstName(storedFirstName.replace(/"/g, ""));
    }
  }, []);



  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/Search?q=${searchQuery}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      console.log("Dropdown toggled:", !prev); // Debugging
      return !prev;
    });
  };
  const clearallitem=async()=>{
    try {
      await fetch("http://localhost:5000/clear-cart", { method: "DELETE" });
      await fetch("http://localhost:5000/clear-favorites", { method: "DELETE" });
    } catch (err) {
      console.error("Error clearing cart/favorites on session end", err);
    }
    sessionStorage.removeItem('userFirstName');
    setFirstName('');
    setDropdownOpen(false);
                      
  }


  return (
    <>
      <Navbar expand="md" className="nav bg-body-tertiary" style={{ height: 34, backgroundColor: "#F1F1F1", marginTop: 0 }}>
        <Container fluid>
          <Navbar.Brand className="title" style={{ marginTop: 0, marginLeft: 19 }}>
            <Link to="/Jordan">
              <img src={jordan} width="20" height="20" className="d-inline-block align-top" alt="Jordan Logo" />
            </Link>
          </Navbar.Brand>
          <Nav className="Nav-font me-auto " style={{ maxHeight: '100px', marginLeft: '5rem', justifyContent: 'space-between', fontSize: "small" }} navbarScroll>
            <Link to="#" style={{ color: 'black', textDecoration: 'none' }}><span>Find a Store</span>&nbsp;&nbsp; |&nbsp;&nbsp;   </Link>
            <Link to="#" style={{ color: 'black', textDecoration: 'none' }}><span>Help</span>&nbsp;&nbsp; |&nbsp;&nbsp;  </Link>

            {firstName ? (
              <div ref={dropdownRef} onClick={toggleDropdown} className='img10' style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
                <span style={{ fontWeight: "0", fontsFamily: "Poppins", fontSize: 'small', fontStyle: 'normal' }} className='img9txt'> Hi, {firstName} </span>
                <img className='img9'
                  src={profileImage} // Replace with user's profile image if available
                  width="25"
                  height="25"
                  style={{ borderRadius: "50%", marginRight: "5px", marginTop: "-4px" }}
                  alt="Profile"
                />

                {dropdownOpen && (
                  <div className="dropdown_menu">
                    <h5>Account</h5>
                    <Link to="/profile" className="dropdown-item" style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: 'black', }}>Profile</Link>
                    <Link to="/orders" className="dropdown-item" style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: 'black' }}>Orders</Link>
                    <Link to="/Favourites" className="dropdown-item" style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: 'black' }}>Favourites</Link>
                    <Link to="/settings" className="dropdown-item" style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: 'black' }}>Settings</Link>
                    <div className="dropdown-item" style={{ padding: '5px 10px', cursor: 'pointer', color: 'black' }} onClick={clearallitem}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )
              :
              (<>
                <Link to="#" style={{ color: 'black', textDecoration: 'none' }}><span>Join Us</span>&nbsp;&nbsp;  |&nbsp;&nbsp;  </Link>
                <Link to="Signin" style={{ color: 'black', textDecoration: 'none' }}><span> Sign In</span>&nbsp;</Link>
              </>)}


          </Nav>
        </Container>
      </Navbar>

      <Navbar id='mainnav' expand="lg" className="stickynav bg-body-tertiary " style={{ backgroundColor: '#FFFFFF' }}>
        <Container fluid style={{ maxHeight: 43 }}>
          <Navbar.Brand className="title" style={{ marginLeft: 16 }}>
            <Link to='/'>
              <img src={nike} width="60" height="60" className="d-inline-block align-top" alt="Nike Logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="Nav-font me-auto my-2 my-lg-0" style={{ maxHeight: '100px', marginLeft: '15rem', justifyContent: 'space-between', fontSize: '15px' }} navbarScroll>
              <Link to='/Shop' style={{ color: 'black', fontWeight: "500", marginLeft: '5rem' }}>New & Featured</Link>
              <Link to='/Men' style={{ color: 'black', fontWeight: "500", marginLeft: "2rem" }}>Men</Link>
              <Link to='/Women' style={{ color: 'black', fontWeight: "500", marginLeft: "2rem" }}>Women</Link>
              <Link to='/Kids' style={{ color: 'black', fontWeight: "500", marginLeft: "2rem", marginRight: '4.2rem' }}>Kids</Link>

            </Nav>

            {/* Search Form */}
            <Form className="searchform d-flex" onSubmit={handleSearch}>
              <button type="submit" className="search-icon-button" style={{ outline: 'none', border: 'none', borderRadius: '45px' }}>
                <img className='searchimg' src={search} alt='Search Icon' />
              </button>
              <input style={{ outline: 'none', border: 'none', background: 'transparent' }}
                type="text"
                className="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

            </Form>

            <Link to={firstName ? '/Favourites' : '#'}
            onClick={(e)=>{
              if(!firstName){
                e.preventDefault();
                alert("Please sign in to access favourites.");
                navigate('/Signin');
              }
            }}>
              <img className='logoshop' style={{ marginLeft: '2rem' }} src={favourite} alt='Favourite' />
            </Link>

            <Link
              to={firstName ? '/Cart' : '#'}
              onClick={(e) => {
                if (!firstName) {
                  e.preventDefault();
                  alert("Please sign in to access your cart.");
                  navigate('/Signin');
                }
              }}
            >
              <img className='logoshop' style={{ marginLeft: '1rem' }} src={cart} alt='Cart' />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>


          </Navbar.Collapse>
        </Container>
      </Navbar>


    </>
  );
}

export default NavbarEx;
