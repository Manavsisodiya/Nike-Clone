import './Hero.css';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Hero() {
  const [banner, setBanner] = useState(null);  

  useEffect(() => {       
      axios.get("http://localhost:5000/banners").then((response) => {         
          
              setBanner(response.data[17]); 
          
      });     
  }, []);        

 
  return (
    <>
    {banner && (
                <div key={banner._id}>             
                            
                            <video src={banner.image} autoPlay loop style={{width:'90vw',marginTop:'0rem'}} muted/>
                </div>             
            )}


    <div style={{justifyContent:'center'}}>
      <p className="text1" style={{marginBottom:'-0.5rem'}} >Just In</p>
      <h1 className="text">AIR MAX DN8</h1>
      <p className="text1" >Discover the electrifying moves of footballer Nico Williams.</p>
    </div>
      <Link to='/Shop'><div className="button">Shop</div></Link>

  
    </>
  );
}

export default Hero
