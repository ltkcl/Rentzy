import { CATEGORIES } from '../data/products';

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <div className="category-filter">
      <div className="category-scroll">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${selected === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;