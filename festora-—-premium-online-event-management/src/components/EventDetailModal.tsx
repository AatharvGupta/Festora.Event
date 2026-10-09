import React, { useState } from 'react';
import { EventItem, User } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Ticket
} from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem | null;
  onClose: () => void;
  currentUser: User | null;
  onOpenBooking: (event: EventItem, count: number) => void;
  onRequireLogin: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  currentUser,
  onOpenBooking,
  onRequireLogin,
}) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!event) return null;

  const isSoldOut = event.availableSeats <= 0 || event.status === 'SOLD_OUT';
  const totalPrice = event.price * ticketCount;
  const capacityPct = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  const formattedDate = new Date(event.eventDate + 'T' + event.eventTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRegisterClick = () => {
    if (!currentUser) {
      onRequireLogin();
      return;
    }
    onOpenBooking(event, ticketCount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-indigo-600">{event.category}</span>
            <span aria-hidden="true">·</span>
            <span>Ref: FEST-{event.id.toString().padStart(4, '0')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Share event link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Hero Image */}
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-slate-100">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              Organized by {event.organizerName}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Event Narrative & Schedule */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {event.title}
                </h1>
                
                {/* Date & Location Grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 pl-6">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.eventTime} Local Time</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>Venue Address</span>
                    </div>
                    <p className="text-slate-500 pl-6 text-[11px] leading-relaxed">
                      {event.venue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About This Event
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Event Highlights & Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {event.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Venue Map Simulation Preview */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Location & Map
                </h3>
                <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-center relative overflow-hidden h-36 flex flex-col items-center justify-center">
                  <MapPin className="w-8 h-8 text-indigo-500 mb-1 animate-bounce" />
                  <span className="text-xs font-semibold text-slate-700">{event.venue}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Verified Event Center Coordinates</span>
                </div>
              </div>
            </div>

            {/* Right Column: Ticket Booking Console */}
            <div className="lg:col-span-5">
              <div className="sticky top-4 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
                
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ticket Pricing
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                    </span>
                    {event.price > 0 && <span className="text-xs text-slate-500">/ attendee</span>}
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Capacity Meter</span>
                    <span className={event.availableSeats <= 10 ? 'text-rose-600 font-bold' : 'text-slate-900 font-semibold'}>
                      {event.availableSeats} seats left
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isSoldOut ? 'bg-rose-600' : capacityPct > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, capacityPct)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 text-right">
                    {capacityPct}% reserved of {event.totalSeats} capacity
                  </div>
                </div>

                {/* Ticket Quantity Stepper */}
                {!isSoldOut && (
                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Select Number of Tickets
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-sm font-bold text-slate-900">
                          {ticketCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.min(Math.min(5, event.availableSeats), ticketCount + 1))}
                          className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs text-slate-500">
                        Max 5 tickets per reservation
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtotal Calculation */}
                {!isSoldOut && event.price > 0 && (
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>Total ({ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}):</span>
                    <span className="text-lg font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleRegisterClick}
                    disabled={isSoldOut}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      isSoldOut
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-md'
                    }`}
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{isSoldOut ? 'Event Sold Out' : 'Confirm Registration'}</span>
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Guaranteed reservation with instant QR badge</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
