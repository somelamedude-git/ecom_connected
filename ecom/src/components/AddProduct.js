import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const AddProductForm = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'active',
    tagNames: []
  });

  const [stockItems, setStockItems] = useState([{ size: '', quantity: '' }]);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/fetchCT'); // No credentials, query or body required, yay, so happy
        setCategories(response.data.category_names);
        setAvailableTags(response.data.tag_names);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading categories and tags');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tagNames: prev.tagNames.includes(tag)
        ? prev.tagNames.filter(t => t !== tag)
        : [...prev.tagNames, tag]
    }));
  };

  const handleStockChange = (index, field, value) => {
    const newStock = [...stockItems];
    newStock[index][field] = value;
    setStockItems(newStock);
  };

  const addStockItem = () => {
    setStockItems([...stockItems, { size: '', quantity: '' }]);
  };

  const removeStockItem = (index) => {
    if (stockItems.length > 1) {
      setStockItems(stockItems.filter((_, i) => i !== index));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        alert('Please fill in all required fields');
        return;
      }

      if (images.length === 0) {
        alert('Please add at least one product image');
        return;
      }

      // Convert stock items to Map format
      const stockMap = new Map();
      stockItems.forEach(item => {
        if (item.size && item.quantity) {
          stockMap.set(item.size, parseInt(item.quantity));
        }
      });

      if (stockMap.size === 0) {
        alert('Please add at least one stock item');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', parseFloat(formData.price));
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      
      // Convert stock Map to object for transmission
      const stockObject = Object.fromEntries(stockMap);
      submitData.append('stock', JSON.stringify(stockObject));
      
      // Add tags
      formData.tagNames.forEach(tag => {
        submitData.append('tagNames', tag);
      });

      // Add images
      images.forEach(image => {
        submitData.append('productImages', image.file);
      });

      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        status: 'active',
        tagNames: []
      });
      setStockItems([{ size: '', quantity: '' }]);
      setImages([]);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <button 
          onClick={onBack} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#9ca3af',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            marginBottom: '32px',
            cursor: 'pointer',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#facc15'}
          onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Add New <span style={{
              background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Product</span>
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Create a new product listing with images, details, and inventory management
          </p>
        </div>

        <div style={{
          backgroundColor: '#111827',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #374151',
          marginTop: '32px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
            gap: window.innerWidth <= 768 ? '32px' : '48px',
            marginBottom: '32px'
          }}>
            {/* Left Column - Basic Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#d1d5db',
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid #374151'
              }}>Product Information</h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter product name"
                  required
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  placeholder="Describe your product..."
                  rows="4"
                  required
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#d1d5db'
                  }}>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#d1d5db'
                  }}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    required
                    onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Right Column - Images & Tags */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#d1d5db',
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid #374151'
              }}>Images & Tags</h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>Product Images *</label>
                <div 
                  style={{
                    border: `2px dashed ${dragActive ? 'hsl(45, 100%, 85%)' : '#374151'}`,
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    backgroundColor: dragActive ? 'rgba(250, 204, 21, 0.05)' : '#1f2937'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload size={24} />
                  <p>Drag & drop images here or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{
                      position: 'absolute',
                      inset: '0',
                      opacity: '0',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                
                {images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    {images.map(image => (
                      <div key={image.id} style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#1f2937'
                      }}>
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>Tags</label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {availableTags.map(tag => (
                    <button
                      key={tag._id || tag.name}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      style={{
                        backgroundColor: formData.tagNames.includes(tag.name) 
                          ? 'transparent' : '#1f2937',
                        background: formData.tagNames.includes(tag.name)
                          ? 'linear-gradient(135deg, hsl(45, 100%, 85%), hsl(35, 90%, 68%))'
                          : '#1f2937',
                        color: formData.tagNames.includes(tag.name) ? '#000' : '#d1d5db',
                        border: formData.tagNames.includes(tag.name) 
                          ? 'none' : '1px solid #374151',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.tagNames.includes(tag.name)) {
                          e.target.style.borderColor = 'hsl(45, 100%, 85%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.tagNames.includes(tag.name)) {
                          e.target.style.borderColor = '#374151';
                        }
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stock Management Section */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '32px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#d1d5db',
                margin: '0'
              }}>Stock Management</h3>
              <button 
                type="button" 
                onClick={addStockItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1f2937',
                  color: '#d1d5db',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
              >
                <Plus size={16} />
                Add Size
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {stockItems.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flex: '1'
                  }}>
                    <input
                      type="text"
                      placeholder="Size (S, M, L, etc.)"
                      value={item.size}
                      onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#ffffff',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        flex: '1'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#ffffff',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        flex: '1'
                      }}
                      min="0"
                      onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                  </div>
                  {stockItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStockItem(index)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
              color: '#000',
              padding: '16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '32px',
              opacity: isSubmitting ? '0.6' : '1'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;