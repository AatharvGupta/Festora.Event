import React from 'react';
import { EventItem } from '../types';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onQuickBook: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onQuickBook,
}) => {
  const isSoldOut = event.availableSeats <= 0 || event.status === 'SOLD_OUT';
  const isLowCapacity = !isSoldOut && event.availableSeats <= 10;

  // Format date: e.g. "Sat, Nov 15, 2026"
  const formattedDate = new Date(event.eventDate + 'T' + event.eventTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full">
      
      {/* Event Header Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quiet Price Overlay on Bottom Right */}
        <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
          {event.price === 0 ? 'Free Admission' : `$${event.price.toFixed(2)}`}
        </div>

        {/* Sold out watermark if applicable */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1 bg-rose-600/90 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Unboxed Metadata Line with typographic separators (strict zero-pill rule) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2.5">
          <span className="text-indigo-600 font-semibold">{event.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{event.organizerName}</span>
        </div>

        {/* Event Title */}
        <h3 
          onClick={() => onSelect(event)}
          className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors cursor-pointer mb-2"
        >
          {event.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Schedule & Venue Meta */}
        <div className="space-y-1.5 mt-auto pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formattedDate}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.eventTime.substring(0, 5)}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity status text & action button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs">
            {isSoldOut ? (
              <span className="text-rose-600 font-semibold">Capacity Reached</span>
            ) : isLowCapacity ? (
              <span className="text-amber-600 font-semibold">Only {event.availableSeats} seats left</span>
            ) : (
              <span className="text-slate-500">{event.availableSeats} of {event.totalSeats} seats open</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(event)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onQuickBook(event)}
              disabled={isSoldOut}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                isSoldOut
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
              }`}
            >
              <span>{isSoldOut ? 'Closed' : 'Register'}</span>
              {!isSoldOut && <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
