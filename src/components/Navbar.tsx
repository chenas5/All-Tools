import React, { useState } from "react";
import { Search, Bell, Sun, Moon, LogIn, User, Sparkles, ShieldAlert, LogOut, Check } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  globalSearch: string;
  onSearchChange: (val: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  notifications: Array<{ id: string; title: string; desc: string; read: boolean }>;
  onMarkNotificationsRead: () => void;
}

export default function Navbar({
  user,
  onLogout,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  globalSearch,
  onSearchChange,
  onToggleTheme,
  isDarkMode,
  notifications,
  onMarkNotificationsRead
}: NavbarProps) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header id="platform-header" className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            onSearchChange("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 cursor-pointer shrink-0 group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-950/40">
            <div className="w-full h-full rounded-[10px] bg-neutral-900 flex items-center justify-center transition-colors group-hover:bg-neutral-850">
              <span className="font-extrabold text-xs tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                A
              </span>
              <span className="font-extrabold text-xs tracking-tighter text-white -ml-0.5">
                T
              </span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-neutral-900" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight leading-none block">
              All <span className="text-indigo-400">Tools</span>
            </span>
            <span className="text-[9px] text-neutral-400 font-sans tracking-wide">Everything You Need.</span>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Type '/' or search 500+ online tools instantly..."
            value={globalSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Access Utilities Group */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
                onMarkNotificationsRead();
              }}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-neutral-900" />
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-2.5 bg-neutral-950 border-b border-neutral-850 flex justify-between items-center">
                  <span className="text-xs font-bold text-white tracking-wide">Workspace Alerts</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Unread: {unreadCount}</span>
                </div>
                
                <div className="divide-y divide-neutral-850/40 max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3.5 hover:bg-neutral-950/30 transition-colors space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-semibold text-white">{notif.title}</span>
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{notif.desc}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-neutral-600">
                      Locker alert queues completely empty.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Portal */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-7 h-7 rounded-full border border-neutral-700 bg-neutral-900"
                />
                <span className="text-xs font-semibold text-white max-w-[80px] truncate hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {/* User Dropdown Drawer */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-neutral-850">
                  <div className="px-4 py-3 bg-neutral-950/60 space-y-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-neutral-500 font-mono truncate">{user.email}</p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenDashboard();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-850 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      Manage Workspace
                    </button>

                    {user.role === "Super Admin" && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/20 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-indigo-400" />
                        Admin Operations
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-indigo-950/30"
            >
              <LogIn className="w-3.5 h-3.5" />
              Start Free
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
