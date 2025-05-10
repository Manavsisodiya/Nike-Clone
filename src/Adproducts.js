import { useState, useEffect } from "react";
import axios from "axios";
import "./Adproducts.css";

function Adproducts() {
  const [collection, setCollection] = useState("products");
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // States for new product upload
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [newshoe, setNewshoe] = useState("");
  const [image, setImage] = useState(null);

  const fetchProducts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(collection);
  }, [collection]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/${collection}/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/${collection}/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts(collection); // refresh product list
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("offer", offer);
    formData.append("newshoe", newshoe);
    formData.append("image", image);

    try {
      await axios.post(`http://localhost:5000/upload-${collection}`, formData);
      alert("Product Uploaded!");
      setName("");
      setPrice("");
      setCategory("");
      setOffer("");
      setNewshoe("");
      setImage(null);
      fetchProducts(collection); // refresh after upload
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="adproducts-container">
      <h2>Admin Products</h2>

      {/* 🔽 Dropdown to select collection */}
      <select value={collection} onChange={(e) => setCollection(e.target.value)}>
        <option value="products">New & Featured</option>
        <option value="jordan">Jordan</option>
        <option value="running">Running</option>
        <option value="football">Football</option>
        <option value="basketball">Basketball</option>
        <option value="skateboard">Skateboard</option>
        <option value="tennis">Tennis</option>
        <option value="training">Training</option>
        <option value="kidsproduct">Kids</option>
      </select>

      

      {/* 📦 Display Products */}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="product-card" key={index}>
              <img src={product.image} alt={product.name} className="product-img" />
              <h4>{product.name}</h4>
              <p>Price: {product.price}</p>
              <p>Category: {product.category}</p>
              <p>Offer: {product.offer}</p>
              <div className="product-actions">
                <button onClick={() => setEditProduct(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>

      {/* ✏️ Edit Modal */}
      {editProduct && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Edit Product</h3>
            <input
              type="text"
              name="name"
              value={editProduct.name}
              onChange={handleEditChange}
              placeholder="Product Name"
            />
            <input
              type="text"
              name="price"
              value={editProduct.price}
              onChange={handleEditChange}
              placeholder="Price"
            />
            <input
              type="text"
              name="category"
              value={editProduct.category}
              onChange={handleEditChange}
              placeholder="Category"
            />
            <input
              type="text"
              name="offer"
              value={editProduct.offer}
              onChange={handleEditChange}
              placeholder="Offer"
            />
            <input
              type="text"
              name="newshoe"
              value={editProduct.newshoe}
              onChange={handleEditChange}
              placeholder="New Shoe (Yes/No)"
            />
            <div className="edit-buttons">
              <button onClick={submitEdit}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>

      )}
      {/* 📤 Upload Form */}
      <form onSubmit={handleUpload} className="upload-form" style={{marginTop:'2rem'}}>
        <h3>Upload New Product</h3>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="text" placeholder="Offer" value={offer} onChange={(e) => setOffer(e.target.value)} required />
        <input type="text" placeholder="New Shoe" value={newshoe} onChange={(e) => setNewshoe(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Adproducts;
