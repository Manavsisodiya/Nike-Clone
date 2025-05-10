import './Hero.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavbarEx from './Navbar';
import './Men.css';
import { Link } from 'react-router-dom';
import Footer from './Footer';


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel } from 'swiper/modules';







function Men() {

    const [banner, setBanner] = useState(null);
    const [bannerList, setBannerList] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/banners").then((response) => {
            setBanner(response.data[14]);
            setBannerList(response.data.slice(7, 11));
        });
    }, []);

    const [men, setMen] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/men").then((response) => {
            setMen(response.data);
        });
    }, []);


    return (
        <>
            <NavbarEx></NavbarEx>



            {banner && (
                <div key={banner._id}>
                    <video src={banner.image} autoPlay loop style={{ width: '90vw',marginLeft:'4rem',marginTop:'0rem' }} muted />
                </div>
            )}


            <div style={{ justifyContent: 'center' }}>
                <p style={{ marginTop: '2rem', fontWeight: '600', fontSize: 'medium', marginLeft: '48.5%', marginBottom: '-0.7rem' }}>Just In</p>
                <h1 className="text" style={{ marginLeft: '27rem', fontSize: '5rem', marginBottom: '0rem' }}>AIR MAX DN8</h1>
                <p style={{ fontWeight: '550', fontSize: 'medium', marginLeft: '24rem', marginBottom: '1.2rem' }}>Experince a sensation of unreal motion with full-length Dynamic Air.</p>
            </div>
            <div className="button" style={{ width: "4rem", height: '2rem', paddingLeft: '0.8rem', paddingTop: '0.3rem', marginLeft: "37.8rem" }}>Shop</div>


            {/*Banner Slide section*/}
            <p style={{ marginLeft: "3rem", fontSize: "1.5rem", fontWeight: "545", marginTop: '6rem', fontFamily: '"Oswald", sans-serif' }}>Trending</p>

            {bannerList && bannerList.length > 0 && (
                <Swiper style={{ marginLeft: "3rem" }}
                    slidesPerView={3}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    mousewheel={{ forceToAxis: true }}
                    modules={[Pagination, Mousewheel]}
                    className="mySwiper"
                >
                    {bannerList.map((bannerproduct) => (
                        <SwiperSlide key={bannerproduct._id} className='swiperst'>
                            <img src={bannerproduct.image} alt={bannerproduct.name} />
                            <p className='txtmen' style={{
                                fontFamily: "DM Sans",
                                fontSize: 'large',
                                position: 'absolute',
                                display: 'flex',
                                color: 'black',
                                backgroundColor: 'rgba(160, 159, 159, 0.342)',
                                fontWeight: '900',
                                top: '5rem',
                                left: '2rem',
                                bottom: '0.8rem'
                            }}>{bannerproduct.name}</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}






            {/*Sport section*/}

            <p style={{ marginLeft: "1rem", fontSize: "1.5rem", fontWeight: "545", marginTop: '6rem', fontFamily: '"Oswald", sans-serif' }}>Shop By Sport</p>


            {men && men.length > 0 && men.map((item) => (

                <div key={item._id} className='image-container'>
                    <img className='swipeimg' style={{ zIndex: '-11' }} src={item.image} alt='img1' />
                    <Link to={item.title}><p className='image-text'>{item.title}</p></Link>
                </div>
            ))}




            <Footer></Footer>
        </>
    );
}

export default Men
