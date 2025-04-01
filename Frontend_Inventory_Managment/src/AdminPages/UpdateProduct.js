import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../Login _signup_pages/UserContext';
import '../AdminPages_css/UpdateProduct.css';

const UpdateProduct = () => {
    const { productId } = useParams();
    const { userData } = useUser();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: '',
        productId: '',
        price: '',
        category: '',
        quantity: '',
        description: '',
        imageUrls: [] // Array to hold existing image URLs
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // Array for selected image files
    const [previewImages, setPreviewImages] = useState([]); // Array for previews of new images

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/product/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + imageFiles.length > 4) {
            toast.error('You can upload a maximum of 4 images', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const updatedImageFiles = [...imageFiles, ...files]; // Append new images
        const previewUrls = updatedImageFiles.map((file) => URL.createObjectURL(file));

        setImageFiles(updatedImageFiles);
        setPreviewImages(previewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.name || !product.productId || !product.price || !product.description || !product.category || !product.quantity || (imageFiles.length === 0 && product.imageUrls.length === 0)) {
            toast.error('All fields, including at least one image, are mandatory', { position: 'top-right', autoClose: 3000 });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('productId', product.productId);
            formData.append('price', product.price);
            formData.append('category', product.category);
            formData.append('quantity', product.quantity);
            formData.append('description', product.description);

            // Append new image files if any
            imageFiles.forEach((file) => {
                formData.append('images', file);
            });

            // Append existing image URLs if no new images are selected
            if (imageFiles.length === 0) {
                product.imageUrls.forEach((url) => {
                    formData.append('imageUrls', url);
                });
            }

            const response = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PUT',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to update product');

            toast.success('Product updated successfully!', { position: 'top-right', autoClose: 3000 });
            navigate(`/admin/${userData.id}/product`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='update-form'>
            <h1 className='update-title'>Update Product</h1>
            <form className='update-form__form' onSubmit={handleSubmit}>
                <div className='update-field'>
                    <label className='update-label'>Name:</label>
                    <input type="text" className='update-input' name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div className='update-field'>
                    <label className='update-label'>Product ID:</label>
                    <input type="text" className='update-input' name="productId" value={product.productId} onChange={handleChange} required />
                </div>
                <div className='update-field'>
                    <label className='update-label'>Price:</label>
                    <input type="number" className='update-input' name="price" value={product.price} onChange={handleChange} required />
                </div>
                <div className='update-field'>
                    <label className='update-label'>Category:</label>
                    <input type="text" className='update-input' name="category" value={product.category} onChange={handleChange} required />
                </div>
                <div className='update-field update-field--textarea'>
                    <label className='update-label'>Description:</label>
                    <textarea className='update-textarea' name="description" rows="5" value={product.description} onChange={handleChange} required />
                </div>
                <div className='update-field'>
                    <label className='update-label'>Quantity:</label>
                    <input type="number" className='update-input' name="quantity" value={product.quantity} onChange={handleChange} required />
                </div>
                <div className='update-field'>
                    <label className='update-label'>Images (Max 4):</label>
                    <input type="file" className='update-file' onChange={handleFileChange} multiple accept="image/*" />
                    {/* Display current images if they exist */}
                    {product.imageUrls.length > 0 && (
                        <div className='current-images' style={{display:'flex', justifyContent:'space-around'}}>
                            {product.imageUrls.map((url, index) => (
                                <div key={index} className='current-image'  >
                                    <img src={url} alt={`Current product image ${index + 1}`} className='image-preview' />
                                    {/* <p>Current Image {index + 1}</p> */}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Display previews of new images */}
                    {previewImages.length > 0 && (
                        <div className='new-images' style={{display:'flex', justifyContent:'space-around'}}>
                            {previewImages.map((previewUrl, index) => (
                                <div key={index} className='new-image'>
                                    <img src={previewUrl} alt={`New image ${index + 1}`} className='image-preview' />
                                    {/* <p>New Image {index + 1}</p> */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button className='update-button' type="submit">Update Product</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default UpdateProduct;
