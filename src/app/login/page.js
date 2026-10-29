'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Store,
  Bike
} from 'lucide-react';
import Logo from '../../components/ui/Logo';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // email or phone for login
    email: '',
    phone: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { identifier: formData.identifier, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify details.');
      }

      await refreshUser();

      // Role based smart redirect
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else if (data.user?.role === 'store_manager') {
        router.push('/store-portal');
      } else if (data.user?.role === 'delivery_partner') {
        router.push('/delivery-portal');
      } else {
        router.push('/');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Helper for Testing
  const handleDemoLogin = (email, password) => {
    setMode('login');
    setFormData((prev) => ({
      ...prev,
      identifier: email,
      password: password,
    }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo showTagline={false} size="large" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back to BeeGo' : 'Create Your BeeGo Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Sign in to access saved Virajpet addresses and track orders'
              : 'Join BeeGo for fast hyperlocal delivery in Virajpete'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Bopaiah Muthappa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@beegodelivery.in or 9480112233"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (India)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full text-xs pl-12 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : mode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Starter Accounts Fast-Login Box */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
            Starter Accounts (Quick Sign-In for Admin & Staff)
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@beegodelivery.in', 'BeeGo@2026Pass!')}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold block truncate">Admin</span>
                <span className="text-[10px] text-slate-400">admin@beego</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('manager@coorgheritage.in', 'BeeGo@2026Pass!')}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold block truncate">Store Manager</span>
                <span className="text-[10px] text-slate-400">manager@coorg</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('driver@beegodelivery.in', 'BeeGo@2026Pass!')}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-1.5 transition-colors"
            >
              <Bike className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold block truncate">Delivery Partner</span>
                <span className="text-[10px] text-slate-400">driver@beego</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('customer@beegodelivery.in', 'BeeGo@2026Pass!')}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold block truncate">Customer</span>
                <span className="text-[10px] text-slate-400">customer@beego</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

