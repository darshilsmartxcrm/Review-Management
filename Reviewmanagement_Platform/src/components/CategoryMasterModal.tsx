'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Search,
  Check,
  Sparkles,
  Layers,
  Globe,
  Building2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { IndustryCategory } from '../lib/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addCategory, updateCategory, deleteCategory } from '../slices/categoriesSlice';
import { fetchClients } from '../slices/clientsSlice';

interface CategoryMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const EMOJI_SUGGESTIONS = [
  '🏥', '🦷', '🍽️', '🏋️', '💇', '🚗', '🏢', '💎',
  '⚖️', '🎓', '🏨', '💻', '⭐', '🐾', '🛍️', '🎨',
  '🔧', '📷', '✈️', '🌿', '☕', '👶', '🧘', '👗'
];

export default function CategoryMasterModal({
  isOpen,
  onClose,
  showToast,
}: CategoryMasterModalProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const clients = useAppSelector((state) => state.clients.items);

  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🏷️');
  const [formId, setFormId] = useState('');
  const [formProducts, setFormProducts] = useState('');
  const [formPhraseEn, setFormPhraseEn] = useState('');
  const [formPhraseHi, setFormPhraseHi] = useState('');
  const [formPhraseGu, setFormPhraseGu] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingCat, setDeletingCat] = useState<IndustryCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormName('');
    setFormIcon('🏷️');
    setFormId('');
    setFormProducts('');
    setFormPhraseEn('');
    setFormPhraseHi('');
    setFormPhraseGu('');
  };

  const handleStartEdit = (cat: IndustryCategory) => {
    setIsEditing(true);
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormIcon(cat.icon || '🏷️');
    setFormId(cat.id);
    setFormProducts(cat.defaultProducts?.join(', ') || '');
    setFormPhraseEn(cat.categoryPhrase?.en || '');
    setFormPhraseHi(cat.categoryPhrase?.hi || '');
    setFormPhraseGu(cat.categoryPhrase?.gu || '');
  };

  const handleCancelForm = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingId) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setFormId(slug);

      if (!formPhraseEn) setFormPhraseEn(`${name.toLowerCase()} services`);
      if (!formPhraseHi) setFormPhraseHi(`${name} सेवाएं`);
      if (!formPhraseGu) setFormPhraseGu(`${name} સેવાઓ`);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const prods = formProducts
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const phrases = {
        en: formPhraseEn.trim() || `${formName.toLowerCase()} services`,
        hi: formPhraseHi.trim() || `${formName} सेवाएं`,
        gu: formPhraseGu.trim() || `${formName} સેવાઓ`,
      };

      if (editingId) {
        await dispatch(
          updateCategory({
            id: editingId,
            updates: {
              name: formName.trim(),
              icon: formIcon.trim() || '🏷️',
              categoryPhrase: phrases,
              defaultProducts: prods,
            },
          })
        ).unwrap();
        showToast(`Category "${formName}" updated successfully!`, 'success');
      } else {
        await dispatch(
          addCategory({
            id: formId.trim(),
            name: formName.trim(),
            icon: formIcon.trim() || '🏷️',
            categoryPhrase: phrases,
            defaultProducts: prods,
          })
        ).unwrap();
        showToast(`Category "${formName}" added to Master!`, 'success');
      }

      setIsEditing(false);
      setEditingId(null);
    } catch (err: any) {
      showToast(err || 'Failed to save category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCat) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCategory(deletingCat.id)).unwrap();
      dispatch(fetchClients());
      showToast(`Category "${deletingCat.name}" deleted successfully.`, 'info');
      setDeletingCat(null);
      if (editingId === deletingCat.id) {
        setIsEditing(false);
        setEditingId(null);
      }
    } catch (err: any) {
      showToast(err || 'Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.defaultProducts?.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Category Master
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                  {categories.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage industry categories, keywords, and multilingual 5-star phrasing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartCreate}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* Add / Edit Category Form */}
          {isEditing && (
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl p-1 rounded-lg bg-slate-900 border border-slate-800">{formIcon}</span>
                  <h3 className="text-sm font-bold text-white">
                    {editingId ? `Edit Category: ${formName}` : 'Add New Category to Master'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Category / Industry Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Pet Care & Veterinary Clinic"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Icon / Emoji
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formIcon}
                        onChange={(e) => setFormIcon(e.target.value)}
                        maxLength={4}
                        className="w-14 text-center py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                      <div className="flex flex-wrap gap-1 max-w-[170px]">
                        {EMOJI_SUGGESTIONS.slice(0, 8).map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setFormIcon(em)}
                            className="w-6 h-6 rounded-md hover:bg-slate-800 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Unique Key ID
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. pet_care_veterinary"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700/80 text-xs text-slate-300 font-mono disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Auto-generated lowercase identifier used by client reviews.
                  </p>
                </div>

                {/* Default keywords / tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Default Keywords & Services (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={formProducts}
                    onChange={(e) => setFormProducts(e.target.value)}
                    placeholder="e.g. Pet Vaccination, Dog Grooming, Cat Surgery, Pet Food Supplies"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                {/* Multilingual review wording phrases */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>5-Star Review Auto-Phrasing (English, हिन्दी, ગુજરાતી)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">English Phrase</span>
                      <input
                        type="text"
                        value={formPhraseEn}
                        onChange={(e) => setFormPhraseEn(e.target.value)}
                        placeholder="e.g. veterinary care & services"
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">हिन्दी Phrase</span>
                      <input
                        type="text"
                        value={formPhraseHi}
                        onChange={(e) => setFormPhraseHi(e.target.value)}
                        placeholder="e.g. पशु चिकित्सा और देखभाल"
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">ગુજરાતી Phrase</span>
                      <input
                        type="text"
                        value={formPhraseGu}
                        onChange={(e) => setFormPhraseGu(e.target.value)}
                        placeholder="e.g. પશુ સારવાર અને સંભાળ"
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{editingId ? 'Update Category' : 'Save to Master'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search bar toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category by name, key, or keyword..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Showing <strong>{filteredCategories.length}</strong> of {categories.length} categories</span>
            </div>
          </div>

          {/* TABLE VIEW OF CATEGORIES */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[200px]">Category Name</th>
                  <th className="py-3 px-4 min-w-[140px]">Key ID</th>
                  <th className="py-3 px-4 min-w-[220px]">Default Keywords</th>
                  <th className="py-3 px-4 min-w-[170px]">Review Phrasing</th>
                  <th className="py-3 px-4 w-28 text-center">Clients</th>
                  <th className="py-3 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredCategories.map((cat, idx) => {
                  const activeClientsCount = clients.filter((c) => c.category === cat.id).length;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-slate-850/60 transition group"
                    >
                      {/* Index */}
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">
                        {idx + 1}
                      </td>

                      {/* Icon & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl p-1.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                            {cat.icon || '🏷️'}
                          </span>
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {cat.name}
                            </span>
                            {cat.isSystem && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Key ID */}
                      <td className="py-3 px-4">
                        <code className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                          {cat.id}
                        </code>
                      </td>

                      {/* Default Keywords / Services */}
                      <td className="py-3 px-4">
                        {cat.defaultProducts && cat.defaultProducts.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cat.defaultProducts.slice(0, 3).map((prod, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800"
                              >
                                {prod}
                              </span>
                            ))}
                            {cat.defaultProducts.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-semibold">
                                +{cat.defaultProducts.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No keywords</span>
                        )}
                      </td>

                      {/* Multilingual review phrasing */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          {cat.categoryPhrase?.en && (
                            <div className="text-slate-300 truncate max-w-[180px]">
                              <span className="text-slate-500 font-bold mr-1">EN:</span>
                              {cat.categoryPhrase.en}
                            </div>
                          )}
                          {cat.categoryPhrase?.gu && (
                            <div className="text-indigo-400 truncate max-w-[180px]">
                              <span className="text-slate-500 font-bold mr-1">GU:</span>
                              {cat.categoryPhrase.gu}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* In Use / Clients Count */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            activeClientsCount > 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-900 text-slate-500'
                          }`}
                        >
                          <Building2 className="w-3 h-3" />
                          <span>{activeClientsCount}</span>
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingCat(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-semibold text-white">No categories found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search or click &quot;Add Category&quot; to create one.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Categories saved here appear dynamically across Client Creation &amp; Review Funnels.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deletingCat && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">
                Delete Category &quot;{deletingCat.name}&quot;?
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Are you sure you want to remove this category from the Master?
                {clients.filter((c) => c.category === deletingCat.id).length > 0 && (
                  <span className="block mt-2 text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                    ⚠️ {clients.filter((c) => c.category === deletingCat.id).length} client(s) are currently using this category. Deleting it will safely reassign them to &quot;General&quot;.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCat(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-rose-600/30 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Yes, Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
