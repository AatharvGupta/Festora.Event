package com.festora.exception;

/**
 * Thrown when concurrent or high-demand booking requests exceed available capacity.
 * Core requirement for college rubric on multithreading & synchronization.
 */
public class OverbookingException extends FestoraException {

    private static final long serialVersionUID = 1L;

    private final Long eventId;
    private final int requestedTickets;
    private final int availableSeats;

    public OverbookingException(Long eventId, int requestedTickets, int availableSeats) {
        super(String.format("Event ID %d overbooking rejected: Requested %d seats, but only %d remain.",
                eventId, requestedTickets, availableSeats), 409);
        this.eventId = eventId;
        this.requestedTickets = requestedTickets;
        this.availableSeats = availableSeats;
    }

    public Long getEventId() {
        return eventId;
    }

    public int getRequestedTickets() {
        return requestedTickets;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }
}
