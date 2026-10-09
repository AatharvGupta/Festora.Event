package com.festora.dao;

import com.festora.model.Registration;

import java.util.List;
import java.util.Optional;

/**
 * Data Access Object contract for Registrations and Ticket Bookings.
 */
public interface RegistrationDAO extends GenericDAO<Registration, Long> {

    /**
     * Executes an ACID-compliant transactional booking.
     * Decrements event seats atomically and creates registration record.
     * Rolls back if seats are unavailable or any error occurs.
     */
    Registration createBookingTransaction(Registration registration);

    /**
     * Cancels a booking, restoring available seats within a transaction.
     */
    boolean cancelBookingTransaction(Long registrationId, Long userId);

    /**
     * Retrieves all registrations for a specific user.
     */
    List<Registration> findByUserId(Long userId);

    /**
     * Retrieves all attendees registered for a specific event.
     */
    List<Registration> findByEventId(Long eventId);

    /**
     * Finds a registration by its unique reference code (e.g., FST-2026-XXXX).
     */
    Optional<Registration> findByCode(String code);

    /**
     * Counts total confirmed tickets sold system-wide.
     */
    int countTotalConfirmedTickets();
}
