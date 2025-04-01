import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../AdminPages_css/AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState("");
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Check if there are already 4 images
    if (images.length + selectedFiles.length > 4) {
      toast.error("You can only upload 4 images.", { position: "top-right", autoClose: 3000 });
      return;
    }

    setImages((prevImages) => [...prevImages, ...selectedFiles]);

    document.getElementById("file-input").value = null; // Clear file input after each selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure exactly 4 images are uploaded
    if (images.length !== 4) {
      toast.error("Please upload exactly 4 images.", { position: "top-right", autoClose: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("productId", productId);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("description", description);

    images.forEach((image) => {
      formData.append("images", image); // Use the key "images" for each image file
    });

    try {
      const response = await fetch("http://localhost:3000/admin/add-product", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Product added successfully!", { position: "top-right", autoClose: 3000 });
        setName("");
        setProductId("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setDescription("");
        setImages([]); // Clear the images after successful upload
      } else {
        const errorData = await response.json();
        toast.error("Error: " + errorData.message, { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Failed to add product: " + error.message, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="add-product-form-container">
      <ToastContainer />
      <h1 className="add-product-form-title">ADD PRODUCT</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="add-product-form">
        <div className="add-product-form-group">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="add-product-form-input"
          />
        </div>

        <div className="add-product-form-group">
          <input
            type="text"
            placeholder="Product Id"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="add-product-form-input"
          />
        </div>

        <div className="add-product-form-group">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="add-product-form-input"
          />
        </div>

        <div className="add-product-form-group">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="add-product-form-input"
          />
        </div>

        <div className="add-product-form-group add-product-form-textarea">
          <textarea
            placeholder="Description..."
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="add-product-form-textarea-input"
          />
        </div>

        <div className="add-product-form-group">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="add-product-form-input"
          />
        </div>

        <div className="add-product-form-group add-product-form-file-wrapper">
          <input
            id="file-input"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="add-product-form-file-input"
            multiple
          />
          <label htmlFor="file-input" className="add-product-form-file-label">Choose Images (Max 4)</label>
        </div>

        {/* Image Previews */}
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} className="image-preview-img" />
            </div>
          ))}
        </div>

        <button type="submit" className="add-product-form-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
