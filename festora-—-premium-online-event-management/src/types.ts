export type UserRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export type EventStatus = 'ACTIVE' | 'SOLD_OUT' | 'CANCELLED' | 'COMPLETED';

export interface EventItem {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  totalSeats: number;
  availableSeats: number;
  price: number;
  imageUrl: string;
  organizerId: number;
  organizerName: string;
  status: EventStatus;
  highlights?: string[];
}

export type RegistrationStatus = 'CONFIRMED' | 'CANCELLED';

export interface Registration {
  id: number;
  registrationCode: string;
  userId: number;
  userName: string;
  userEmail: string;
  eventId: number;
  eventTitle: string;
  eventVenue: string;
  eventDate: string;
  eventTime: string;
  ticketsCount: number;
  totalAmount: number;
  status: RegistrationStatus;
  bookedAt: string;
  qrToken: string;
}

export interface ConcurrencySimulationResult {
  totalThreads: number;
  initialSeats: number;
  successfulBookings: number;
  rejectedBookings: number;
  remainingSeats: number;
  logs: Array<{
    threadId: number;
    timestamp: string;
    action: string;
    status: 'SUCCESS' | 'REJECTED' | 'WAITING';
    message: string;
  }>;
}
