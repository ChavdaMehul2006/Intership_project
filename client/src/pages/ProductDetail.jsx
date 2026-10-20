import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
      const reviewsRes = await api.get(`/products/${data._id}/reviews`).catch(() => ({ data: [] }));
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) {
      console.error('Failed to load product details:', err);
      setProduct(null);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    setActiveImage(0);
  }, [slug]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review', 'error');
      return;
    }
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      showToast('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      loadProduct();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit review', 'error');
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20">Product not found.</p>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="card aspect-square overflow-hidden mb-3">
            <img
              src={product.images?.[activeImage] || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  idx === activeImage ? 'border-aura-600' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs text-aura-600 font-medium uppercase">{product.category?.name}</span>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" />
            <span className="text-sm">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold">${product.discountPrice.toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <p className="text-sm mt-3 text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} · Brand: {product.brand}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-gray-200 rounded-xl">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="p-2">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product)} className="btn-secondary">
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        <form onSubmit={submitReview} className="card p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rating:</label>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="input-field w-24"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <textarea
            required
            placeholder="Share your experience with this product..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="input-field"
            rows={3}
          />
          <button type="submit" className="btn-primary text-sm">Submit Review</button>
        </form>

        <div className="space-y-4">
          {(!Array.isArray(reviews) || reviews.length === 0) && <p className="text-gray-500">No reviews yet. Be the first!</p>}
          {(Array.isArray(reviews) ? reviews : []).map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.user?.name || 'Anonymous'}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm">{r.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
