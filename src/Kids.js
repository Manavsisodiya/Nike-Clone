import './Kids.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavbarEx from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

/* Imports for Swiper */
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel } from 'swiper/modules';


function Kids() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/banners").then((response) => {

      setBanner(response.data[16]);

    });
  }, []);

  const [kids, setKids] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/Kids").then((response) => {
      setKids(response.data);
    });
  }, []);


  const [kidsproduct, setKidsproducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/Kidsproduct").then((response) => {
      setKidsproducts(response.data);
    });
  }, [])


  return (
    <>
      <NavbarEx style></NavbarEx>
      {/*Banner 1 section */}
      {banner && (
        <div key={banner._id} className='banner-contain_k'>

          <video src={banner.image} autoPlay loop style={{ width: '90vw' }} muted />
        </div>
      )}





      <div style={{ justifyContent: 'center' }}>
        <p style={{ fontFamily: '"Oswald",san-serif', fontWeight: '550', fontSize: 'medium', marginLeft: "37rem", fontStyle: 'italic', marginTop: '1rem' }}>Unreal Motion</p>
        <h1 className="text_k">AIR MAX DN8</h1>
        <p style={{ fontFamily: '"Oswald",san-serif', fontWeight: '550', fontSize: 'medium', marginLeft: "26rem", fontStyle: 'italic', marginTop: '-0.5rem' }}>Explore a whole new world of movement with full-length Dynamic Air.</p>
      </div>
      <div className='btn-contain_k'>
        <Link to='/kidsproduct'><div className="button_k" >Shop</div></Link>
      </div>


      {/*Image gallary section */}
      <p style={{ marginLeft: "5.5rem", fontSize: "1.5rem", fontWeight: "460", marginTop: '6rem', fontFamily: '"Oswald", sans-serif', fontStyle: 'italic' }}>Featured</p>

      {kids && kids.length > 0 && kids.map((item) => (

        <div key={item._id} className='image-container_k'>
          
          <img className='swipeimg_k' style={{ zIndex: '-11' }} src={item.image} alt='img1' />
          <p className='image-text_k'>{item.title}</p>
          
        </div>
      ))}




      {/** Section for Image Slider */}
      <p style={{ marginLeft: "3rem", fontSize: "1.5rem", fontWeight: "545", marginTop: '6rem', fontFamily: '"Oswald", sans-serif', fontStyle: 'italic' }}>Popular for kids</p>

      <Swiper style={{ marginLeft: "3rem", }}
        slidesPerView={3}
        spaceBetween={0}
        pagination={{
          clickable: true,
        }}
        mousewheel={{ forceToAxis: 'true' }}
        modules={[Pagination, Mousewheel]}
        className="mySwiper"
      >

        {kidsproduct.map((kidsproduct) => (
          <div key={kidsproduct._id}>
            
            <SwiperSlide className='swiperst_kids' >
            <Link to='/Kidsproduct' style={{cursor:'pointer'}}>
              <img src={kidsproduct.image} alt='img1'></img>
            </Link>
              <p className='txt_kids' style={{cursor:'pointer'}}>{kidsproduct.name}</p>
            </SwiperSlide>
          </div>
        ))}

      </Swiper>













      <Footer></Footer>
    </>
  );
}

export default Kids
