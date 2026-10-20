import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get('/categories')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to load categories:', err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ name: '', description: '', image: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description, image: c.image });
    setEditingId(c._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        showToast('Category updated');
      } else {
        await api.post('/categories', form);
        showToast('Category created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    showToast('Category deleted', 'info');
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(Array.isArray(categories) ? categories : []).map((c) => (
          <div key={c._id} className="card p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{c.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-aura-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c._id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{c.description}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Name" className="input-field" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea placeholder="Description" className="input-field" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input placeholder="Image URL" className="input-field" value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <button type="submit" className="btn-primary w-full">
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
