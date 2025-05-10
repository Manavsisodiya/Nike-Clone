import './Main.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Main() {
  const [banner, setBanner] = useState([]); 

  useEffect(() => {
    axios.get("http://localhost:5000/banners")
      .then((response) => {
        
        const selectedBanners = [
          response.data[3],
          response.data[4],
          response.data[5]
        ];
        setBanner(selectedBanners);
      });
  }, []);

  return (
    <>
      {banner && banner.length === 3 && (
        <div>
          <h1 className='title2'>Featured</h1>

          {/* Displays 3 images and titles directly */}
          <img className='img1' src={banner[0].image} alt='shoe1' />
          <p className='imgt'>Nike AirMax 95</p>

          <img className='img2' src={banner[1].image} alt='shoe2' />
          <p className='imgt2'>Nike AirMax 270</p>

          <img className='img3' src={banner[2].image} alt='shoe3' />
        </div>
      )}
    </>
  );
}

export default Main;
