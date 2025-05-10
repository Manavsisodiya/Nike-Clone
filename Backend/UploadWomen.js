import React, { useState } from "react";
import axios from "axios";

function UploadWomen() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    await axios.post("http://localhost:5000/upload-Women", formData);
    alert("Banner Uploaded !");
    window.location.reload(); // Refresh page
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="text"
        placeholder="Women Title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit">Upload Women</button>
    </form>
  );
}

export default UploadWomen;
