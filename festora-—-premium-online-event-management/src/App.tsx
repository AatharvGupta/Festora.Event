import React, { useState, useMemo } from 'react';
import { User, EventItem, Registration, UserRole } from './types';
import { INITIAL_USERS, INITIAL_EVENTS, INITIAL_REGISTRATIONS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { TicketPassModal } from './components/TicketPassModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AboutView, ContactView } from './components/AboutContact';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles, Filter } from 'lucide-react';

export default function App() {
  // Application Data States
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[1]); // Default to Sarah Chen (Attendee)
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);

  // Navigation & View State
  const [currentView, setCurrentView] = useState<'events' | 'tickets' | 'admin' | 'about' | 'contact'>('events');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'price_asc' | 'price_desc'>('date');

  // Modals State
  const [detailEvent, setDetailEvent] = useState<EventItem | null>(null);
  const [passRegistration, setPassRegistration] = useState<Registration | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth Handlers
  const handleLogin = (email: string, pass: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.fullName}!`);
      return true;
    }
    return false;
  };

  const handleRegister = (fullName: string, email: string, pass: string, phone: string, role: UserRole): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return false;
    }
    const newUser: User = {
      id: Date.now(),
      fullName,
      email,
      role,
      phone,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created successfully! Logged in as ${fullName}.`);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (currentView === 'tickets' || currentView === 'admin') {
      setCurrentView('events');
    }
    showToast('You have been signed out.');
  };

  const handleSwitchUser = (userId: number) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active user to ${target.fullName} (${target.role})`);
    }
  };

  // Ticket Booking Handler (Thread-safe concurrency logic representation)
  const handleBookTickets = (event: EventItem, count: number) => {
    if (!currentUser) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    if (event.availableSeats < count) {
      showToast(`Overbooking Rejected: Only ${event.availableSeats} seats remaining.`, 'error');
      return;
    }

    // Atomically decrement seats
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === event.id) {
          const newAvail = e.availableSeats - count;
          return {
            ...e,
            availableSeats: newAvail,
            status: newAvail <= 0 ? 'SOLD_OUT' : 'ACTIVE',
          };
        }
        return e;
      })
    );

    // Create unique registration code and QR token
    const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const registrationCode = `FST-2026-${event.id}8${codeSuffix}`;
    const newReg: Registration = {
      id: Date.now(),
      registrationCode,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      eventId: event.id,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      ticketsCount: count,
      totalAmount: event.price * count,
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
      qrToken: `qr-${registrationCode.toLowerCase()}`,
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setDetailEvent(null);
    setPassRegistration(newReg); // Show official pass immediately!
    showToast(`Registration confirmed! Ref: ${registrationCode}`);
  };

  // Ticket Cancellation Handler
  const handleCancelRegistration = (regId: number) => {
    const reg = registrations.find((r) => r.id === regId);
    if (!reg) return;

    // Mark registration as cancelled
    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, status: 'CANCELLED' } : r))
    );

    // Replenish seats on the target event
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === reg.eventId) {
          const newAvail = Math.min(e.totalSeats, e.availableSeats + reg.ticketsCount);
          return {
            ...e,
            availableSeats: newAvail,
            status: 'ACTIVE',
          };
        }
        return e;
      })
    );

    showToast(`Registration ${reg.registrationCode} cancelled. ${reg.ticketsCount} seat(s) released.`);
  };

  // Admin Event Handlers
  const handleAddEvent = (eventData: Omit<EventItem, 'id' | 'availableSeats'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: Date.now(),
      availableSeats: eventData.totalSeats,
      status: 'ACTIVE',
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`Event "${newEvent.title}" published successfully!`);
  };

  const handleEditEvent = (updated: EventItem) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    showToast(`Event "${updated.title}" updated.`);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast('Event removed successfully.');
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Search text match
      const queryMatch =
        searchQuery.trim() === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      const categoryMatch = selectedCategory === 'All' || e.category === selectedCategory;

      // Price filter
      let priceMatch = true;
      if (priceFilter === 'free') priceMatch = e.price === 0;
      if (priceFilter === 'paid') priceMatch = e.price > 0;

      return queryMatch && categoryMatch && priceMatch;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        const bookedA = a.totalSeats - a.availableSeats;
        const bookedB = b.totalSeats - b.availableSeats;
        return bookedB - bookedA;
      }
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });
  }, [events, searchQuery, selectedCategory, priceFilter, sortBy]);

  // Featured Events (top 3)
  const featuredEvents = useMemo(() => {
    return events.filter((e) => e.status === 'ACTIVE').slice(0, 3);
  }, [events]);

  const userTicketsCount = useMemo(() => {
    if (!currentUser) return 0;
    return registrations.filter((r) => r.userId === currentUser.id && r.status === 'CONFIRMED').length;
  }, [registrations, currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-rose-600 text-white border-rose-700'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={users}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        userTicketsCount={userTicketsCount}
      />

      {/* VIEW: MAIN EVENTS CATALOG & HOME */}
      {currentView === 'events' && (
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            priceFilter={priceFilter}
            onSelectPrice={setPriceFilter}
          />

          {/* Featured Showcase Section */}
          {featuredEvents.length > 0 && selectedCategory === 'All' && !searchQuery && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Curated Selection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Featured Events This Month
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onSelect={(event) => setDetailEvent(event)}
                    onQuickBook={(event) => {
                      if (!currentUser) {
                        setAuthMode('login');
                        setIsAuthOpen(true);
                      } else {
                        handleBookTickets(event, 1);
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Main Events Catalog */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Header & Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedCategory === 'All' ? 'Explore All Experiences' : `${selectedCategory} Events`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Showing {filteredEvents.length} verified {filteredEvents.length === 1 ? 'event' : 'events'} with real-time seat inventory.
                </p>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-xs"
                >
                  <option value="date">Upcoming Date</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Events Grid */}
            <div className="mt-8">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                  <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">No Events Match Your Filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try broadening your search keyword or switching back to "All Categories".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setPriceFilter('all');
                    }}
                    className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEvents.map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      onSelect={(event) => setDetailEvent(event)}
                      onQuickBook={(event) => {
                        if (!currentUser) {
                          setAuthMode('login');
                          setIsAuthOpen(true);
                        } else {
                          handleBookTickets(event, 1);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

          </section>
        </main>
      )}

      {/* VIEW: USER DASHBOARD / MY TICKETS */}
      {currentView === 'tickets' && currentUser && (
        <main className="flex-1">
          <UserDashboard
            currentUser={currentUser}
            registrations={registrations}
            onViewPass={(reg) => setPassRegistration(reg)}
            onCancelRegistration={handleCancelRegistration}
            onBackToEvents={() => setCurrentView('events')}
          />
        </main>
      )}

      {/* VIEW: ADMIN DASHBOARD */}
      {currentView === 'admin' && currentUser?.role === 'ADMIN' && (
        <main className="flex-1">
          <AdminDashboard
            currentUser={currentUser}
            events={events}
            registrations={registrations}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onBackToEvents={() => setCurrentView('events')}
          />
        </main>
      )}

      {/* VIEW: ABOUT FESTORA */}
      {currentView === 'about' && (
        <main className="flex-1">
          <AboutView onExploreEvents={() => setCurrentView('events')} />
        </main>
      )}

      {/* VIEW: CONTACT US */}
      {currentView === 'contact' && (
        <main className="flex-1">
          <ContactView />
        </main>
      )}

      {/* MODAL: EVENT DETAILS & TICKET REGISTRATION */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          currentUser={currentUser}
          onOpenBooking={(event, count) => handleBookTickets(event, count)}
          onRequireLogin={() => {
            setAuthMode('login');
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* MODAL: OFFICIAL TICKET PASS & QR CODE */}
      {passRegistration && (
        <TicketPassModal
          registration={passRegistration}
          onClose={() => setPassRegistration(null)}
        />
      )}

      {/* MODAL: AUTH (LOGIN & SIGN UP) */}
      {isAuthOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onQuickDemoLogin={(email) => {
            handleLogin(email, 'Festora2026!');
          }}
        />
      )}

      {/* Platform Footer */}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
      />

    </div>
  );
}
