"use client";

import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Gift, Heart, TrendingUp, Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

interface CharityRecord {
  id: string;
  name: string;
  description: string;
  featured: boolean;
  total_raised: number;
}

interface FormState {
  name: string;
  description: string;
  featured: boolean;
}

const emptyForm: FormState = { name: "", description: "", featured: false };

export default function AdminCharitiesPage() {
  const api = useApi();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [charities, setCharities] = useState<CharityRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<CharityRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCharities = useCallback(async () => {
    try {
      const data = await api.get<CharityRecord[]>("/charity");
      setCharities(data);
    } catch (err) {
      console.error("Failed to fetch charities", err);
    } finally {
      setFetching(false);
    }
  }, [api]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      } else {
        fetchCharities();
      }
    }
  }, [user, loading, router, fetchCharities]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (charity: CharityRecord) => {
    setEditTarget(charity);
    setForm({ name: charity.name, description: charity.description, featured: charity.featured });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Charity name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { ...form };
      if (editTarget) {
        await api.put(`/admin/charities/${editTarget.id}`, payload);
      } else {
        await api.post("/admin/charities", payload);
      }
      await fetchCharities();
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save charity.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this charity? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.del(`/admin/charities/${id}`);
      await fetchCharities();
    } catch {
      toast.error("Failed to delete charity. It may still have users subscribed to it.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading || fetching) return <Loader />;
  if (user?.role !== "admin") return null;

  return (
    <div className="p-4 sm:p-12 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600" />
            Charity Catalog
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-base sm:text-lg max-w-2xl">
            Add, edit, and remove charitable organizations. Track cumulative distributed impact.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-3 bg-slate-900 hover:bg-slate-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Charity
        </button>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Charities", value: charities.length.toString() },
          { label: "Featured", value: charities.filter(c => c.featured).length.toString() },
          { label: "Total Raised", value: `$${charities.reduce((s, c) => s + (c.total_raised || 0), 0).toLocaleString()}` },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {charities.length === 0 ? (
        <div className="py-32 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
          <Gift className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <p className="text-slate-400 font-bold text-xl">No charities in the catalog yet.</p>
          <button onClick={openAdd} className="mt-6 bg-slate-900 text-white font-black px-8 py-3 rounded-2xl hover:bg-slate-700 transition-all">
            Add First Charity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col justify-between shadow-sm hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/5 transition-all group relative">
              {charity.featured && (
                <div className="absolute top-6 right-6 bg-amber-400 text-white p-2 rounded-xl shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
              <div>
                <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors shadow-inner">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 pr-8">{charity.name}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                  {charity.description || <span className="italic">No description provided.</span>}
                </p>
              </div>
              <div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" /> Lifetime Distributed
                    </div>
                    <div className="text-xl font-black text-emerald-600">${(charity.total_raised || 0).toLocaleString()}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${charity.featured ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    {charity.featured ? "Featured" : "Standard"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEdit(charity)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl transition-all text-sm"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(charity.id)}
                    disabled={deleting === charity.id}
                    className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black py-3 px-4 rounded-2xl transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-6 sm:p-12 w-full max-w-lg shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {editTarget ? "Edit Charity" : "Add New Charity"}
                </h2>
                <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
                  {editTarget ? "Update this organization's details." : "Register a new charitable organization."}
                </p>
              </div>
              <button onClick={closeModal} className="p-3 rounded-2xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 shrink-0">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="p-4 mb-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Organization Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. First Tee"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Mission Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this organization do?"
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`w-14 h-7 rounded-full relative transition-all ${form.featured ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-md ${form.featured ? 'left-8' : 'left-1'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Featured on Homepage</div>
                    <div className="text-xs text-slate-400 font-medium">Appears in the Impact Partners carousel</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={closeModal}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {saving ? "Saving..." : <><Check className="w-5 h-5" /> {editTarget ? "Save Changes" : "Add Charity"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
