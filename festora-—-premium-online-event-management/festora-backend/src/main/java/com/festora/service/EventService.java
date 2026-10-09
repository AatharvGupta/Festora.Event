package com.festora.service;

import com.festora.dao.EventDAO;
import com.festora.dao.EventDAOImpl;
import com.festora.exception.ValidationException;
import com.festora.model.Event;
import com.festora.model.EventStatus;
import com.festora.model.User;
import com.festora.util.ValidationUtil;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service managing event catalogs, filtering, capacity metrics, and admin operations.
 */
public class EventService {

    private final EventDAO eventDAO;

    public EventService() {
        this.eventDAO = new EventDAOImpl();
    }

    public EventService(EventDAO eventDAO) {
        this.eventDAO = eventDAO;
    }

    public List<Event> getAllEvents() {
        return eventDAO.findAll();
    }

    public List<Event> getFeaturedEvents(int limit) {
        return eventDAO.findUpcoming(limit);
    }

    public List<Event> searchEvents(String query, String category, String dateRange, Double maxPrice, String sortBy) {
        return eventDAO.searchAndFilter(query, category, dateRange, maxPrice, sortBy);
    }

    public Optional<Event> getEventById(Long id) {
        return eventDAO.findById(id);
    }

    public Event createEvent(Event event, User organizer) {
        validateEventInput(event);

        if (organizer == null || !organizer.isOrganizer()) {
            throw new ValidationException("User does not have permission to publish events.");
        }

        event.setOrganizerId(organizer.getId());
        event.setAvailableSeats(event.getTotalSeats());
        event.setStatus(EventStatus.ACTIVE);

        Long eventId = eventDAO.save(event);
        event.setId(eventId);
        return event;
    }

    public boolean updateEvent(Event event, User user) {
        validateEventInput(event);

        Optional<Event> existing = eventDAO.findById(event.getId());
        if (existing.isEmpty()) {
            throw new ValidationException("Event does not exist.");
        }

        Event current = existing.get();
        if (!user.isAdmin() && !current.getOrganizerId().equals(user.getId())) {
            throw new ValidationException("Permission denied: You cannot edit this event.");
        }

        return eventDAO.update(event);
    }

    public boolean deleteEvent(Long eventId, User user) {
        Optional<Event> existing = eventDAO.findById(eventId);
        if (existing.isEmpty()) {
            return false;
        }

        Event current = existing.get();
        if (!user.isAdmin() && !current.getOrganizerId().equals(user.getId())) {
            throw new ValidationException("Permission denied: You cannot delete this event.");
        }

        return eventDAO.delete(eventId);
    }

    /**
     * Aggregates event capacity and system analytics.
     */
    public Map<String, Object> getAnalyticsSummary() {
        List<Event> all = eventDAO.findAll();
        int totalEvents = all.size();
        int totalCapacity = 0;
        int totalBooked = 0;
        BigDecimal totalPotentialRevenue = BigDecimal.ZERO;

        for (Event e : all) {
            totalCapacity += e.getTotalSeats();
            int booked = e.getTotalSeats() - e.getAvailableSeats();
            totalBooked += booked;
            totalPotentialRevenue = totalPotentialRevenue.add(e.getPrice().multiply(BigDecimal.valueOf(booked)));
        }

        double utilizationRate = totalCapacity > 0 ? ((double) totalBooked / totalCapacity) * 100.0 : 0.0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalEvents", totalEvents);
        metrics.put("totalCapacity", totalCapacity);
        metrics.put("totalBookedSeats", totalBooked);
        metrics.put("utilizationRate", Math.round(utilizationRate * 10.0) / 10.0);
        metrics.put("totalRevenue", totalPotentialRevenue);
        return metrics;
    }

    private void validateEventInput(Event event) {
        if (!ValidationUtil.isValidString(event.getTitle(), 3, 200)) {
            throw new ValidationException("Event title must be between 3 and 200 characters.");
        }
        if (!ValidationUtil.isValidString(event.getDescription(), 10, 5000)) {
            throw new ValidationException("Event description must be between 10 and 5000 characters.");
        }
        if (!ValidationUtil.isValidString(event.getVenue(), 3, 255)) {
            throw new ValidationException("Venue address is required.");
        }
        if (event.getEventDate() == null) {
            throw new ValidationException("Event date is required.");
        }
        if (event.getTotalSeats() <= 0) {
            throw new ValidationException("Total seat capacity must be at least 1.");
        }
        if (event.getPrice() != null && event.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Ticket price cannot be negative.");
        }
    }
}
