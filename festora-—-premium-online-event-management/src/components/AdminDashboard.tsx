import React, { useState } from 'react';
import { EventItem, Registration, User } from '../types';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Percent, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  X
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

interface AdminDashboardProps {
  currentUser: User;
  events: EventItem[];
  registrations: Registration[];
  onAddEvent: (event: Omit<EventItem, 'id' | 'availableSeats'>) => void;
  onEditEvent: (event: EventItem) => void;
  onDeleteEvent: (eventId: number) => void;
  onBackToEvents: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  events,
  registrations,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onBackToEvents,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'capacity'>('events');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<number | 'ALL'>('ALL');
  
  // Event Modal state (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    venue: '',
    eventDate: '2026-11-20',
    eventTime: '10:00',
    totalSeats: 100,
    price: 50.0,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  });

  // Calculate high-level metrics
  const totalEvents = events.length;
  const activeRegistrations = registrations.filter((r) => r.status === 'CONFIRMED');
  const totalAttendees = activeRegistrations.reduce((acc, r) => acc + r.ticketsCount, 0);
  const totalRevenue = activeRegistrations.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalCapacity = events.reduce((acc, e) => acc + e.totalSeats, 0);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

  // Filtered attendees
  const filteredRegistrations = registrations.filter((r) => {
    const matchEvent = selectedEventFilter === 'ALL' || r.eventId === selectedEventFilter;
    const matchSearch =
      r.userName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.registrationCode.toLowerCase().includes(attendeeSearch.toLowerCase());
    return matchEvent && matchSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technology',
      venue: '',
      eventDate: '2026-12-01',
      eventTime: '10:00',
      totalSeats: 100,
      price: 49.0,
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      category: evt.category,
      venue: evt.venue,
      eventDate: evt.eventDate,
      eventTime: evt.eventTime,
      totalSeats: evt.totalSeats,
      price: evt.price,
      imageUrl: evt.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Preserve existing availableSeats calculation proportionally or keep current
      const diff = formData.totalSeats - editingEvent.totalSeats;
      const newAvailable = Math.max(0, editingEvent.availableSeats + diff);
      onEditEvent({
        ...editingEvent,
        ...formData,
        availableSeats: newAvailable,
        status: newAvailable === 0 ? 'SOLD_OUT' : 'ACTIVE',
      });
    } else {
      onAddEvent({
        ...formData,
        organizerId: currentUser.id,
        organizerName: currentUser.fullName,
        status: 'ACTIVE',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToEvents}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Events</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management for events, attendee rosters, and capacity safeguards.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Aggregate KPI Metric Cards */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{totalEvents}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Catalog across all categories</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Booked Attendees</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{totalAttendees}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across confirmed registrations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity Fill</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{utilizationRate}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{totalCapacity} total seat capacity</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">${totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Net active ticket volume</div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="mt-8 flex items-center gap-1 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'events'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('attendees')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'attendees'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Attendee Roster & Tickets ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab('capacity')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'capacity'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Capacity & Overbooking Guard
        </button>
      </div>

      {/* TAB 1: MANAGE EVENTS */}
      {activeTab === 'events' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Event Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm max-w-xs truncate">{evt.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{evt.venue}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{evt.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{evt.eventDate}</div>
                      <div className="text-[11px] text-slate-400">{evt.eventTime}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {evt.price === 0 ? 'Free' : `$${evt.price.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {evt.availableSeats} / {evt.totalSeats} open
                      </div>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600"
                          style={{ width: `${Math.round(((evt.totalSeats - evt.availableSeats) / evt.totalSeats) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold ${
                        evt.status === 'ACTIVE' ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(evt)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${evt.title}"?`)) {
                              onDeleteEvent(evt.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDEES ROSTER */}
      {activeTab === 'attendees' && (
        <div className="mt-6 space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attendee name, email, or pass code..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-medium"
            >
              <option value="ALL">All Events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Ticket Code</th>
                    <th className="py-3.5 px-4">Attendee Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Tickets</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No registrations match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                          {reg.registrationCode}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {reg.userName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {reg.userEmail}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                          {reg.eventTitle}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {reg.ticketsCount}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {reg.totalAmount === 0 ? 'Free' : `$${reg.totalAmount.toFixed(2)}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-bold ${
                            reg.status === 'CONFIRMED' ? 'text-emerald-700' : 'text-slate-400 line-through'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CAPACITY & OVERBOOKING MONITOR */}
      {activeTab === 'capacity' && (
        <div className="mt-6 space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Thread-Safe Concurrency & Overbooking Guard Active</span>
              <span>
                Festora employs a synchronized ReentrantLock per event ID combined with MySQL row-level atomic decrement queries. When available seats drop to zero, subsequent registration transactions are rejected deterministically with HTTP 409 Conflict.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt) => {
              const booked = evt.totalSeats - evt.availableSeats;
              const pct = Math.round((booked / evt.totalSeats) * 100);
              const isFull = evt.availableSeats === 0;

              return (
                <div key={evt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{evt.title}</h4>
                    <span className={`text-[11px] font-bold shrink-0 ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isFull ? 'SOLD OUT' : 'SEATS OPEN'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Inventory:</span>
                      <span className="font-semibold">{evt.availableSeats} of {evt.totalSeats} seats remaining</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${isFull ? 'bg-rose-600' : pct > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{booked} tickets booked</span>
                      <span>{pct}% utilized</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NextGen Web & Cloud Summit"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ticket Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Venue Address *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Center for the Arts, 701 Mission St, San Francisco, CA"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    required
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full agenda, speaker notes, and attendee guidelines..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
