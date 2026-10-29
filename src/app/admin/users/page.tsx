"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Filter,
  Shield,
  MoreVertical,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "pending" | "rejected";
  likedCount: number;
  createdAt: string;
}

const WIDE_SOUNDWAVE_BARS = [
  8, 12, 17, 24, 30, 38, 46, 54, 60, 65, 70, 74, 76, 74, 70, 65, 60, 54, 46, 38, 30, 24, 17, 12, 8
];

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
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

  // Close action menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSetStatus = async (
    userItem: AdminUserItem,
    newStatus: "active" | "suspended" | "pending" | "rejected"
  ) => {
    if (userItem.id === currentAdmin?.id) {
      setActionError("You cannot modify your own administrative account status.");
      return;
    }
    setActionError(null);
    setSuccessMessage(null);
    setActiveMenuId(null);

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
          if (newStatus === "active") {
            setSuccessMessage(`Account request for ${userItem.email} has been approved.`);
          } else if (newStatus === "rejected") {
            setSuccessMessage(`Registration request for ${userItem.email} has been rejected.`);
          } else if (newStatus === "suspended") {
            setSuccessMessage(`User ${userItem.email} has been suspended.`);
          }
        } else {
          const err = await res.json();
          setActionError(err.error || "Failed to update status");
        }
      } catch {
        setActionError("Network error while updating user");
      }
    });
  };

  const handleToggleRole = async (userItem: AdminUserItem) => {
    if (userItem.id === currentAdmin?.id) {
      setActionError("You cannot modify your own administrative role.");
      return;
    }
    const newRole = userItem.role === "admin" ? "user" : "admin";
    setActionError(null);
    setSuccessMessage(null);
    setActiveMenuId(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
        if (res.ok) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userItem.id ? { ...u, role: newRole } : u))
          );
          setSuccessMessage(
            `User ${userItem.email} role updated to ${newRole.toUpperCase()}.`
          );
        } else {
          const err = await res.json();
          setActionError(err.error || "Failed to update role");
        }
      } catch {
        setActionError("Network error while updating role");
      }
    });
  };

  const handleDeleteUser = async (userItem: AdminUserItem) => {
    if (userItem.id === currentAdmin?.id) {
      setActionError("You cannot delete your own administrative account.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete user ${userItem.email}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);
    setActiveMenuId(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userItem.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== userItem.id));
          setSuccessMessage(`User ${userItem.email} has been permanently deleted.`);
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
    <div className="space-y-6 select-none font-mono">
      {/* ── 1. PAGE HERO BANNER (MATCHES USER SPEC EXACTLY) ── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks (in Orange #F05A28) */}
        <span
          className="absolute top-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute top-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          {/* Left Text Column */}
          <div className="max-w-xl">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: "#F05A28" }}
              >
                AURALIS // USER ADMINISTRATION
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111] uppercase leading-tight select-text"
              style={{ fontWeight: 900 }}
            >
              USERS // DIRECTORY
            </h1>

            {/* Sub-text (Two Lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Manage user accounts, roles, and permissions across the platform.
              <br className="hidden sm:inline" />
              {" "}Keep your community safe and connected.
            </p>
          </div>

          {/* Right Side: Soundwave Bars & Editorial Tagline */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Inline Keyframes to guarantee instant rendering */}
            <style>{`
              @keyframes auralisWaveDance {
                0%, 100% {
                  transform: scaleY(0.18);
                  opacity: 0.6;
                }
                50% {
                  transform: scaleY(1.08);
                  opacity: 1;
                }
              }
            `}</style>

            {/* Wide Soundwave bars with smooth up-and-down wave animation */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 h-20 px-2 select-none"
              title="Auralis Live Audio Equalizer Spectrum"
            >
              {WIDE_SOUNDWAVE_BARS.map((height, idx) => (
                <span
                  key={idx}
                  className="bg-[#F05A28]"
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: `${height}px`,
                    borderRadius: "1.5px",
                    transformOrigin: "center",
                    animation: "auralisWaveDance 1.35s ease-in-out infinite",
                    animationDelay: `${(idx * 0.055).toFixed(3)}s`,
                    willChange: "transform",
                  }}
                />
              ))}
            </div>

            {/* Tagline on the Right */}
            <div
              className="text-left text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono pl-4 sm:pl-5 shrink-0"
              style={{ borderLeft: "1.5px solid rgba(17, 17, 17, 0.2)" }}
            >
              <p>REAL PEOPLE.</p>
              <p className="my-0.5">REAL MUSIC.</p>
              <p style={{ color: "#F05A28" }}>AURALIS.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionError && (
        <div
          className="p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: "#FFF0ED",
            border: "2px solid #D62828",
            color: "#D62828",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {successMessage && (
        <div
          className="p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: "#ECFDF5",
            border: "2px solid #15803D",
            color: "#15803D",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ── 2. SEARCH & FILTERS BAR (EXACT SPEC) ─────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5 justify-between">
        {/* Search input with bold offset box */}
        <div
          className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2.5 text-xs"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "2.5px 2.5px 0px #111111",
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
          <input
            type="text"
            placeholder="SEARCH BY NAME OR EMAIL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#111111] placeholder-[#7A7166] focus:outline-none font-mono text-xs uppercase tracking-wide"
            style={{ caretColor: "#F05A28" }}
          />
        </div>

        {/* Filter Section on Right */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
            <Filter className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
            <span className="tracking-wider">FILTER:</span>
          </div>

          {/* Role Dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <option value="all">ALL ROLES</option>
            <option value="user">USER / LISTENER</option>
            <option value="admin">ADMIN</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <option value="all">ALL STATUSES</option>
            <option value="active">ACTIVE</option>
            <option value="pending">PENDING</option>
            <option value="suspended">SUSPENDED</option>
            <option value="rejected">REJECTED</option>
          </select>
        </div>
      </div>

      {/* ── 3. REGISTERED IDENTITIES TABLE CONTAINER ────────── */}
      <div
        className="overflow-visible"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Table Header Bar */}
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ borderBottom: "2px solid #111111" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              REGISTERED IDENTITIES
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
            [ {filteredUsers.length} RECORDS FOUND ]
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F05A28" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A7166]">
              LOADING DIRECTORY...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider">
            NO USERS MATCH THE CURRENT CRITERIA.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className="text-[#7A7166] uppercase font-bold text-[10px] tracking-wider"
                style={{
                  backgroundColor: "#F6EEDE",
                  borderBottom: "1.5px solid #111111",
                }}
              >
                <tr>
                  <th className="py-3 px-5">USER</th>
                  <th className="py-3 px-4">ROLE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">LIKED TRACKS</th>
                  <th className="py-3 px-4">REGISTERED</th>
                  <th className="py-3 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {filteredUsers.map((u) => {
                  const isCurrent = u.id === currentAdmin?.id;
                  const isMenuOpen = activeMenuId === u.id;

                  // Format MM/DD/YYYY exactly as in image
                  const dateObj = new Date(u.createdAt);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? `${String(dateObj.getMonth() + 1).padStart(2, "0")}/${String(
                        dateObj.getDate()
                      ).padStart(2, "0")}/${dateObj.getFullYear()}`
                    : "10/25/2026";

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#F6EEDE] transition-colors"
                    >
                      {/* USER Column: Orange Square Avatar with Soft Drop Shadow + Name + YOU Badge + Email */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          {/* Glowing Orange Square Monospace Avatar */}
                          <div
                            className="w-9 h-9 flex items-center justify-center text-sm font-bold shrink-0 uppercase text-white"
                            style={{
                              backgroundColor: "#F05A28",
                              boxShadow: "0 4px 12px rgba(240, 90, 40, 0.45)",
                            }}
                          >
                            {u.name ? u.name.slice(0, 1).toUpperCase() : "U"}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-[#111111] flex items-center gap-2 uppercase truncate text-xs tracking-wide">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase text-white"
                                  style={{ backgroundColor: "#F05A28" }}
                                >
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ROLE Column: Retro Box with Shield Icon */}
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: u.role === "admin" ? "#FFF0ED" : "#FAF7EE",
                            color: u.role === "admin" ? "#F05A28" : "#7A7166",
                            border:
                              u.role === "admin" ? "1px solid #F05A28" : "1px solid #111111",
                          }}
                        >
                          <Shield className="w-3 h-3 text-[#F05A28]" />
                          <span>{u.role.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* STATUS Column: Green Dot + ACTIVE Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor:
                              u.status === "active"
                                ? "#ECFDF5"
                                : u.status === "pending"
                                ? "#FEF3C7"
                                : "#FFF0ED",
                            color:
                              u.status === "active"
                                ? "#15803D"
                                : u.status === "pending"
                                ? "#B45309"
                                : "#DC2626",
                            border:
                              u.status === "active"
                                ? "1px solid #16A34A"
                                : u.status === "pending"
                                ? "1px solid #B45309"
                                : "1px solid #DC2626",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                u.status === "active"
                                  ? "#16A34A"
                                  : u.status === "pending"
                                  ? "#B45309"
                                  : "#DC2626",
                            }}
                          />
                          <span>{u.status.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* LIKED TRACKS Column */}
                      <td className="py-3.5 px-4 font-bold text-[#111111]">
                        {u.likedCount || 0}
                      </td>

                      {/* REGISTERED Date Column */}
                      <td className="py-3.5 px-4 text-[#111111] font-mono">
                        {formattedDate}
                      </td>

                      {/* ACTIONS Column: Single Retro Boxed Button with 3 Vertical Dots */}
                      <td className="py-3.5 px-5 text-right relative">
                        <div className="relative inline-block text-left" ref={menuRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(isMenuOpen ? null : u.id)
                            }
                            className="p-1.5 transition-all cursor-pointer flex items-center justify-center"
                            style={{
                              backgroundColor: "#FAF7EE",
                              border: "1.5px solid #111111",
                              boxShadow: "1.5px 1.5px 0px #111111",
                            }}
                            title="Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5 text-[#111111]" />
                          </button>

                          {/* Popover Action Menu */}
                          {isMenuOpen && (
                            <div
                              className="absolute right-0 mt-1.5 w-44 z-50 p-1 flex flex-col gap-0.5 text-left font-mono text-[11px]"
                              style={{
                                backgroundColor: "#FAF7EE",
                                border: "2px solid #111111",
                                boxShadow: "3px 3px 0px #111111",
                              }}
                            >
                              {/* Toggle Role */}
                              {!isCurrent && (
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleToggleRole(u)}
                                  className="w-full text-left px-2.5 py-1.5 font-bold uppercase transition-colors hover:bg-[#F6EEDE] flex items-center gap-2 cursor-pointer"
                                >
                                  <Shield className="w-3.5 h-3.5 text-[#F05A28]" />
                                  <span>
                                    {u.role === "admin"
                                      ? "REVOKE ADMIN"
                                      : "MAKE ADMIN"}
                                  </span>
                                </button>
                              )}

                              {/* Toggle Status */}
                              {!isCurrent && u.status === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleSetStatus(u, "active")}
                                    className="w-full text-left px-2.5 py-1.5 font-bold uppercase text-[#15803D] hover:bg-[#ECFDF5] flex items-center gap-2 cursor-pointer"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>APPROVE USER</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleSetStatus(u, "rejected")}
                                    className="w-full text-left px-2.5 py-1.5 font-bold uppercase text-[#D62828] hover:bg-[#FFF0ED] flex items-center gap-2 cursor-pointer"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>REJECT USER</span>
                                  </button>
                                </>
                              )}

                              {!isCurrent && u.status === "active" && (
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleSetStatus(u, "suspended")}
                                  className="w-full text-left px-2.5 py-1.5 font-bold uppercase text-[#B45309] hover:bg-[#FEF3C7] flex items-center gap-2 cursor-pointer"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>SUSPEND USER</span>
                                </button>
                              )}

                              {!isCurrent && u.status === "suspended" && (
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleSetStatus(u, "active")}
                                  className="w-full text-left px-2.5 py-1.5 font-bold uppercase text-[#15803D] hover:bg-[#ECFDF5] flex items-center gap-2 cursor-pointer"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>UNSUSPEND USER</span>
                                </button>
                              )}

                              {/* Delete */}
                              {!isCurrent && (
                                <div className="border-t border-[#111111]/15 pt-0.5 mt-0.5">
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleDeleteUser(u)}
                                    className="w-full text-left px-2.5 py-1.5 font-bold uppercase text-[#D62828] hover:bg-[#FFF0ED] flex items-center gap-2 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>DELETE USER</span>
                                  </button>
                                </div>
                              )}

                              {isCurrent && (
                                <div className="px-2.5 py-1.5 text-[10px] text-[#7A7166] uppercase font-bold">
                                  CURRENT USER (NO ACTIONS)
                                </div>
                              )}
                            </div>
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
