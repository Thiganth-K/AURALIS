"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Plus,
  Search,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  likedCount: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userItem: AdminUserItem) => {
    if (userItem.id === currentAdmin?.id) {
      setActionError("You cannot modify your own administrative account status.");
      return;
    }
    setActionError(null);
    const newStatus = userItem.status === "active" ? "suspended" : "active";

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userItem.id ? { ...u, status: newStatus } : u))
          );
        } else {
          const err = await res.json();
          setActionError(err.error || "Failed to update status");
        }
      } catch {
        setActionError("Network error while updating user");
      }
    });
  };

  const handleDeleteUser = async (userItem: AdminUserItem) => {
    if (userItem.id === currentAdmin?.id) {
      setActionError("You cannot delete your own administrative account.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user ${userItem.email}? This action cannot be undone.`)) {
      return;
    }

    setActionError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userItem.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== userItem.id));
        } else {
          const err = await res.json();
          setActionError(err.error || "Failed to delete user");
        }
      } catch {
        setActionError("Network error while deleting user");
      }
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#D7FF3F]" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Audit identities, manage access roles, and control account suspension statuses.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Create User</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="w-full md:w-80 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs">
          <Search className="w-4 h-4 text-[#71717A] shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-[#71717A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#A1A1AA] focus:outline-none focus:border-white/20"
          >
            <option value="all">All Roles</option>
            <option value="user">Listeners (User)</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#A1A1AA] focus:outline-none focus:border-white/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-[#71717A] text-xs">
            No users match the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[#71717A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Liked Songs</th>
                  <th className="py-3.5 px-4 font-semibold">Created</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const isCurrent = u.id === currentAdmin?.id;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {u.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-mono text-[#D7FF3F] bg-[#D7FF3F]/10 px-1 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#71717A] font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            u.role === "admin"
                              ? "bg-[#D7FF3F]/10 text-[#D7FF3F] border border-[#D7FF3F]/20"
                              : "bg-white/5 text-[#A1A1AA] border border-white/10"
                          }`}
                        >
                          {u.role === "admin" && <Shield className="w-2.5 h-2.5" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            u.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === "active" ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                        {u.likedCount || 0}
                      </td>
                      <td className="py-3.5 px-4 text-[#71717A] font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCurrent && (
                            <>
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleToggleStatus(u)}
                                title={u.status === "active" ? "Suspend user" : "Activate user"}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  u.status === "active"
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                }`}
                              >
                                {u.status === "active" ? (
                                  <UserX className="w-3.5 h-3.5" />
                                ) : (
                                  <UserCheck className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleDeleteUser(u)}
                                title="Delete user"
                                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
