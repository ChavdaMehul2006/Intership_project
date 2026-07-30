import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="card overflow-hidden group flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || 'https://picsum.photos/seed/placeholder/600/600'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-aura-600 font-medium uppercase tracking-wide">
          {product.category?.name}
        </span>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1 hover:text-aura-600">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1 text-amber-500 text-sm">
          <Star className="w-4 h-4 fill-amber-500" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-gray-400">({product.numReviews || 0})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="font-bold text-gray-900">${product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="btn-primary mt-3 w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
