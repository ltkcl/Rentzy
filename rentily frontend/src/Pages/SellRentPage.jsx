import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MY_LISTINGS } from '../data/products';
 
const TYPE_LABELS = {
  rent: { label: 'Rent Only', cls: 'tag-rent' },
  sell: { label: 'Buy Only', cls: 'tag-buy' },
  both: { label: 'Rent & Buy', cls: 'tag-both' },
};
 
const formatPrice = (price) =>
  new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);
 
const ListingCard = ({ listing }) => {
  const typeInfo = TYPE_LABELS[listing.type] || TYPE_LABELS.both;
 
  return (
    <div className="listing-card">
      <div className="listing-image-wrap">
        <img src={listing.image} alt={listing.title} className="listing-image" />
        <span className={`listing-status ${listing.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
          {listing.status}
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
              <span className="listing-price-val buy-price">{formatPrice(listing.price)}</span>
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
          <button className="listing-btn edit-btn">✏️ Edit</button>
          <button className="listing-btn delete-btn">🗑️ Remove</button>
        </div>
      </div>
    </div>
  );
};
 
const SellRentPage = () => {
  const navigate = useNavigate();
 
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
              <span className="stat-num">{MY_LISTINGS.length}</span>
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
            <span className="section-badge">{MY_LISTINGS.length} items</span>
          </div>
 
          {MY_LISTINGS.length > 0 ? (
            <div className="listings-grid">
              {MY_LISTINGS.map((listing, i) => (
                <div
                  key={listing.id}
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0, animation: `fadeInUp 0.4s ease ${i * 0.1}s forwards` }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
 
              {/* Add New Card */}
              <div
                className="add-listing-card"
                onClick={() => navigate('/sell/create-product')}
                style={{ animationDelay: `${MY_LISTINGS.length * 0.1}s`, opacity: 0, animation: `fadeInUp 0.4s ease ${MY_LISTINGS.length * 0.1}s forwards` }}
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