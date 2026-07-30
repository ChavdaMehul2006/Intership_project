import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Link to="/products" className="btn-primary inline-block mt-4">Start Shopping</Link>
      </div>
    );
  }

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;
            return (
              <div key={product._id} className="card p-4 flex gap-4 items-center">
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <Link to={`/products/${product.slug}`} className="font-semibold hover:text-aura-600">
                    {product.name}
                  </Link>
                  <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button onClick={() => updateQuantity(product._id, quantity - 1)} className="p-2">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-medium">{quantity}</span>
                  <button onClick={() => updateQuantity(product._id, quantity + 1)} className="p-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-semibold w-20 text-right">${(price * quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(product._id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="card p-6 h-fit space-y-3">
          <h2 className="font-bold text-lg mb-2">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate(user ? '/checkout' : '/login')}
            className="btn-primary w-full mt-2"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
