import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', { name });
      setUser(data);
      localStorage.setItem('aurashop_user', JSON.stringify(data));
      showToast('Profile updated');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/password', passwords);
      showToast('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <form onSubmit={handleProfileUpdate} className="card p-6 space-y-3">
        <h2 className="font-bold">Basic Info</h2>
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="input-field mt-1 bg-gray-100" value={user?.email} disabled />
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>

      <form onSubmit={handlePasswordUpdate} className="card p-6 space-y-3">
        <h2 className="font-bold">Change Password</h2>
        <input
          type="password"
          required
          placeholder="Current password"
          className="input-field"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="New password"
          className="input-field"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <button type="submit" className="btn-primary">Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
