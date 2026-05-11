import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="font-teko text-3xl text-lime-400 uppercase">Admin</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/admin" className="hover:text-lime-400">Dashboard</Link>
            <Link to="/admin/orders" className="hover:text-lime-400">Orders</Link>
            <Link to="/admin/products" className="hover:text-lime-400">Products</Link>
            <Link to="/admin/discounts" className="hover:text-lime-400">Discounts</Link>
            <Link to="/admin/users" className="hover:text-lime-400">Users</Link>
            <Link to="/" className="text-slate-500 hover:text-white">← Site</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });
  useEffect(() => {
    (async () => {
      const [orders, users, products] = await Promise.all([
        supabase.from('orders').select('total', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
      ]);
      const revenue = (orders.data || []).reduce((s: number, o: any) => s + Number(o.total || 0), 0);
      setStats({ orders: orders.count || 0, revenue, users: users.count || 0, products: products.count || 0 });
    })();
  }, []);
  const Card = ({ label, value }: { label: string; value: string | number }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="text-3xl font-teko text-lime-400 mt-2">{value}</div>
    </div>
  );
  return (
    <div>
      <h1 className="font-teko text-4xl mb-6 uppercase">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Orders" value={stats.orders} />
        <Card label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
        <Card label="Users" value={stats.users} />
        <Card label="Products" value={stats.products} />
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
    setOrders(data || []);
  };
  useEffect(() => { load(); }, []);
  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status: status as any }).eq('id', id);
    load();
  };
  return (
    <div>
      <h1 className="font-teko text-4xl mb-6 uppercase">Orders</h1>
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-xs uppercase">
            <tr>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-slate-800">
                <td className="p-3 font-mono">{o.order_number}</td>
                <td className="p-3">{o.email}</td>
                <td className="p-3">${Number(o.total).toFixed(2)}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="bg-slate-800 border border-slate-700 rounded px-2 py-1">
                    {['Pending','Processing','Shipped','Delivered','Cancelled'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">{o.payment_status}</td>
                <td className="p-3 text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('products').select('id,name,price,in_stock,stock_quantity').order('name').limit(200).then(({ data }) => setProducts(data || []));
  }, []);
  const togglePrice = async (id: string, price: number) => {
    const next = prompt('New price:', String(price));
    if (next == null) return;
    await supabase.from('products').update({ price: parseFloat(next) }).eq('id', id);
    setProducts((p) => p.map((x) => x.id === id ? { ...x, price: parseFloat(next) } : x));
  };
  return (
    <div>
      <h1 className="font-teko text-4xl mb-6 uppercase">Products</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-xs uppercase">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-800">
                <td className="p-3">{p.name}</td>
                <td className="p-3">${Number(p.price).toFixed(2)}</td>
                <td className="p-3">{p.stock_quantity} {p.in_stock ? '' : '(out)'}</td>
                <td className="p-3"><button onClick={() => togglePrice(p.id, p.price)} className="text-lime-400 hover:underline">Edit price</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Discounts() {
  const [codes, setCodes] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [pct, setPct] = useState(10);
  const load = async () => {
    const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
  };
  useEffect(() => { load(); }, []);
  const create = async () => {
    if (!code) return;
    await supabase.from('discount_codes').insert({ code: code.toUpperCase(), percentage: pct, active: true });
    setCode(''); setPct(10);
    load();
  };
  const toggle = async (id: string, active: boolean) => {
    await supabase.from('discount_codes').update({ active: !active }).eq('id', id);
    load();
  };
  return (
    <div>
      <h1 className="font-teko text-4xl mb-6 uppercase">Discounts</h1>
      <div className="flex gap-2 mb-6">
        <input className="bg-slate-800 border border-slate-700 px-3 py-2 rounded" placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <input type="number" className="bg-slate-800 border border-slate-700 px-3 py-2 rounded w-24" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
        <button onClick={create} className="bg-lime-500 text-slate-900 font-bold px-4 rounded">Add</button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-xs uppercase"><tr><th className="text-left p-3">Code</th><th className="text-left p-3">%</th><th className="text-left p-3">Uses</th><th className="text-left p-3">Active</th></tr></thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} className="border-t border-slate-800">
                <td className="p-3 font-mono">{c.code}</td>
                <td className="p-3">{c.percentage}%</td>
                <td className="p-3">{c.uses_count}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                <td className="p-3"><button onClick={() => toggle(c.id, c.active)} className={c.active ? 'text-green-400' : 'text-red-400'}>{c.active ? 'On' : 'Off'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from('profiles').select('id,email,display_name,created_at,user_roles(role)').order('created_at', { ascending: false }).limit(200);
    setUsers(data || []);
  };
  useEffect(() => { load(); }, []);
  const setRole = async (uid: string, role: 'user' | 'admin' | 'moderator') => {
    await supabase.from('user_roles').delete().eq('user_id', uid);
    await supabase.from('user_roles').insert({ user_id: uid, role });
    load();
  };
  return (
    <div>
      <h1 className="font-teko text-4xl mb-6 uppercase">Users</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-xs uppercase"><tr><th className="text-left p-3">Email</th><th className="text-left p-3">Name</th><th className="text-left p-3">Role</th><th className="text-left p-3">Actions</th></tr></thead>
          <tbody>
            {users.map((u) => {
              const role = u.user_roles?.[0]?.role || 'user';
              return (
                <tr key={u.id} className="border-t border-slate-800">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.display_name}</td>
                  <td className="p-3">{role}</td>
                  <td className="p-3">
                    <select value={role} onChange={(e) => setRole(u.id, e.target.value as any)} className="bg-slate-800 border border-slate-700 rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c]"><div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?redirect=/admin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="discounts" element={<Discounts />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </AdminLayout>
  );
}
