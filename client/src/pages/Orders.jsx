import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const OrderDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-aura-600 text-sm">&larr; Back to orders</Link>
      <div className="card p-6 mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-3">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <span>{item.name} x{item.quantity}</span>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-800 mb-1">Shipping Address</h3>
          <p>{order.shippingAddress.line1}, {order.shippingAddress.line2}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country} · {order.shippingAddress.phone}</p>
        </div>
      </div>
    </div>
  );
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="card p-4 flex justify-between items-center hover:shadow-lg transition">
              <div>
                <p className="font-semibold">Order #{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[o.status]}`}>
                  {o.status}
                </span>
                <span className="font-bold">${o.totalPrice.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { id } = useParams();
  return id ? <OrderDetail orderId={id} /> : <OrdersList />;
};

export default Orders;
