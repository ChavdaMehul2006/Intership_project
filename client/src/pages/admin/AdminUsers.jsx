import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get('/users')
      .then(({ data }) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to load users:', err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'customer' : 'admin';
    await api.put(`/users/${u._id}/role`, { role: newRole });
    showToast(`${u.name} is now ${newRole}`);
    load();
  };

  const toggleActive = async (u) => {
    await api.put(`/users/${u._id}/role`, { isActive: !u.isActive });
    showToast(`${u.name} ${u.isActive ? 'deactivated' : 'activated'}`);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(users) ? users : []).map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.isActive ? 'Active' : 'Deactivated'}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => toggleRole(u)} className="text-aura-600 text-xs font-medium">
                    Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                  </button>
                  <button onClick={() => toggleActive(u)} className="text-red-500 text-xs font-medium">
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
