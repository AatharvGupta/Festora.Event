package com.festora.dao;

import com.festora.model.Event;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object contract for Event operations.
 */
public interface EventDAO extends GenericDAO<Event, Long> {

    /**
     * Dynamically searches and filters events based on user criteria.
     */
    List<Event> searchAndFilter(String query, String category, String dateRange, Double maxPrice, String sortBy);

    /**
     * Retrieves featured/top upcoming events for the homepage hero carousel.
     */
    List<Event> findUpcoming(int limit);

    /**
     * Atomically decrements available seats for an event to prevent overbooking.
     * Must be executed within a transactional connection.
     * @return true if seats were available and decremented, false if sold out
     */
    boolean decrementAvailableSeats(Long eventId, int ticketCount, Connection conn) throws SQLException;

    /**
     * Replenishes available seats when a booking is cancelled.
     */
    boolean incrementAvailableSeats(Long eventId, int ticketCount, Connection conn) throws SQLException;
}
