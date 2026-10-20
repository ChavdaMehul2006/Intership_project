import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products', { params: { limit: 1000 } }).catch(() => ({ data: { total: 0, products: [] } })),
        api.get('/orders/all').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);

      const orders = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
      const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const monthly = {};
      orders.forEach((o) => {
        const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
        monthly[month] = (monthly[month] || 0) + (o.totalPrice || 0);
      });
      const chartData = Object.entries(monthly).map(([month, total]) => ({ month, total }));

      setStats({
        productCount: productsRes?.data?.total || (Array.isArray(productsRes?.data?.products) ? productsRes.data.products.length : 0),
        orderCount: orders.length,
        userCount: Array.isArray(usersRes?.data) ? usersRes.data.length : 0,
        revenue,
        chartData
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Products', value: stats.productCount, icon: Package, to: '/admin/products' },
    { label: 'Total Orders', value: stats.orderCount, icon: ShoppingBag, to: '/admin/orders' },
    { label: 'Total Users', value: stats.userCount, icon: Users, to: '/admin/users' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, to: '/admin/orders' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card p-5 hover:shadow-lg transition">
            <c.icon className="w-6 h-6 text-aura-600 mb-2" />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-bold mb-4">Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
