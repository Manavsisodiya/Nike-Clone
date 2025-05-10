import React, { useState } from "react";
import axios from "axios";

function UploadBanner() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    await axios.post("http://localhost:5000/upload-banner", formData);
    alert("Banner Uploaded!");
    window.location.reload(); // Refresh page
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="text"
        placeholder="Banner Title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit">Upload Banner</button>
    </form>
  );
}

export default UploadBanner;
