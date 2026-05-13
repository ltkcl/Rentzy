import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CATEGORIES } from "../data/products";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [submitting,    setSubmitting]    = useState(false);
  const [submitError,   setSubmitError]   = useState(null);
  const [imageFile,     setImageFile]     = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [isDragging,    setIsDragging]    = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    rentPrice: "",
    condition: "",
    location: "",
    type: "rent",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setSubmitError("Please upload a product photo.");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);

    const imageUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const buyPrice  = formData.type !== "rent" ? parseInt(formData.price)     || 0 : null;
    const rentPrice = formData.type !== "sell" ? parseInt(formData.rentPrice) || 0 : null;

    const newProduct = {
      id:          Date.now(),
      title:       formData.title,
      category:    formData.category,
      condition:   formData.condition,
      description: formData.description || "",
      location:    formData.location    || "",
      image:       imageUrl,
      buyPrice,
      rentPrice,
      price:       buyPrice ?? rentPrice,
      rentable:    formData.type !== "sell",
      forSale:     formData.type !== "rent",
      type:        formData.type,
      available:   true,
      seller:      "You",
    };

    try {
      const stored  = localStorage.getItem("rentily_products");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("rentily_products", JSON.stringify([...existing, newProduct]));
      alert("Product listed successfully!");
      navigate("/browse");
    } catch {
      setSubmitError("Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="create-layout">
        {/* Sidebar */}
        <aside className="create-sidebar">
          <div className="create-sidebar-card">
            <div className="create-sidebar-emoji">🏷️</div>
            <h3>Tips for a Great Listing</h3>
            <div className="create-sidebar-tips">
              <div className="create-tip">
                <span className="create-tip-icon">📸</span>
                <span>Add clear, well-lit photos — listings with images get 3× more views.</span>
              </div>
              <div className="create-tip">
                <span className="create-tip-icon">✍️</span>
                <span>Write a detailed description including brand, age, and any flaws.</span>
              </div>
              <div className="create-tip">
                <span className="create-tip-icon">💰</span>
                <span>Price competitively — check similar listings to find the sweet spot.</span>
              </div>
              <div className="create-tip">
                <span className="create-tip-icon">📍</span>
                <span>Add your location so nearby students can find your listing easily.</span>
              </div>
            </div>
            <hr className="create-sidebar-divider" />
            <div className="create-sidebar-stat">
              <div>
                <div className="create-sidebar-stat-num">3×</div>
                <div className="create-sidebar-stat-label">more enquiries with photos</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Form Card */}
        <div className="create-form-card">
          <div className="create-form-header">
            <div className="create-form-header-icon">📋</div>
            <div>
              <h1>Post a Listing</h1>
              <p>Fill in the details below to list your item for rent or sale.</p>
            </div>
          </div>

          {submitError && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: 12,
                padding: "12px 16px",
                color: "#dc2626",
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-form-body">

            {/* Basic Info */}
            <div className="form-section-label"><span>📝</span> Basic Info</div>

            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. MacBook Pro 2021, Calculus Textbook…"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe your item — condition, accessories included, reason for selling…"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select
                  name="condition"
                  className="form-select"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="New">✨ New</option>
                  <option value="Like New">🌟 Like New</option>
                  <option value="Good">👍 Good</option>
                  <option value="Fair">🔧 Fair</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section-label"><span>💰</span> Pricing</div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Buy Price (₹) {formData.type === "rent" ? "" : "*"}
                </label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="e.g. 12000"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required={formData.type !== "rent"}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Rent Price / Month (₹) {formData.type === "sell" ? "" : "*"}
                </label>
                <input
                  type="number"
                  name="rentPrice"
                  className="form-input"
                  placeholder="e.g. 150"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  min="0"
                  required={formData.type !== "sell"}
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-section-label"><span>📍</span> Location</div>

            <div className="form-group">
              <label className="form-label">Your City or Area</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Bhubaneswar, Kota, Delhi…"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Listing Type */}
            <div className="form-section-label"><span>🏷️</span> Listing Type</div>

            <div className="type-card-group">
              {[
                { value: "rent", emoji: "🔑", label: "Rent Only" },
                { value: "sell", emoji: "🛒", label: "Sell Only" },
                { value: "both", emoji: "✨", label: "Both" },
              ].map((opt) => (
                <label key={opt.value} className="type-card">
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={formData.type === opt.value}
                    onChange={handleChange}
                  />
                  <div className="type-card-emoji">{opt.emoji}</div>
                  <div className="type-card-label">{opt.label}</div>
                </label>
              ))}
            </div>

            {/* Photo upload */}
            <div className="form-section-label"><span>📸</span> Photo *</div>

            {imagePreview ? (
              <div className="upload-preview">
                <img src={imagePreview} alt="Preview" className="upload-preview-img" />
                <button type="button" className="upload-preview-remove" onClick={removeImage} aria-label="Remove photo">✕</button>
                <button
                  type="button"
                  className="upload-preview-change"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => applyFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div
                className={`form-upload-zone${isDragging ? " drag-active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => applyFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <div className="upload-icon">{isDragging ? "📂" : "📷"}</div>
                <p className="upload-text-main">
                  {isDragging ? "Drop your photo here" : "Drag & drop or click to browse"}
                </p>
                <p className="upload-text-sub">PNG, JPG, WEBP — max 10 MB</p>
              </div>
            )}

            <button
              type="submit"
              className="form-submit-btn"
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "⏳ Posting…" : "🚀  Post Listing Now"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
