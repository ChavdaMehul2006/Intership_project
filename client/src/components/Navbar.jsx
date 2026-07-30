import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-aura-600 to-aura-400 bg-clip-text text-transparent">
          AuraShop
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-9"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-4">
          <Link to="/products" className="text-gray-700 hover:text-aura-600 font-medium">
            Shop
          </Link>
          <Link to="/wishlist" className="relative text-gray-700 hover:text-aura-600">
            <Heart className="w-5 h-5" />
          </Link>
          <Link to="/cart" className="relative text-gray-700 hover:text-aura-600">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-aura-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-aura-600" title="Admin Dashboard">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-gray-700 hover:text-aura-600 flex items-center gap-1">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="text-gray-500 hover:text-red-600" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">
              Login
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          <form onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field"
            />
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({totalItems})</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={logout} className="text-left text-red-600">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
