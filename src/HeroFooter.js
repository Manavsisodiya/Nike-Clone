import './HeroFooter.css'; 
import axios from 'axios'; 
import { useEffect, useState } from 'react';  

function HeroFooter() {     
    const [banner, setBanner] = useState(null);  
    useEffect(() => {       
        axios.get("http://localhost:5000/banners").then((response) => {         
            if (response.data.length > 0) {
                setBanner(response.data[0]); 
            }
        });     
    }, []);        

    return (     
        <>     
            {banner && (
                <div key={banner._id} className='container_banner'>             
                    <img className='bannersize' src={banner.image} alt={banner.title}/>         
                </div>             
            )}

            <div style={{ justifyContent: 'center', marginTop: '2rem' }}>              
                <h1 className="text2">CUSHIONING TO THE MAX</h1>       
                <p className="text3">Coming 2.27</p>     
            </div>      

            <div className="button2">    
                Notify Me     
            </div>         
        </>   
    ); 
}  

export default HeroFooter;
