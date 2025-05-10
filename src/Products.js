import React, { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Shop</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <img src={product.image} alt={product.name} width="100" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <p>{product.newshoe}</p>
            <p>{product.offer}</p>
          
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;