'use client';

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  RefreshCw, 
  Edit, 
  X, 
  Power, 
  ShieldCheck 
} from 'lucide-react';
import { API_BASE, CUSTOMER_SITE_URL } from '../../lib/api';

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultStoreForm = {
    name: '',
    type: 'Restaurant',
    categoryName: 'Food & Dining',
    address: 'Main Road, Virajpete',
    phone: '+91 8274 257000',
    deliveryTimeMinutes: '20-30',
    minOrderAmount: 100,
    rating: 4.8,
    isOpen: true,
    image: '',
    licenseNumber: '',
  };

  const [form, setForm] = useState(defaultStoreForm);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/stores`);
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores || []);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleOpenAdd = () => {
    setEditingStore(null);
    setForm(defaultStoreForm);
    setShowAddModal(true);
  };

  const handleOpenEdit = (store) => {
    setEditingStore(store);
    setForm({
      name: store.name || '',
      type: store.type || 'Merchant',
      categoryName: store.categoryName || 'General',
      address: store.address || '',
      phone: store.phone || '',
      deliveryTimeMinutes: store.deliveryTimeMinutes || '20-30',
      minOrderAmount: store.minOrderAmount || 50,
      rating: store.rating || 4.8,
      isOpen: store.isOpen !== undefined ? store.isOpen : true,
      image: store.image || '',
      licenseNumber: store.licenseNumber || '',
    });
    setShowAddModal(true);
  };

  const handleToggleStatus = async (id, currentStatus, name) => {
    try {
      const res = await fetch(`${API_BASE}/api/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleStatus' }),
      });

      if (res.ok) {
        const data = await res.json();
        setStores(stores.map((s) => (s.id === id ? data.store : s)));
        setStatusMessage({
          type: 'success',
          text: `"${name}" is now ${data.store.isOpen ? 'OPEN for orders' : 'TEMPORARILY CLOSED'}. Live on customer site!`,
        });
      } else {
        throw new Error('Failed to update store status');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const isEditing = Boolean(editingStore);
      const url = isEditing ? `${API_BASE}/api/stores/${editingStore.id}` : `${API_BASE}/api/stores`;
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        name: form.name.trim(),
        type: form.type.trim(),
        categoryName: form.categoryName.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        deliveryTimeMinutes: form.deliveryTimeMinutes.trim(),
        minOrderAmount: Number(form.minOrderAmount) || 50,
        rating: Number(form.rating) || 4.8,
        isOpen: Boolean(form.isOpen),
        image: form.image.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        licenseNumber: form.licenseNumber.trim() || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save store');
      }

      const data = await res.json();
      const savedStore = data.store;

      if (isEditing) {
        setStores(stores.map((s) => (s.id === savedStore.id ? savedStore : s)));
        setStatusMessage({
          type: 'success',
          text: `"${savedStore.name}" updated successfully! Changes live on customer site.`,
        });
      } else {
        setStores([...stores, savedStore]);
        setStatusMessage({
          type: 'success',
          text: `New store "${savedStore.name}" added to Virajpet network!`,
        });
      }

      setShowAddModal(false);
      setEditingStore(null);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#380611] tracking-tight">
              Merchant Stores Management
            </h1>
            <span className="bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] text-xs font-black px-2.5 py-0.5 rounded-full">
              {stores.length} {stores.length === 1 ? 'store' : 'stores'}
            </span>
          </div>
          <p className="text-xs text-[#7E6569] mt-1">
            Manage partner merchants in Virajpete town. Toggle store open/closed or edit delivery settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStores}
            className="p-2.5 rounded-xl border border-[#F0E6D6] bg-white text-[#58111E] hover:bg-[#FAF5EC] transition-colors shadow-2xs"
            title="Refresh Stores"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Merchant Store</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border animate-in fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage({ type: '', text: '' })} 
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0E6D6] shadow-2xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search stores by name, category, or road in Virajpet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-4 py-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
          />
          <Search className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStores.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl border border-[#F0E6D6] overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Store Image with Status Overlay */}
              <div className="relative aspect-16/9 bg-[#FAF5EC] overflow-hidden">
                <img
                  src={s.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm border ${
                    s.isOpen 
                      ? 'bg-emerald-600 text-white border-emerald-500' 
                      : 'bg-rose-600 text-white border-rose-500'
                  }`}>
                    {s.isOpen ? '● Open for Orders' : '✕ Closed'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{s.rating}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#7E6569] uppercase tracking-wider">
                    {s.type} • {s.categoryName}
                  </span>
                  <h3 className="text-base font-bold text-[#380611] tracking-tight">
                    {s.name}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-[#7E6569]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#58111E] shrink-0" />
                    <span className="truncate">{s.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#58111E] shrink-0" />
                    <span>{s.deliveryTimeMinutes} mins delivery time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#58111E] shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                </div>

                {s.licenseNumber && (
                  <div className="text-[10px] bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded-xl flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="truncate">Drug Lic: {s.licenseNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-[#FAF5EC]/60 border-t border-[#F0E6D6] flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleStatus(s.id, s.isOpen, s.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border ${
                  s.isOpen
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Power className="w-3 h-3" />
                <span>{s.isOpen ? 'Set as Closed' : 'Open Store'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 rounded-xl bg-white border border-[#F0E6D6] text-[#58111E] hover:bg-[#FAF5EC] transition-colors"
                  title="Edit Store Details"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <a
                  href={`${CUSTOMER_SITE_URL}/stores/${s.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white border border-[#F0E6D6] text-[#58111E] hover:bg-[#FAF5EC] transition-colors"
                  title="View Storefront on Customer Site"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-[#F0E6D6] max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F0E6D6] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#380611]">
                  {editingStore ? `Edit Store: ${editingStore.name}` : 'Add New Merchant in Virajpete'}
                </h2>
                <p className="text-[11px] text-[#7E6569]">
                  {editingStore ? 'Updates immediately reflect on customer storefront' : 'Onboard a local shop to the delivery network'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStore(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-[#F0E6D6] text-[#7E6569] hover:text-[#380611] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  Store / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Coorg Spice Emporium"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Store Type
                  </label>
                  <input
                    type="text"
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="e.g. Restaurant, Supermarket, Pharmacy"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.categoryName}
                    onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    placeholder="e.g. Food & Dining, Grocery"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  Virajpete Address *
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Main Clock Tower Circle, Virajpete"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 8274 257000"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Avg Delivery Time (mins)
                  </label>
                  <input
                    type="text"
                    value={form.deliveryTimeMinutes}
                    onChange={(e) => setForm({ ...form, deliveryTimeMinutes: e.target.value })}
                    placeholder="20-30"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Min Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Store Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  Store Cover Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  License Number (e.g. Pharmacy drug license if applicable)
                </label>
                <input
                  type="text"
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  placeholder="KA-KOD-2024-DRUG-0482"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOpen}
                  onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                  className="rounded text-[#58111E] focus:ring-[#58111E] w-4 h-4"
                />
                <span className="font-semibold text-[#380611]">
                  Open for Deliveries (Customers can place orders)
                </span>
              </label>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#F0E6D6]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStore(null);
                  }}
                  className="px-4 py-2 text-[#7E6569] hover:bg-[#F0E6D6] rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingStore ? 'Save & Update' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
