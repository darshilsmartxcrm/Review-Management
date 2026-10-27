'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  Plus,
  Search,
  Building2,
  ExternalLink,
  QrCode,
  Share2,
  Edit2,
  Trash2,
  Settings,
  LogOut,
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  Printer,
  Users,
  CheckCircle,
  Inbox,
  MessageCircle,
  Phone,
  Rocket,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { Client, Lead, IndustryKey } from '../../lib/types';
import {
  INDUSTRY_CATALOG,
  buildClientReviewUrl,
  buildClientStandeeUrl,
  encodeClientData,
  isClientExpired,
  isClientUpcoming,
  isClientActive,
  getClientDaysLeft,
  getDaysUntilStart,
  formatExpiryDate,
  formatDate,
  formatDateRange,
  parseLocalDate
} from '../../lib/data';
import {
  getStoredClients,
  saveStoredClients,
  getStoredLeads,
  saveStoredLeads,
  getAdminCredentials,
  isUserAuthenticated,
  setSessionAuthenticated,
  clearSessionAuth,
} from '../../lib/storage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginAdmin, logoutAdmin, checkAuthSession } from '../../slices/authSlice';
import { fetchClients, saveClient, deleteClient, setClientsDirect } from '../../slices/clientsSlice';
import { fetchLeads, addLead, removeLead } from '../../slices/leadsSlice';
import { fetchSettings } from '../../slices/settingsSlice';
import ClientModal from '../../components/ClientModal';
import QrCodeModal from '../../components/QrCodeModal';
import WhatsAppModal from '../../components/WhatsAppModal';
import ApplyLeadModal from '../../components/ApplyLeadModal';
import SettingsModal from '../../components/SettingsModal';
import Toast from '../../components/Toast';

export default function SmartXCRMAdminPortalPage() {
  const dispatch = useAppDispatch();
  const reduxAuth = useAppSelector((state) => state.auth);
  const reduxClients = useAppSelector((state) => state.clients.items);
  const reduxLeads = useAppSelector((state) => state.leads.items);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Login form states
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string>('');

  // Dashboard states
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'upcoming' | 'expired'>('all');
  const [showLeadsView, setShowLeadsView] = useState<boolean>(false);

  // Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [selectedQrClient, setSelectedQrClient] = useState<Client | null>(null);

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [selectedWhatsAppClient, setSelectedWhatsAppClient] = useState<Client | null>(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    // 1. Initial local state fallback
    const localClients = getStoredClients();
    setClients(localClients);
    setLeads(getStoredLeads());

    // 2. Validate JWT session and fetch latest data
    dispatch(checkAuthSession()).then((res) => {
      if (checkAuthSession.fulfilled.match(res)) {
        setIsAuthenticated(true);
        dispatch(fetchClients());
        dispatch(fetchLeads());
        dispatch(fetchSettings());
      } else {
        const authed = isUserAuthenticated();
        setIsAuthenticated(authed);
        if (authed) {
          dispatch(fetchClients());
          dispatch(fetchLeads());
          dispatch(fetchSettings());
        }
      }
      setIsAuthChecking(false);
    });
  }, [dispatch]);

  // Sync Redux clients to local view
  useEffect(() => {
    if (reduxClients && reduxClients.length > 0) {
      setClients(reduxClients);
    }
  }, [reduxClients]);

  // Sync Redux leads to local view
  useEffect(() => {
    if (reduxLeads && reduxLeads.length > 0) {
      setLeads(reduxLeads);
    }
  }, [reduxLeads]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const action = await dispatch(
      loginAdmin({
        creds: { username: loginUsername.trim(), password: loginPassword },
        remember: rememberMe,
      })
    );

    if (loginAdmin.fulfilled.match(action)) {
      setIsAuthenticated(true);
      dispatch(fetchClients());
      dispatch(fetchLeads());
      dispatch(fetchSettings());
      showToast('Welcome back to SmartXCRM_admin!');
    } else {
      setLoginError((action.payload as string) || 'Invalid Login ID or Password. Please try again.');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of SmartXCRM_admin?')) {
      dispatch(logoutAdmin());
      setIsAuthenticated(false);
      showToast('Logged out successfully.', 'info');
    }
  };

  const handleSaveClient = (clientData: Client) => {
    dispatch(saveClient(clientData));
    showToast(editingClient ? `Updated "${clientData.name}" successfully!` : `Created new funnel for "${clientData.name}"!`);
    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch(deleteClient(id));
      showToast(`Deleted client "${name}"`, 'info');
    }
  };

  const handleAddLead = (newLead: Lead) => {
    dispatch(addLead(newLead));
    showToast('Inquiry submitted successfully!');
  };

  const handleDeleteLead = (id: string) => {
    dispatch(removeLead(id));
    showToast('Inquiry removed');
  };

  const handleQuickRenew = (client: Client, months: number = 3) => {
    const baseDate = client.expiry_date && !isNaN(parseLocalDate(client.expiry_date).getTime())
      ? parseLocalDate(client.expiry_date)
      : new Date();
    baseDate.setMonth(baseDate.getMonth() + months);
    const y = baseDate.getFullYear();
    const m = String(baseDate.getMonth() + 1).padStart(2, '0');
    const d = String(baseDate.getDate()).padStart(2, '0');
    const newExpiry = `${y}-${m}-${d}`;

    const updatedClient = { ...client, expiry_date: newExpiry };
    dispatch(saveClient(updatedClient));
    showToast(`Extended "${client.name}" until ${formatExpiryDate(newExpiry)}!`);
  };

  const activeCount = clients.filter((c) => isClientActive(c)).length;
  const upcomingCount = clients.filter((c) => isClientUpcoming(c)).length;
  const expiredCount = clients.filter((c) => isClientExpired(c)).length;

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.person_name && c.person_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.keywords && c.keywords.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && isClientActive(c)) ||
      (selectedStatus === 'upcoming' && isClientUpcoming(c)) ||
      (selectedStatus === 'expired' && isClientExpired(c));

    return matchesSearch && matchesCat && matchesStatus;
  });

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verifying SmartXCRM_admin...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // SECRET SmartXCRM_admin LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-7 sm:p-9 backdrop-blur-xl relative z-10">

          {/* Logo & Brand */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30 mb-3.5">
              <Star className="w-7 h-7 fill-white text-white" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest mb-2">
              SmartXCRM_admin
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              SmartXCRM_admin
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review Growth Hub • Authorized personnel only. Enter credentials to manage review campaigns.
            </p>
          </div>

          {/* Error alert */}
          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Login ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter login username"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to SmartXCRM_admin</span>
            </button>
          </form>

          {/* Back to Home public site link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-indigo-400 font-medium transition inline-flex items-center gap-1.5"
            >
              <span>← Back to Public Homepage</span>
            </Link>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED SmartXCRM_admin DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">
                  SmartXCRM_admin
                </h1>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Review Growth Hub • English • हिन्दी • ગુજરાતી
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition"
              title="View Public Homepage"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={() => setShowLeadsView(!showLeadsView)}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${showLeadsView
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              title="View Inquiries & Leads"
            >
              <Inbox className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Inquiries</span>
              {leads.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {leads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setEditingClient(null);
                setIsClientModalOpen(true);
              }}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">{clients.length}</p>
              <p className="text-xs text-slate-400 font-medium">Businesses</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">{activeCount}</p>
              <p className="text-xs text-slate-400 font-medium">Active Now</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">{upcomingCount}</p>
              <p className="text-xs text-slate-400 font-medium">Scheduled</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${expiredCount > 0
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">{expiredCount}</p>
              <p className="text-xs text-slate-400 font-medium">Expired</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3 col-span-2 lg:col-span-1">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">{leads.length}</p>
              <p className="text-xs text-slate-400 font-medium">Inquiries</p>
            </div>
          </div>
        </div>

        {/* If Leads Drawer is active */}
        {showLeadsView && (
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Business Leads & Inquiries ({leads.length})</h3>
              </div>
              <button
                onClick={() => setShowLeadsView(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close View
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No inquiries submitted yet. When businesses submit inquiries, they appear here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      title="Delete lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="font-bold text-white text-sm">{lead.name}</div>
                    <div className="text-xs text-slate-400 font-medium">🏢 {lead.business} • {lead.city}</div>
                    <div className="text-xs text-indigo-400 font-semibold">🏷️ {lead.industry}</div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.name}, regarding your review funnel inquiry for ${lead.business}...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 text-[11px] font-bold hover:bg-emerald-600/30 transition flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by business, doctor, or city..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Status & Industry Category Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Tabs */}
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${selectedStatus === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                All ({clients.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${selectedStatus === 'active'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-400/80 hover:text-emerald-300'
                  }`}
              >
                <span>Active ({activeCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${selectedStatus === 'upcoming'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-400/80 hover:text-amber-300'
                  }`}
              >
                <span>Upcoming ({upcomingCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('expired')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${selectedStatus === 'expired'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-rose-400/80 hover:text-rose-300'
                  }`}
              >
                <span>Expired ({expiredCount})</span>
              </button>
            </div>

            {/* Industry Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
            >
              <option value="all">All Industries ({clients.length})</option>
              {Object.values(INDUSTRY_CATALOG).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 my-8">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No clients found</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search query or industry filter.'
                : 'Click "Add Client" to create your first 5-star review funnel.'}
            </p>
            <button
              onClick={() => {
                setEditingClient(null);
                setIsClientModalOpen(true);
              }}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Client</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => {
              const catInfo = INDUSTRY_CATALOG[client.category] || INDUSTRY_CATALOG.general;
              const encoded = encodeClientData(client);
              const keywordsList = client.keywords ? client.keywords.split(',').map((k) => k.trim()).filter(Boolean) : [];

              return (
                <div
                  key={client.id}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  <div className="p-5 sm:p-6 space-y-3.5">

                    {/* Header bar */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-2 rounded-xl bg-slate-800 border border-slate-700/60">
                          {catInfo.icon}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                            {catInfo.name.split(',')[0]}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {client.default_lang === 'gu' ? '🇮🇳 ગુજરાતી' : client.default_lang === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setIsClientModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                          title="Edit Client Business"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                          title="Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Validity & Renewal Status Badge */}
                    <div className="flex items-center justify-between pt-0.5">
                      {isClientUpcoming(client) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Upcoming • in {getDaysUntilStart(client.start_date)}d</span>
                        </span>
                      ) : isClientExpired(client) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Expired ({formatExpiryDate(client.expiry_date)})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active • {getClientDaysLeft(client.expiry_date)}d left</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleQuickRenew(client, 3)}
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-200 px-2 py-0.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
                        title="Extend End Date (+3 Months)"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>+3 Mo</span>
                      </button>
                    </div>

                    {/* Date Access Window */}
                    <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-xl border border-slate-800/60">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{formatDateRange(client.start_date, client.expiry_date)}</span>
                    </div>

                    {/* Name & Details */}
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-300 transition">
                        {client.name}
                      </h3>
                      {client.person_name && (
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                          {client.person_name}
                        </p>
                      )}
                      <p className="text-[11px] font-bold text-indigo-400 tracking-wide uppercase mt-1">
                        📍 {client.city}
                      </p>
                    </div>

                    {/* Keywords pills */}
                    {keywordsList.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {keywordsList.slice(0, 4).map((kw) => (
                          <span
                            key={kw}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                        {keywordsList.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                            +{keywordsList.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Card Action Toolbar */}
                  <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 grid grid-cols-4 gap-1.5">

                    {/* Live Funnel */}
                    <Link
                      href={buildClientReviewUrl('', client)}
                      target="_blank"
                      className="py-2 px-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition flex flex-col items-center justify-center gap-1 text-center"
                      title="Open Live Funnel"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Funnel</span>
                    </Link>

                    {/* Standee Print */}
                    <Link
                      href={buildClientStandeeUrl('', client)}
                      target="_blank"
                      className="py-2 px-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold transition flex flex-col items-center justify-center gap-1 text-center"
                      title="Print Standee Card"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Standee</span>
                    </Link>

                    {/* QR Code */}
                    <button
                      onClick={() => {
                        setSelectedQrClient(client);
                        setIsQrModalOpen(true);
                      }}
                      className="py-2 px-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                      title="Download QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>QR Code</span>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => {
                        setSelectedWhatsAppClient(client);
                        setIsWhatsAppModalOpen(true);
                      }}
                      className="py-2 px-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                      title="Share with Business Owner"
                    >
                      <Share2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Share</span>
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        client={editingClient}
        onClose={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        client={selectedQrClient}
        onClose={() => {
          setIsQrModalOpen(false);
          setSelectedQrClient(null);
        }}
      />

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        client={selectedWhatsAppClient}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setSelectedWhatsAppClient(null);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        clients={clients}
        onClose={() => setIsSettingsModalOpen(false)}
        onRefreshClients={(newClients) => setClients(newClients)}
        onShowToast={showToast}
      />

      <ApplyLeadModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitLead={handleAddLead}
      />
    </div>
  );
}
