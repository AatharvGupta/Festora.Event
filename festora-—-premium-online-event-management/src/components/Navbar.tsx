import React, { useState } from 'react';
import { User } from '../types';
import { 
  Sparkles, 
  Ticket, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (userId: number) => void;
  allUsers: User[];
  currentView: 'events' | 'tickets' | 'admin' | 'about' | 'contact';
  onNavigate: (view: 'events' | 'tickets' | 'admin' | 'about' | 'contact') => void;
  userTicketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  allUsers,
  currentView,
  onNavigate,
  userTicketsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('events')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:bg-indigo-700 transition-colors">
                F
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Festora
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400">
                  Discover. Connect. Celebrate.
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
              <button
                onClick={() => onNavigate('events')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'events'
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'about'
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                About
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'contact'
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">

            {/* Quick Demo Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title="Switch demo persona for testing"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch Role</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Test Account
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser?.id === u.id ? 'bg-indigo-50/60 font-semibold text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div>{u.fullName}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign Out (Guest Mode)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Specific Actions */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('tickets')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    currentView === 'tickets'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>My Tickets</span>
                  {userTicketsCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">
                      {userTicketsCount}
                    </span>
                  )}
                </button>

                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      currentView === 'admin'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-900 leading-none">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {currentUser.role.toLowerCase()}
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { onNavigate('events'); setMobileMenuOpen(false); }}
              className={`p-2 text-center text-xs font-medium rounded-lg ${currentView === 'events' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-700'}`}
            >
              Events
            </button>
            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className={`p-2 text-center text-xs font-medium rounded-lg ${currentView === 'about' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-700'}`}
            >
              About
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className={`p-2 text-center text-xs font-medium rounded-lg ${currentView === 'contact' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-700'}`}
            >
              Contact
            </button>
          </div>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs font-semibold text-slate-900">
                Logged in as {currentUser.fullName} ({currentUser.role})
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onNavigate('tickets'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 text-center"
                >
                  My Tickets ({userTicketsCount})
                </button>
                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 text-center"
                  >
                    Admin Panel
                  </button>
                )}
              </div>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700"
              >
                Log In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
