import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'events' | 'tickets' | 'admin' | 'about' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xs">
                F
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Festora
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover. Connect. Celebrate. The premier web-based event management system.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-indigo-600 transition-colors">
                  Explore Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-indigo-600 transition-colors">
                  About Festora
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-indigo-600 transition-colors">
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Technology & Cloud</li>
              <li>Music & Symphony</li>
              <li>Business & Venture</li>
              <li>Culinary & Gastronomy</li>
              <li>Wellness & Retreats</li>
            </ul>
          </div>

          {/* Academic & Stack Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technical Architecture
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Engineered with Java 17, Jakarta Servlets 6, JDBC PreparedStatements, HikariCP Connection Pool, MySQL 8, and ReentrantLock concurrency guards.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Thread-Safe & Zero Overbooking Guarantee</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © 2026 Festora Event Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for premier communal experiences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
