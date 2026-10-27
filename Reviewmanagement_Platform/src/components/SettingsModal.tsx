'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound, Download, Upload, RotateCcw, Check, Phone, MessageSquare } from 'lucide-react';
import { AdminCredentials, Client } from '../lib/types';
import {
  getAdminCredentials,
  saveAdminCredentials,
  saveStoredClients,
  getAgencyContactNumber,
  saveAgencyContactNumber
} from '../lib/storage';
import { DEFAULT_CLIENTS } from '../lib/data';
import { settingsApi } from '../api/settingsApi';
import { authApi } from '../api/authApi';
import { clientsApi } from '../api/clientsApi';

interface SettingsModalProps {
  isOpen: boolean;
  clients: Client[];
  onClose: () => void;
  onRefreshClients: (newClients: Client[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function SettingsModal({
  isOpen,
  clients,
  onClose,
  onRefreshClients,
  onShowToast,
}: SettingsModalProps) {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Agency Support Contact Number
  const [agencyPhone, setAgencyPhone] = useState(getAgencyContactNumber());
  const [phoneSaved, setPhoneSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAgencyPhone(getAgencyContactNumber());
      settingsApi.fetchSettings().then((remote) => {
        if (remote && remote.agencyPhone) {
          setAgencyPhone(remote.agencyPhone);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAgencyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = agencyPhone.replace(/\D/g, '');
    if (!clean || clean.length < 10) {
      onShowToast('Please enter a valid phone number with country code (e.g. 919876543210)', 'error');
      return;
    }
    saveAgencyContactNumber(clean);
    try {
      await settingsApi.updateSettings({ agencyPhone: clean });
    } catch {}

    setPhoneSaved(true);
    onShowToast(`Agency contact number set to +${clean}! All client renewal & query links updated.`, 'success');
    setTimeout(() => setPhoneSaved(false), 2500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !newPassword) {
      onShowToast('Please fill in both username and password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Passwords do not match!', 'error');
      return;
    }

    const newCreds: AdminCredentials = {
      username: username.trim(),
      password: newPassword,
    };
    saveAdminCredentials(newCreds);

    try {
      await authApi.changePassword(newPassword);
    } catch (err: any) {
      console.warn('Backend password update notice:', err);
    }

    setSavedSuccess(true);
    onShowToast('Admin credentials updated successfully!', 'success');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `review_growth_hub_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported clients backup file successfully!', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            saveStoredClients(parsed);
            onRefreshClients(parsed);
            clientsApi.syncAllClients(parsed).catch(() => {});
            onShowToast(`Successfully imported ${parsed.length} clients!`, 'success');
          } else {
            onShowToast('Invalid JSON file format', 'error');
          }
        } catch (err) {
          onShowToast('Error reading file. Please upload a valid JSON.', 'error');
        }
      };
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all clients to default demo data? Your current custom clients will be overwritten.')) {
      saveStoredClients(DEFAULT_CLIENTS);
      onRefreshClients(DEFAULT_CLIENTS);
      onShowToast('Reset to default sample clients.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-400" />
          <span>Dashboard Settings</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Set agency support contact number, update admin credentials, and manage client data backups.
        </p>

        {/* Agency WhatsApp & Support Contact Number */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agency WhatsApp & Support Number</span>
            </h4>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Master Contact
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Whenever a client's review funnel expires or if a client has any query, all renewal requests, support links, and WhatsApp buttons across all funnels will connect directly to this number.
          </p>

          <form onSubmit={handleSaveAgencyPhone} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Support WhatsApp & Phone Number (with Country Code)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  placeholder="e.g. 919876543210 (Country code + 10 digits)"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {phoneSaved ? <Check className="w-3.5 h-3.5 text-white" /> : <Phone className="w-3.5 h-3.5" />}
                <span>{phoneSaved ? 'Contact Number Saved!' : 'Save Contact Number'}</span>
              </button>

              <a
                href={`https://wa.me/${agencyPhone.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Agency Support, testing contact number integration!')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Test WhatsApp connection with this number"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Chat</span>
              </a>
            </div>
          </form>
        </div>

        {/* Password Update Form */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Change Admin Password</span>
          </h4>

          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Admin Username / Login ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="New admin username"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Updated Successfully!' : 'Save New Credentials'}</span>
            </button>
          </form>
        </div>

        {/* Data Backup & Restore */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Backup & Data Management
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJSON}
              className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Clients JSON</span>
            </button>

            <label className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Clients JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleResetDefaults}
            className="w-full py-2 px-3 rounded-xl border border-rose-900/40 bg-rose-950/30 hover:bg-rose-950/60 text-xs font-semibold text-rose-300 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Demo Clients</span>
          </button>
        </div>

      </div>
    </div>
  );
}
