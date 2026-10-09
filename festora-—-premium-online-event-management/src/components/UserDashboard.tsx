import React, { useState } from 'react';
import { Registration, User } from '../types';
import { Ticket, Calendar, MapPin, Clock, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  registrations: Registration[];
  onViewPass: (reg: Registration) => void;
  onCancelRegistration: (regId: number) => void;
  onBackToEvents: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  registrations,
  onViewPass,
  onCancelRegistration,
  onBackToEvents,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  const userRegs = registrations.filter((r) => r.userId === currentUser.id);
  const filteredRegs = userRegs.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const confirmedCount = userRegs.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToEvents}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Events</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Registered Events & Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your booked passes, access gate QR codes, and manage cancellations.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({userRegs.length})
          </button>
          <button
            onClick={() => setFilterStatus('CONFIRMED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'CONFIRMED'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({confirmedCount})
          </button>
          <button
            onClick={() => setFilterStatus('CANCELLED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'CANCELLED'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({userRegs.length - confirmedCount})
          </button>
        </div>
      </div>

      {/* Registrations List */}
      <div className="mt-8">
        {filteredRegs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Registrations Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't reserved any tickets under this filter. Explore our curated events to find your next experience.
            </p>
            <button
              onClick={onBackToEvents}
              className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRegs.map((reg) => {
              const isConfirmed = reg.status === 'CONFIRMED';

              return (
                <div
                  key={reg.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isConfirmed ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200/60 opacity-75'
                  }`}
                >
                  <div>
                    {/* Header line with unboxed metadata */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-slate-500 text-[11px]">
                        Ref: {reg.registrationCode}
                      </span>
                      <span className={`text-xs font-bold ${
                        isConfirmed ? 'text-emerald-700' : 'text-slate-500 line-through'
                      }`}>
                        {isConfirmed ? 'CONFIRMED' : 'CANCELLED'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {reg.eventTitle}
                    </h3>

                    {/* Schedule & Venue Meta */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{reg.eventDate}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{reg.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{reg.eventVenue}</span>
                      </div>
                    </div>

                    {/* Ticket details line */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500">Reserved: </span>
                        <span className="font-semibold text-slate-900">
                          {reg.ticketsCount} {reg.ticketsCount === 1 ? 'Seat' : 'Seats'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Total: </span>
                        <span className="font-bold text-indigo-600">
                          {reg.totalAmount === 0 ? 'Free' : `$${reg.totalAmount.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {isConfirmed ? (
                      <>
                        <button
                          onClick={() => onViewPass(reg)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View QR Pass</span>
                        </button>

                        {confirmCancelId === reg.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-rose-600 font-medium">Cancel seat?</span>
                            <button
                              onClick={() => {
                                onCancelRegistration(reg.id);
                                setConfirmCancelId(null);
                              }}
                              className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-md hover:bg-rose-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmCancelId(reg.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-medium"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Booking was cancelled & seat released back to inventory
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
