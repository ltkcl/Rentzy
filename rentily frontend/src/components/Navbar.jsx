import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/logos/logowithtext.png" alt="Rentzy" className="h-8" />
        </Link>

        <div className="navbar-links">
          <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`}>
            Browse
          </Link>
          <SignedIn>
            <Link to="/sell" className={`nav-link ${isActive('/sell') ? 'active' : ''}`}>
              My Listings
            </Link>
            <button className="nav-btn" onClick={() => navigate('/sell/create-product')}>
              + Post Listing
            </button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="nav-link auth-btn">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;