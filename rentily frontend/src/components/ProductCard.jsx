import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, compact = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product.available) navigate(`/product/${product.id}`);
  };

  const typeLabel = product.rentable && product.forSale
    ? 'Rent & Buy'
    : product.rentable
    ? 'Rent Only'
    : 'Buy Only';

  const typeClass = product.rentable && product.forSale
    ? 'tag-both'
    : product.rentable
    ? 'tag-rent'
    : 'tag-buy';

  return (
    <div
      className={`product-card ${compact ? 'compact' : ''} ${!product.available ? 'unavailable' : ''}`}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="product-card-image-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="product-card-image"
            loading="lazy"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div
          className="product-card-image"
          style={{
            display: product.image ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            fontSize: 40,
          }}
        >
          📦
        </div>
        <div className="product-card-image-overlay" />

        <div className="product-card-badges">
          <span className={`tag ${typeClass}`}>{typeLabel}</span>
        </div>
        <div className="product-card-condition">{product.condition}</div>

        {!product.available && (
          <div className="product-card-unavailable">
            <span>Unavailable</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>

        {product.seller && (
          <div className="product-card-seller">
            <span className="seller-avatar">{product.seller[0]}</span>
            <span className="seller-name">{product.seller}</span>
          </div>
        )}

        <div className="product-card-prices">
          {product.rentable && product.rentPrice != null && (
            <div className="price-item price-rent">
              <span className="price-label">Rent / mo</span>
              <span className="price-value">
                ₹{product.rentPrice}
              </span>
            </div>
          )}
          {product.forSale && (
            <div className="price-item price-buy">
              <span className="price-label">Buy</span>
              <span className="price-value">
                ₹{product.buyPrice}
              </span>
            </div>
          )}
        </div>

        {product.available && (
          <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
            {product.rentable && (
              <button
                className="btn-action rent-btn"
                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
              >
                🔑 Rent
              </button>
            )}
            {product.forSale && (
              <button
                className="btn-action buy-btn"
                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
              >
                🛒 Buy
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
