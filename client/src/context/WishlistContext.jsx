import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      api
        .get('/users/wishlist')
        .then(({ data }) => setWishlist(data))
        .catch(() => setWishlist([]));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      showToast('Please login to use wishlist', 'error');
      return;
    }
    const isInWishlist = wishlist.some((p) => p._id === product._id);
    try {
      await api.put(`/users/wishlist/${product._id}`);
      if (isInWishlist) {
        setWishlist((prev) => prev.filter((p) => p._id !== product._id));
        showToast('Removed from wishlist', 'info');
      } else {
        setWishlist((prev) => [...prev, product]);
        showToast('Added to wishlist');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    }
  };

  const isWishlisted = (productId) => wishlist.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
