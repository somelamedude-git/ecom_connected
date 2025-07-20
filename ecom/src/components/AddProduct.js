import '../styles/AddProduct.css';
import { useState } from 'react';

const AddProduct = () => {
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h1 className="form-title">Add New Product</h1>

        <div>
          <label htmlFor="title">Title</label>
          <input id="title" className="input" placeholder="Product title" />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input id="description" className="input" placeholder="Product description" />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input id="category" className="input" placeholder="Category" />
        </div>

        <div className="number-input-group">
          <label htmlFor="price">Price</label>
          <div className="custom-number-input">
            <button className="round-btn" onClick={() => setPrice(prev => Math.max(0, prev - 1))}>−</button>
            <input
              id="price"
              className="number-field"
              type="number"
              value={price}
              onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <button className="round-btn" onClick={() => setPrice(prev => prev + 1)}>+</button>
          </div>
        </div>

        <div className="number-input-group">
          <label htmlFor="discountedPrice">Discounted Price</label>
          <div className="custom-number-input">
            <button className="round-btn" onClick={() => setDiscountedPrice(prev => Math.max(0, prev - 1))}>−</button>
            <input
              id="discountedPrice"
              className="number-field"
              type="number"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <button className="round-btn" onClick={() => setDiscountedPrice(prev => prev + 1)}>+</button>
          </div>
        </div>


        <div className="number-input-group">
          <label htmlFor="stock">Stock</label>
          <div className="custom-number-input">
            <button className="round-btn" onClick={() => setStock(prev => Math.max(0, prev - 1))}>−</button>
            <input
              id="stock"
              className="number-field"
              type="number"
              value={stock}
              onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <button className="round-btn" onClick={() => setStock(prev => prev + 1)}>+</button>
          </div>
        </div>


        <div>
          <label htmlFor="media">Media</label>
          <div className="custom-file-upload">
            <label htmlFor="media" className="upload-btn">Choose File</label>
            <span id="file-chosen">No file chosen</span>
            <input
              type="file"
              id="media"
              className="hidden-file"
              onChange={(e) => {
                document.getElementById('file-chosen').textContent = e.target.files[0]?.name || 'No file chosen';
              }}
            />
          </div>
        </div>

        <button className="submit-btn">Add Product</button>
      </div>
    </div>
  );
};

export default AddProduct;
