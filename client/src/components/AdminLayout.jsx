import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tags, Users } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/users', label: 'Users', icon: Users }
];

const AdminLayout = () => (
  <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
    <aside className="w-full md:w-56 shrink-0">
      <nav className="card p-3 flex md:flex-col gap-1 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                isActive ? 'bg-aura-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <l.icon className="w-4 h-4" /> {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
