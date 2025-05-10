import React, { useState } from "react";
import axios from "axios";

function UploadRunning() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [newshoe, setNewshoe] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("offer", offer);
    formData.append("newshoe", newshoe);
    formData.append("image", image);

    await axios.post("http://localhost:5000/upload-running", formData);
    alert("Product Uploaded!");
    window.location.reload(); 
  };

  return (
    <form onSubmit={handleUpload}>
        Running
      <input type="text" placeholder="Product Name" onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required />
      <input type="text" placeholder="Category" onChange={(e) => setCategory(e.target.value)} required />
      <input type="text" placeholder="Offer" onChange={(e) => setOffer(e.target.value)} required />
      <input type="text" placeholder="newshoe" onChange={(e) => setNewshoe(e.target.value)}  />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadRunning
