import React, { useEffect, useState } from "react";
import axios from "axios";

function Banners() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/banners").then((response) => {
      setBanners(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Our Banners</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {banners.map((banner) => (
          <div
            key={banner._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px",
              width: "300px", // Adjust the size for banner layout
              
            }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              width="100%"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banners;
