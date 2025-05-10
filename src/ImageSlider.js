import React, { useEffect, useState } from "react";
import axios from 'axios';



import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination,Mousewheel } from 'swiper/modules';

import './ImageSlider.css';





export default function App() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((response) => {
      setProducts(response.data);
    });
  }, [])

  

  return (
    <>
<p style={{marginLeft:"-61rem",fontSize:"1.5rem",marginTop:'6rem',fontFamily:'"Oswald", sans-serif'}}>Classics Spotlight</p>
      
      <Swiper style={{marginLeft:"3rem"}}
        slidesPerView={3}
        spaceBetween={0}
        pagination={{
          clickable: true,
        }}
        mousewheel={{forceToAxis:'true'}}
        modules={[Pagination,Mousewheel]}
        className="mySwiper"
      >
        
      {products.map((product) => (
        <div key={product._id}>
            
       <SwiperSlide className='swiperst' >
        <img src={product.image} alt='img1' style={{height:'400px',width:'400px'}}/>
        <p className='txt_slide1'>{product.name}</p></SwiperSlide>
       </div>
        ))}

      </Swiper>

      
    
    </>
  );
}
