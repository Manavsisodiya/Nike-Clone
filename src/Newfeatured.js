import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState } from "react";
import axios from "axios";
import './Shop.css'


function Newfeatured({cartCount}){
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/products").then((response) => {
            setProducts(response.data);
        });
    }, []);

    return(
        <>        
        {products.map((product, index) => (
            <div className="col-md-4" key={index} style={{marginTop:'2rem'}}>
                <Card style={{ width: '27rem',border:'none' }}>

                    <Card.Img variant="top" src={product.image} />
                  {product.newshoe && <p className='offerimg'>{product.newshoe}</p>}

                    <Card.Body style={{marginLeft:'-0.8rem'}}>
                        <Card.Title className='shoename'>{product.name}</Card.Title>
                        <Card.Text className='shoecategory'>
                            {product.category}
                        </Card.Text>
                        <Card.Text className='shoeprice' >
                            MRP:    {product.price}
                        </Card.Text>
                        <Button variant="danger" style={{marginTop:'-0.8rem',display:"inline"}}>{product.offer}</Button>
                        <Button variant="success" style={{marginTop:'-0.8rem',display:'inline',marginLeft:'5px'}}>Add to Bag</Button>
                    </Card.Body>
                </Card>
            </div>
        ))}
        </>

    );
}
 export default Newfeatured