import React from 'react';
import { Registration } from '../types';
import { X, Calendar, MapPin, Clock, Printer, CheckCircle2, Ticket } from 'lucide-react';

interface TicketPassModalProps {
  registration: Registration | null;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  registration,
  onClose,
}) => {
  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Official Event Pass · Confirmed</span>
          </div>

          <h2 className="text-xl font-black text-white leading-tight">
            {registration.eventTitle}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-xs text-indigo-100 font-mono">
            <span>Pass Code:</span>
            <span className="bg-white/15 px-2 py-0.5 rounded font-bold tracking-wider text-white">
              {registration.registrationCode}
            </span>
          </div>
        </div>

        {/* Ticket Cutout Notch Visuals */}
        <div className="relative h-4 bg-white flex items-center justify-between px-0">
          <div className="w-5 h-5 -ml-2.5 rounded-full bg-slate-900" />
          <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
          <div className="w-5 h-5 -mr-2.5 rounded-full bg-slate-900" />
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 space-y-5 bg-white">
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px] tracking-wider">
                Attendee
              </span>
              <span className="font-bold text-slate-900 text-sm">{registration.userName}</span>
              <span className="text-slate-500 block truncate">{registration.userEmail}</span>
            </div>

            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px] tracking-wider">
                Ticket Count
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {registration.ticketsCount} {registration.ticketsCount === 1 ? 'Seat' : 'Seats'}
              </span>
              <span className="text-indigo-600 font-semibold block">
                {registration.totalAmount === 0 ? 'Free Pass' : `$${registration.totalAmount.toFixed(2)} Paid`}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium">{registration.eventDate}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{registration.eventTime}</span>
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{registration.eventVenue}</span>
            </div>
          </div>

          {/* QR Code Graphic Representation */}
          <div className="pt-2 flex flex-col items-center justify-center">
            <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
              {/* Simulated crisp QR pattern */}
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer corners */}
                <rect x="5" y="5" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" fill="#0f172a" />

                <rect x="69" y="5" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" fill="#0f172a" />

                <rect x="5" y="69" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" fill="#0f172a" />

                {/* Data Matrix Dots */}
                <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
                <rect x="48" y="14" width="8" height="8" fill="#0f172a" />
                <rect x="36" y="24" width="8" height="8" fill="#0f172a" />
                <rect x="48" y="32" width="12" height="6" fill="#0f172a" />
                <rect x="12" y="38" width="6" height="12" fill="#0f172a" />
                <rect x="24" y="44" width="12" height="6" fill="#0f172a" />
                <rect x="66" y="40" width="8" height="8" fill="#0f172a" />
                <rect x="80" y="46" width="10" height="8" fill="#0f172a" />
                <rect x="40" y="50" width="16" height="12" fill="#4f46e5" />
                <rect x="64" y="60" width="8" height="14" fill="#0f172a" />
                <rect x="40" y="72" width="10" height="10" fill="#0f172a" />
                <rect x="56" y="76" width="14" height="8" fill="#0f172a" />
                <rect x="78" y="72" width="12" height="16" fill="#0f172a" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-2 tracking-wide uppercase">
              SCAN AT VENUE GATE FOR ADMISSION
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
