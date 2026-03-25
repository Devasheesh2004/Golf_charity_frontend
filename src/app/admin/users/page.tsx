"use client";

import { useApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { Users, Shield, UserX, CheckCircle2, Eye, X, Calendar, CreditCard, Heart } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription_status: string;
  subscription_plan?: string;
  charity_recipient?: string;
  charity?: { name: string };
  created_at?: string;
}

import Loader from "@/components/Loader";

export default function AdminUsersPage() {
  const api = useApi();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.get<UserRecord[]>("/admin/users");
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [api]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-12 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-600" />
            User Directory
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-base sm:text-lg max-w-2xl">Monitor subscribers, roles, and administrative statuses across the platform.</p>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-6 py-6 font-black uppercase tracking-widest">ID & Profile</th>
                <th className="px-6 py-6 font-black uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-6 font-black uppercase tracking-widest">Platform Role</th>
                <th className="px-6 py-6 font-black uppercase tracking-widest">Billing Status</th>
                <th className="px-6 py-6 text-right font-black uppercase tracking-widest">Actions</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-10 py-20 text-center font-bold text-slate-400">Loading Directory...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-10 py-20 text-center font-bold text-slate-400">No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="text-lg font-black text-slate-900">{u.name}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.id.slice(0, 12)}...</div>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-500">{u.email}</td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex w-max items-center gap-2 ${u.role === 'admin' ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-500'}`}>
                      {u.role === 'admin' && <Shield className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex w-max items-center gap-2 ${u.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {u.subscription_status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {u.subscription_status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => setSelectedUser(u)}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all active:scale-95"
                      title="View Profile Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <header className="p-6 sm:p-10 bg-slate-50 flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-600 rounded-3xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black shrink-0">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selectedUser.name}</h2>
                  <p className="text-slate-500 font-bold text-sm sm:text-base">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-3 hover:bg-slate-200 rounded-2xl transition-all self-end sm:self-start"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </header>

            <div className="p-6 sm:p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100">
                  <div className="flex items-center gap-3 text-cyan-600 mb-3">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Platform Role</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 capitalize">{selectedUser.role}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100">
                  <div className="flex items-center gap-3 text-emerald-600 mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Billing Status</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 capitalize">{selectedUser.subscription_status || 'Inactive'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-600">Joined Platform</span>
                  </div>
                  <span className="font-black text-slate-900">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'Unknown'}</span>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-600">Active Plan</span>
                  </div>
                  <span className="font-black text-slate-900 uppercase">{selectedUser.subscription_plan || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="font-bold text-slate-600">Charity Recipient</span>
                  </div>
                  <span className="font-black text-slate-900">{selectedUser.charity?.name || 'Not Selected'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
