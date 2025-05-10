
import './Footer.css';
import globe from './images/earth-globe.png'
function Footer() {
 
  return (
    <>
        <hr className='hr'></hr>

        <container className='containerfoot'>
        <div style={{marginLeft:'3rem',marginTop:'0.8rem',textAlign:'left'}}>        
                <h6 className='headfoot'>Resources</h6>
                <h6 className='insidefoot' >Find A Store</h6>
                <h6 className='insidefoot' >Become A Member</h6>
                <h6 className='insidefoot' >Send Us Feedback</h6>
        </div>

        <div style={{marginLeft:'10rem',marginTop:'0.8rem',textAlign:'left'}}>        
                <h6 className='headfoot'>Help</h6>
                <h6 className='insidefoot'  >Get Help</h6>
                <h6 className='insidefoot' >Order Status</h6>
                <h6 className='insidefoot'  >Delivery</h6>
                <h6 className='insidefoot'  >Returns</h6>
                <h6 className='insidefoot'  >Payment Options</h6>
                <h6 className='insidefoot'  >Contact Us On Nike.com Inquiries</h6>
                <h6 className='insidefoot'  >Contact Us On All Other Inquiries</h6>
                
        </div>

        <div style={{marginLeft:'5rem',marginTop:'0.8rem',textAlign:'left'}}>        
                <h6 className='headfoot'>Company</h6>
                <h6 className='insidefoot'  >About Nike</h6>
                <h6 className='insidefoot' >News</h6>
                <h6 className='insidefoot' >Carrers</h6>
                <h6 className='insidefoot' >Investors</h6>
                <h6 className='insidefoot' >Sustainability</h6>
                <h6 className='insidefoot' >Report a Concern</h6>
        </div>
        <div style={{marginLeft:'24rem'}}>India<img src={globe} style={{width:'20px',height:'20px'}} alt='globe'></img></div>
 
        </container>
        <div className='lastfoot'>©️ 2024 Nike, Inc. All rights reserved</div>
    </>
  );
}

export default Footer
