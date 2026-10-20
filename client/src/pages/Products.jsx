import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to load categories:', err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', {
        params: { keyword, category, sort, page, minPrice, maxPrice, limit: 12 }
      })
      .then(({ data }) => {
        const prodList = data?.products || data;
        setProducts(Array.isArray(prodList) ? prodList : []);
        setPages(data?.pages || 1);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <div className="card p-4 space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Filter className="w-4 h-4" /> Filters
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <select
                className="input-field mt-1"
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {(Array.isArray(categories) ? categories : []).map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Min $</label>
                <input
                  type="number"
                  className="input-field mt-1"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Max $</label>
                <input
                  type="number"
                  className="input-field mt-1"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Sort By</label>
              <select
                className="input-field mt-1"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-xl font-bold mb-4">
            {keyword ? `Results for "${keyword}"` : 'All Products'}
          </h1>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {(Array.isArray(products) ? products : []).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        p === page ? 'bg-aura-600 text-white' : 'bg-white border border-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
