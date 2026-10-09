import React from 'react';
import { Search, Calendar, Tag, ShieldCheck, Ticket, Users } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDate: string;
  onSelectDate: (d: string) => void;
  priceFilter: string;
  onSelectPrice: (p: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedDate,
  onSelectDate,
  priceFilter,
  onSelectPrice,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
      {/* Subtle background ambient grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Typography */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Festora Premier Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Discover Extraordinary Events.
            <span className="block text-indigo-600 mt-1">Connect. Celebrate.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The modern stage for technology summits, artisan workshops, acoustic nights, and venture forums. Guaranteed seat safety backed by Jakarta Servlets and MySQL.
          </p>
        </div>

        {/* Search & Filter Console */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-3 sm:p-4 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search event, topic, or venue..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category Select */}
            <div className="sm:col-span-3">
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => onSelectCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Select */}
            <div className="sm:col-span-2">
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={selectedDate}
                  onChange={(e) => onSelectDate(e.target.value)}
                  className="w-full pl-10 pr-6 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Any Date</option>
                  <option value="today">Today</option>
                  <option value="weekend">This Weekend</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Price Filter */}
            <div className="sm:col-span-2">
              <select
                value={priceFilter}
                onChange={(e) => onSelectPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer text-center font-medium"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Tab Selectors */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Zero Overbooking</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Thread-safe ReentrantLock concurrency guards prevent double reservations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 text-purple-600">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instant QR Pass</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Immediate ticket generation with verifiable cryptographic reference codes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Verified Organizers</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Hand-curated summits, dining retreats, masterclasses, and music gatherings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
