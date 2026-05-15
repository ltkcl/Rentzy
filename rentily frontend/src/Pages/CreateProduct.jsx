import { useState, useRef, useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigation, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { CATEGORIES } from "../data/products";

export default function CreateProduct() {
  const { user } = useUser();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const { productId } = useParams();
  const submitting = navigation.state === "submitting";
  const existingProduct = loaderData?.product ?? null;
  const isEditMode = Boolean(productId && existingProduct);
  const [imagePreview,  setImagePreview]  = useState(null);
  const showingCurrentImage = isEditMode && existingProduct?.image && !imagePreview;
  const [isDragging,    setIsDragging]    = useState(false);
  const [listingType,   setListingType]   = useState(existingProduct?.type ?? "rent");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  useEffect(() => {
    setListingType(existingProduct?.type ?? "rent");
  }, [existingProduct?.type]);

  const handleChange = (e) => {
    setListingType(e.target.value);
  };

  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
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
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
              <h1>{isEditMode ? "Edit Listing" : "Post a Listing"}</h1>
              <p>
                {isEditMode
                  ? "Update your product details and save the changes."
                  : "Fill in the details below to list your item for rent or sale."}
              </p>
            </div>
          </div>

          {actionData?.error && (
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
              ⚠️ {actionData.error}
            </div>
          )}

          <Form method="post" encType="multipart/form-data" className="create-form-body">
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => applyFile(e.target.files[0])}
            />

            {/* Basic Info */}
            <div className="form-section-label"><span>📝</span> Basic Info</div>

            <input type="hidden" name="userId" value={user?.id || existingProduct?.userId || ""} />

            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. MacBook Pro 2021, Calculus Textbook…"
                defaultValue={existingProduct?.title ?? ""}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe your item — condition, accessories included, reason for selling…"
                defaultValue={existingProduct?.description ?? ""}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  defaultValue={existingProduct?.category ?? ""}
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
                  defaultValue={existingProduct?.condition ?? ""}
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
                  Buy Price (₹) {listingType === "rent" ? "" : "*"}
                </label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="e.g. 12000"
                  defaultValue={existingProduct?.buyPrice ?? ""}
                  min="0"
                  required={listingType !== "rent"}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Rent Price / Month (₹) {listingType === "sell" ? "" : "*"}
                </label>
                <input
                  type="number"
                  name="rentPrice"
                  className="form-input"
                  placeholder="e.g. 150"
                  defaultValue={existingProduct?.rentPrice ?? ""}
                  min="0"
                  required={listingType !== "sell"}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input
                type="number"
                name="stock"
                className="form-input"
                placeholder="e.g. 1"
                defaultValue={existingProduct?.stock ?? "1"}
                min="1"
                required
              />
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
                defaultValue={existingProduct?.location ?? ""}
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
                    checked={listingType === opt.value}
                    onChange={handleChange}
                  />
                  <div className="type-card-emoji">{opt.emoji}</div>
                  <div className="type-card-label">{opt.label}</div>
                </label>
              ))}
            </div>

            {/* Photo upload */}
            <div className="form-section-label"><span>📸</span> Photo *</div>

            {showingCurrentImage && (
              <div className="upload-preview">
                <img src={existingProduct.image} alt="Current product" className="upload-preview-img" />
                <button
                  type="button"
                  className="upload-preview-change"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </button>
              </div>
            )}

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
              </div>
            ) : !showingCurrentImage ? (
              <div
                className={`form-upload-zone${isDragging ? " drag-active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
              >
                <div className="upload-icon">{isDragging ? "📂" : "📷"}</div>
                <p className="upload-text-main">
                  {isDragging ? "Drop your photo here" : "Drag & drop or click to browse"}
                </p>
                <p className="upload-text-sub">PNG, JPG, WEBP — max 10 MB</p>
              </div>
            ) : null}
            <button
              type="submit"
              className="form-submit-btn"
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting
                ? isEditMode ? "⏳ Saving…" : "⏳ Posting…"
                : isEditMode ? "💾 Save Changes" : "🚀  Post Listing Now"}
            </button>

          </Form>
        </div>
      </div>
    </div>
  );
}
