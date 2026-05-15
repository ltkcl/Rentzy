import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
 
const TYPE_LABELS = {
  rent: { label: 'Rent Only', cls: 'tag-rent' },
  sell: { label: 'Buy Only', cls: 'tag-buy' },
  both: { label: 'Rent & Buy', cls: 'tag-both' },
};
 
const formatPrice = (price) =>
  new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);
 
const ListingCard = ({ listing, onEdit, onRemove, deleting }) => {
  const typeInfo = TYPE_LABELS[listing.type] || TYPE_LABELS.both;
  const status = listing.available ? 'Active' : 'Inactive';
 
  return (
    <div className="listing-card">
      <div className="listing-image-wrap">
        <img src={listing.image || '/vite.svg'} alt={listing.title} className="listing-image" />
        <span className={`listing-status ${status === 'Active' ? 'status-active' : 'status-inactive'}`}>
          {status}
        </span>
      </div>
      <div className="listing-body">
        <div className="listing-top">
          <span className={`tag ${typeInfo.cls}`}>{typeInfo.label}</span>
          <span className="listing-condition">{listing.condition}</span>
        </div>
        <h3 className="listing-title">{listing.title}</h3>
        <p className="listing-location">📍 {listing.location}</p>
        <div className="listing-prices">
          {(listing.type === 'sell' || listing.type === 'both') && (
            <div className="listing-price-item">
              <span className="listing-price-label">Sell Price</span>
              <span className="listing-price-val buy-price">{formatPrice(listing.buyPrice || 0)}</span>
            </div>
          )}
          {(listing.type === 'rent' || listing.type === 'both') && (
            <div className="listing-price-item">
              <span className="listing-price-label">Rent/day</span>
              <span className="listing-price-val rent-price">{formatPrice(listing.rentPrice)}</span>
            </div>
          )}
        </div>
        <div className="listing-actions">
          <button className="listing-btn edit-btn" onClick={() => onEdit(listing.id)}>✏️ Edit</button>
          <button
            className="listing-btn delete-btn"
            onClick={() => onRemove(listing.id)}
            disabled={deleting}
          >
            {deleting ? 'Removing...' : '🗑️ Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
const SellRentPage = () => {
  const navigate = useNavigate();
  const { listings } = useLoaderData();
  const [listingItems, setListingItems] = useState(listings);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setListingItems(listings);
  }, [listings]);

  const handleEdit = (productId) => {
    navigate(`/sell/edit-product/${productId}`);
  };

  const handleRemove = async (productId) => {
    const confirmed = window.confirm('Remove this listing?');
    if (!confirmed) return;

    try {
      setDeletingId(productId);
      await api.deleteProduct(productId);
      setListingItems((current) => current.filter((listing) => listing.id !== productId));
    } catch (error) {
      window.alert(error.message || 'Unable to remove the listing right now.');
    } finally {
      setDeletingId(null);
    }
  };
 
  return (
    <div className="page-wrapper">
      <Navbar />
 
      <div className="container">
        {/* Dashboard Banner */}
        <div className="seller-banner">
          <div className="seller-banner-circle" />
          <div className="seller-banner-text">
            <h1>My <span>Listings</span> 🚀</h1>
            <p>Manage your products for rent and sale — track views, enquiries, and earnings.</p>
          </div>
          <button className="seller-banner-btn" onClick={() => navigate('/sell/create-product')}>
            + Post New Listing
          </button>
        </div>

        {/* Stats */}
        <div className="seller-stats">
          <div className="stat-card stat-blue">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-num">{listings.length}</span>
              
              <span className="stat-label">Active Listings</span>
            </div>
          </div>
          <div className="stat-card stat-purple">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <span className="stat-num">142</span>
              <span className="stat-label">Total Views</span>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">🤝</div>
            <div className="stat-info">
              <span className="stat-num">8</span>
              <span className="stat-label">Enquiries</span>
            </div>
          </div>
          <div className="stat-card stat-yellow">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-num">4.7</span>
              <span className="stat-label">Seller Rating</span>
            </div>
          </div>
        </div>
 
        {/* Listings Section */}
        <div className="listings-section">
          <div className="section-header">
            <h2 className="section-title">Your Listings</h2>
            <span className="section-badge">{listingItems.length} items</span>
          </div>
 
          {listingItems.length > 0 ? (
            <div className="listings-grid">
              {listingItems.map((listing, i) => (
                <div
                  key={listing.id}
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0, animation: `fadeInUp 0.4s ease ${i * 0.1}s forwards` }}
                >
                  <ListingCard
                    listing={listing}
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                    deleting={deletingId === listing.id}
                  />
                </div>
              ))}
 
              {/* Add New Card */}
              <div
                className="add-listing-card"
                onClick={() => navigate('/sell/create-product')}
                style={{ animationDelay: `${listingItems.length * 0.1}s`, opacity: 0, animation: `fadeInUp 0.4s ease ${listingItems.length * 0.1}s forwards` }}
              >
                <div className="add-listing-inner">
                  <div className="add-listing-icon">+</div>
                  <p className="add-listing-text">Add New Listing</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No listings yet</h3>
              <p>Start selling or renting your products today</p>
              <button className="btn-primary" onClick={() => navigate('/sell/create-product')}>
                + Post First Listing
              </button>
            </div>
          )}
        </div>
 
        {/* Tips Banner */}
        <div className="tips-banner">
          <div className="tips-icon">💡</div>
          <div className="tips-text">
            <strong>Pro Tip:</strong> Listings with clear photos and detailed descriptions get 3× more enquiries!
          </div>
          <button className="tips-btn" onClick={() => navigate('/sell/create-product')}>
            Create Listing →
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default SellRentPage;
