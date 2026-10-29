'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  AlertCircle
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
      router.push('/account');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FAF5EC] rounded-3xl border border-[#F0E6D6] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo showTagline={false} size="large" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight">
            {mode === 'login' ? 'Customer Sign In' : 'Create Your Customer Account'}
          </h1>
          <p className="text-xs text-[#7A162D]/70">
            {mode === 'login'
              ? 'Sign in to access saved Virajpet addresses and view orders'
              : 'Join BeeGo for fast hyperlocal delivery across Virajpete'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#FDFBF7] border border-[#F0E6D6] rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#58111E] text-[#FDFBF7] shadow-xs'
                : 'text-[#7A162D]/70 hover:text-[#380611]'
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
                ? 'bg-[#58111E] text-[#FDFBF7] shadow-xs'
                : 'text-[#7A162D]/70 hover:text-[#380611]'
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
              <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Bopaiah Muthappa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E6D6] text-[#380611] focus:border-[#58111E] outline-hidden placeholder:text-[#7A162D]/40"
                />
                <User className="w-4 h-4 text-[#7A162D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="customer@beegodelivery.in or 9480112233"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E6D6] text-[#380611] focus:border-[#58111E] outline-hidden placeholder:text-[#7A162D]/40"
                />
                <Mail className="w-4 h-4 text-[#7A162D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E6D6] text-[#380611] focus:border-[#58111E] outline-hidden placeholder:text-[#7A162D]/40"
                  />
                  <Mail className="w-4 h-4 text-[#7A162D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  Mobile Number (India)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7A162D]/60">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full text-xs pl-12 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E6D6] text-[#380611] focus:border-[#58111E] outline-hidden placeholder:text-[#7A162D]/40"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E6D6] text-[#380611] focus:border-[#58111E] outline-hidden placeholder:text-[#7A162D]/40"
              />
              <Lock className="w-4 h-4 text-[#7A162D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : mode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#7A162D]/70">
          <Link href="/" className="hover:text-[#380611] font-medium transition-colors">
            ← Continue shopping as guest
          </Link>
        </div>

      </div>
    </div>
  );
}
