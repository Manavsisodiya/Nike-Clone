import './Admin.css'
import Nike from './images/NIKE2.png'
import Adminimg from './images/profile.png'
import Dashboardimg from './images/dashboard.png'
import Ordersimg from './images/orders.png'
import Productsimg from './images/products.png'
import Logoutimg from './images/turn-off.png'
import { Link,Outlet} from 'react-router-dom'

function Admin() {
    return (
        <>
            <div className="maindiv">

                <div className="sidebar">
                    <img src={Nike} alt='nike' className='logoimg2'></img>
                    <img src={Adminimg} alt='nike' className='adminimg'></img>
                    <h5 className='sidebartxt'>Admin</h5>
                    <div className='sidebaritems'>
                        <Link to='Dashboard' style={{ textDecoration: "none", color: "inherit" }}>
                            <div className='addashboard'>
                                <img className='itemsimg' src={Dashboardimg} alt='Dashboardimg'></img>
                                <h6 className='itemstxt'>Dashboard</h6>
                            </div>
                        </Link>
                        <Link to='Adorders' style={{ textDecoration: "none", color: "inherit" }}>
                        <div className='adorders'>
                            <img className='itemsimg' src={Ordersimg} alt='Ordersimg'></img>
                            <h6 className='itemstxt'>Orders</h6>
                        </div>
                        </Link>
                        <Link to='Adproducts' style={{ textDecoration: "none", color: "inherit" }}>
                        <div className='adproducts'>
                            <img className='itemsimg' src={Productsimg} alt='Productsimg'></img>
                            <h6 className='itemstxt'>Products</h6>
                        </div>
                        </Link>
                        <Link to='/' style={{ textDecoration: "none", color: "inherit" }}>
                        <div className='adlogout'>
                            <img className='itemsimg' src={Logoutimg} alt='Logoutimg'></img>
                            <h6 className='itemstxt'>Log Out</h6>
                        </div>
                        </Link>
                    </div>

                </div>

                <div className="contentspace">
                <Outlet />
                </div>

            </div>
        </>
    );
}

export default Admin;
