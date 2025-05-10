import './Women.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavbarEx from './Navbar';
import Footer from './Footer';

function Women() {
  const [banner, setBanner] = useState(null);
  const [banner2, setBanner2] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/banners").then((response) => {

      setBanner(response.data[12]);
      setBanner2(response.data[11]);

    });
  }, []);
  
  const [women, setWomen] = useState(null);

  useEffect(() => {
      axios.get("http://localhost:5000/women").then((response) => {
          setWomen(response.data);
      });
  }, []);


  return (
    <>
      <NavbarEx></NavbarEx>
      {/*Banner 1 section */}
      {banner && (
        <div key={banner._id} className='banner-contain_w'>

          <video src={banner.image} autoPlay loop style={{ width: '90vw' }} muted />
        </div>
      )}


      <div style={{ justifyContent: 'center' }}>
        <p className="text1_w"  >Run until you see stars at the Nike After Dark Tour, a race series powered by women.</p>
        <h1 className="text_w">RACE THE NIGHT AWAY</h1>
      </div>
      <div className='btn-contain_w'>
        <div className="button_w" style={{ marginLeft: '32rem' }}>Register Now</div>
        <div className="button_w">Shop Running</div>
      </div>






      {/*Banner 2 section */}
      <p style={{ marginLeft: "3.5rem", marginTop: '8rem', fontSize: '1.5rem', fontWeight: '400', fontFamily: '"Oswald", sans-serif' }}>Featured</p>
      {banner2 && (
        <div key={banner2._id} className='banner-contain_w'>

          <video src={banner2.image} autoPlay loop style={{ width: '90vw' }} muted />
        </div>
      )}

      <div style={{ justifyContent: 'center' }}>
        <p className="text1_w" style={{ marginLeft: "38rem" }} >Just In</p>
        <h1 className="text_w" style={{ marginLeft: "29rem", marginBottom: "-0.7rem" }}>AIR MAX DN8</h1>
        <p style={{ fontWeight: '550', fontSize: 'medium', marginLeft: "23rem" }}>Introducing a world of unreal motion in the latest chapter of Dynamic Air.</p>
      </div>
      <div className='btn-contain_w'>
        <div className="button_w" style={{ marginLeft: '37rem', width: '5rem' }}>Shop</div>
      </div>




      {/*Image gallary section */}
      <p style={{ marginLeft: "5.5rem", fontSize: "1.5rem", fontWeight: "460", marginTop: '8rem',fontFamily:'"Oswald", sans-serif'  }}>New & Featured</p>

      {women && women.length > 0 && women.map((item) => (

        <div key={item._id} className='image-container_w'>
          <img className='swipeimg_w' style={{ zIndex: '-11' }} src={item.image} alt='img1' />
          <p className='image-text_w'>{item.title}</p>
        </div>
      ))}
















      <Footer></Footer>
    </>
  );
}

export default Women
