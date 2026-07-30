import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products', { params: { featured: true, limit: 8 } }),
          api.get('/categories')
        ]);
        setFeatured(productsRes.data.products);
        setCategories(categoriesRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-aura-600 via-aura-500 to-aura-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <span className="glass px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> New Season Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            Shop the Look. Live the Aura.
          </h1>
          <p className="max-w-xl text-white/90">
            Discover premium electronics, fashion, home essentials, and beauty products —
            all in one glassmorphic shopping experience.
          </p>
          <Link to="/products" className="bg-white text-aura-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
            Start Shopping
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On orders over $500' },
          { icon: ShieldCheck, title: 'Secure Payments', desc: 'JWT-secured checkout' },
          { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return window' }
        ].map((f) => (
          <div key={f.title} className="card p-5 flex items-center gap-4">
            <f.icon className="w-8 h-8 text-aura-600" />
            <div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="card p-4 text-center hover:shadow-lg transition"
            >
              <p className="font-medium text-gray-800">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-aura-600 text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
