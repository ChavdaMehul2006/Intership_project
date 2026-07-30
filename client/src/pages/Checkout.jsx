import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', postalCode: '', country: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      showToast('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <p className="text-center py-20 text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-bold">Shipping Address</h2>
            <input required placeholder="Address line 1" className="input-field"
              value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            <input placeholder="Address line 2 (optional)" className="input-field"
              value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="City" className="input-field"
                value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input required placeholder="State" className="input-field"
                value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <input required placeholder="Postal Code" className="input-field"
                value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
              <input required placeholder="Country" className="input-field"
                value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>
            <input required placeholder="Phone Number" className="input-field"
              value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          </div>

          <div className="card p-6 space-y-2">
            <h2 className="font-bold mb-2">Payment Method</h2>
            {[
              { id: 'cod', label: 'Cash on Delivery' },
              { id: 'card', label: 'Credit / Debit Card' },
              { id: 'upi', label: 'UPI' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6 h-fit space-y-3">
          <h2 className="font-bold text-lg mb-2">Order Summary</h2>
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex justify-between text-sm text-gray-600">
              <span>{product.name} x{quantity}</span>
              <span>${((product.discountPrice > 0 ? product.discountPrice : product.price) * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span><span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={placing} className="btn-primary w-full mt-2">
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
