package com.festora.dao;

import com.festora.model.Event;
import com.festora.model.EventStatus;
import com.festora.util.DBConnectionUtil;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Concrete JDBC implementation of EventDAO.
 * Features atomic updates and prepared queries.
 */
public class EventDAOImpl implements EventDAO {

    private static final Logger LOGGER = Logger.getLogger(EventDAOImpl.class.getName());

    @Override
    public Long save(Event event) {
        String sql = "INSERT INTO events (title, description, category, venue, event_date, event_time, total_seats, available_seats, price, image_url, organizer_id, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            setEventParams(ps, event);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        long generatedId = rs.getLong(1);
                        event.setId(generatedId);
                        return generatedId;
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error inserting event: " + event.getTitle(), e);
            throw new RuntimeException("Database error saving event", e);
        }
        return null;
    }

    @Override
    public Optional<Event> findById(Long id) {
        String sql = "SELECT e.*, u.full_name AS organizer_name " +
                     "FROM events e " +
                     "LEFT JOIN users u ON e.organizer_id = u.id " +
                     "WHERE e.id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToEvent(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding event by ID: " + id, e);
        }
        return Optional.empty();
    }

    @Override
    public List<Event> findAll() {
        List<Event> events = new ArrayList<>();
        String sql = "SELECT e.*, u.full_name AS organizer_name " +
                     "FROM events e " +
                     "LEFT JOIN users u ON e.organizer_id = u.id " +
                     "ORDER BY e.event_date ASC";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                events.add(mapResultSetToEvent(rs));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all events", e);
        }
        return events;
    }

    @Override
    public List<Event> findUpcoming(int limit) {
        List<Event> events = new ArrayList<>();
        String sql = "SELECT e.*, u.full_name AS organizer_name " +
                     "FROM events e " +
                     "LEFT JOIN users u ON e.organizer_id = u.id " +
                     "WHERE e.status = 'ACTIVE' AND e.event_date >= CURRENT_DATE " +
                     "ORDER BY e.event_date ASC LIMIT ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    events.add(mapResultSetToEvent(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching upcoming events", e);
        }
        return events;
    }

    @Override
    public List<Event> searchAndFilter(String query, String category, String dateRange, Double maxPrice, String sortBy) {
        List<Event> events = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT e.*, u.full_name AS organizer_name FROM events e " +
                "LEFT JOIN users u ON e.organizer_id = u.id WHERE 1=1 "
        );
        List<Object> params = new ArrayList<>();

        if (query != null && !query.trim().isEmpty()) {
            sql.append(" AND (LOWER(e.title) LIKE ? OR LOWER(e.description) LIKE ? OR LOWER(e.venue) LIKE ?)");
            String pattern = "%" + query.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            sql.append(" AND e.category = ?");
            params.add(category.trim());
        }

        if (dateRange != null && !dateRange.trim().isEmpty()) {
            LocalDate today = LocalDate.now();
            if ("today".equalsIgnoreCase(dateRange)) {
                sql.append(" AND e.event_date = ?");
                params.add(Date.valueOf(today));
            } else if ("weekend".equalsIgnoreCase(dateRange)) {
                sql.append(" AND e.event_date BETWEEN ? AND ?");
                params.add(Date.valueOf(today));
                params.add(Date.valueOf(today.plusDays(7)));
            } else if ("month".equalsIgnoreCase(dateRange)) {
                sql.append(" AND e.event_date BETWEEN ? AND ?");
                params.add(Date.valueOf(today));
                params.add(Date.valueOf(today.plusMonths(1)));
            }
        }

        if (maxPrice != null && maxPrice >= 0) {
            sql.append(" AND e.price <= ?");
            params.add(maxPrice);
        }

        // Sorting
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            sql.append(" ORDER BY e.price ASC");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sql.append(" ORDER BY e.price DESC");
        } else if ("popular".equalsIgnoreCase(sortBy)) {
            sql.append(" ORDER BY (e.total_seats - e.available_seats) DESC");
        } else {
            sql.append(" ORDER BY e.event_date ASC");
        }

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    events.add(mapResultSetToEvent(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error searching/filtering events", e);
        }
        return events;
    }

    @Override
    public boolean update(Event event) {
        String sql = "UPDATE events SET title = ?, description = ?, category = ?, venue = ?, " +
                     "event_date = ?, event_time = ?, total_seats = ?, price = ?, image_url = ?, status = ? " +
                     "WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, event.getTitle());
            ps.setString(2, event.getDescription());
            ps.setString(3, event.getCategory());
            ps.setString(4, event.getVenue());
            ps.setDate(5, Date.valueOf(event.getEventDate()));
            ps.setTime(6, Time.valueOf(event.getEventTime()));
            ps.setInt(7, event.getTotalSeats());
            ps.setBigDecimal(8, event.getPrice());
            ps.setString(9, event.getImageUrl());
            ps.setString(10, event.getStatus().name());
            ps.setLong(11, event.getId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating event ID: " + event.getId(), e);
            return false;
        }
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM events WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting event ID: " + id, e);
            return false;
        }
    }

    @Override
    public boolean decrementAvailableSeats(Long eventId, int ticketCount, Connection conn) throws SQLException {
        // Atomic compare-and-swap style decrement to prevent race condition overbooking
        String sql = "UPDATE events SET available_seats = available_seats - ?, " +
                     "status = CASE WHEN (available_seats - ?) <= 0 THEN 'SOLD_OUT' ELSE status END " +
                     "WHERE id = ? AND available_seats >= ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, ticketCount);
            ps.setInt(2, ticketCount);
            ps.setLong(3, eventId);
            ps.setInt(4, ticketCount);

            int rowsUpdated = ps.executeUpdate();
            return rowsUpdated > 0;
        }
    }

    @Override
    public boolean incrementAvailableSeats(Long eventId, int ticketCount, Connection conn) throws SQLException {
        String sql = "UPDATE events SET available_seats = available_seats + ?, " +
                     "status = 'ACTIVE' " +
                     "WHERE id = ? AND (available_seats + ?) <= total_seats";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, ticketCount);
            ps.setLong(2, eventId);
            ps.setInt(3, ticketCount);

            int rowsUpdated = ps.executeUpdate();
            return rowsUpdated > 0;
        }
    }

    private void setEventParams(PreparedStatement ps, Event event) throws SQLException {
        ps.setString(1, event.getTitle());
        ps.setString(2, event.getDescription());
        ps.setString(3, event.getCategory());
        ps.setString(4, event.getVenue());
        ps.setDate(5, Date.valueOf(event.getEventDate()));
        ps.setTime(6, Time.valueOf(event.getEventTime()));
        ps.setInt(7, event.getTotalSeats());
        ps.setInt(8, event.getAvailableSeats());
        ps.setBigDecimal(9, event.getPrice());
        ps.setString(10, event.getImageUrl());
        ps.setLong(11, event.getOrganizerId());
        ps.setString(12, event.getStatus().name());
    }

    private Event mapResultSetToEvent(ResultSet rs) throws SQLException {
        Event event = new Event();
        event.setId(rs.getLong("id"));
        event.setTitle(rs.getString("title"));
        event.setDescription(rs.getString("description"));
        event.setCategory(rs.getString("category"));
        event.setVenue(rs.getString("venue"));
        Date d = rs.getDate("event_date");
        if (d != null) event.setEventDate(d.toLocalDate());
        Time t = rs.getTime("event_time");
        if (t != null) event.setEventTime(t.toLocalTime());
        event.setTotalSeats(rs.getInt("total_seats"));
        event.setAvailableSeats(rs.getInt("available_seats"));
        event.setPrice(rs.getBigDecimal("price"));
        event.setImageUrl(rs.getString("image_url"));
        event.setOrganizerId(rs.getLong("organizer_id"));
        event.setStatus(EventStatus.fromString(rs.getString("status")));

        try {
            event.setOrganizerName(rs.getString("organizer_name"));
        } catch (SQLException ignored) {}

        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) event.setCreatedAt(ts.toLocalDateTime());
        return event;
    }
}
