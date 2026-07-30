import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-16 bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">AuraShop</h3>
        <p className="text-sm text-gray-400">
          A premium shopping destination for electronics, fashion, home, beauty and more.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-2">Shop</h4>
        <ul className="space-y-1 text-sm">
          <li><Link to="/products" className="hover:text-aura-400">All Products</Link></li>
          <li><Link to="/products?featured=true" className="hover:text-aura-400">Featured</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-2">Account</h4>
        <ul className="space-y-1 text-sm">
          <li><Link to="/profile" className="hover:text-aura-400">My Profile</Link></li>
          <li><Link to="/orders" className="hover:text-aura-400">Order History</Link></li>
          <li><Link to="/wishlist" className="hover:text-aura-400">Wishlist</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-2">Support</h4>
        <p className="text-sm text-gray-400">support@aurashop.example</p>
      </div>
    </div>
    <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} AuraShop. All rights reserved.
    </div>
  </footer>
);

export default Footer;
