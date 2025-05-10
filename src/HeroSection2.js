
import './Hero.css';
import axios from 'axios'; 
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 

function HeroSection2() {
 
  const [banner, setBanner] = useState(null);  

    useEffect(() => {       
        axios.get("http://localhost:5000/banners").then((response) => {         
            
                setBanner(response.data[15]); 
            
        });     
    }, []);        

  return (
    <>
      <p style={{marginLeft:"-70rem",marginTop:'8rem',fontSize:'1.5rem',fontWeight:'400',fontFamily:'"Oswald", sans-serif'}}>Don't Miss</p>
      {banner && (
                <div key={banner._id}>             
                    <img  className='bannersize'src={banner.image} alt={banner.title}/>         
                </div>             
            )}
    <div style={{justifyContent:'center'}}>
      <p style={{marginTop:'2rem',fontWeight:'600',fontSize:'medium',}}>Air Jordan 4 'Abundance'</p>
      <h1 className="text_hero2">IN HER BAG</h1>
      <p  style={{margintop:"-0.7rem",fontSize:'medium'}}>Always earned, never given. Abundance is an homage to her hustle.</p>
    </div>
    <Link to='/Shop'><div className="button">Shop</div></Link>

  
    </>
  );
}

export default HeroSection2
