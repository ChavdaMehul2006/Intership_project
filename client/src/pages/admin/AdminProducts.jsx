import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';

const emptyForm = {
  name: '', description: '', price: '', discountPrice: '', category: '',
  brand: '', stock: '', tags: '', isFeatured: false, images: ''
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      api.get('/products', { params: { limit: 1000 } }),
      api.get('/categories')
    ]);
    setProducts(productsRes.data.products);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || '',
      category: p.category?._id || p.category,
      brand: p.brand,
      stock: p.stock,
      tags: (p.tags || []).join(', '),
      isFeatured: p.isFeatured,
      images: (p.images || []).join(', ')
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images.split(',').map((i) => i.trim()).filter(Boolean)
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        showToast('Product updated');
      } else {
        await api.post('/products', payload);
        showToast('Product created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    showToast('Product deleted', 'info');
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="p-3 flex items-center gap-2">
                  <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  {p.name}
                </td>
                <td className="p-3">{p.category?.name}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-aura-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Name" className="input-field" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea required placeholder="Description" className="input-field" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Price" className="input-field" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input type="number" placeholder="Discount Price" className="input-field" value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
              </div>
              <select required className="input-field" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Brand" className="input-field" value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                <input required type="number" placeholder="Stock" className="input-field" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <input placeholder="Tags (comma separated)" className="input-field" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <input placeholder="Image URLs (comma separated)" className="input-field" value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured Product
              </label>
              <button type="submit" className="btn-primary w-full">
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
