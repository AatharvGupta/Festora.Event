package com.festora.dao;

import com.festora.exception.OverbookingException;
import com.festora.model.Registration;
import com.festora.model.RegistrationStatus;
import com.festora.util.DBConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Concrete JDBC implementation of RegistrationDAO featuring ACID transactions,
 * atomic seat checks, rollback guards, and foreign entity joins.
 */
public class RegistrationDAOImpl implements RegistrationDAO {

    private static final Logger LOGGER = Logger.getLogger(RegistrationDAOImpl.class.getName());
    private final EventDAO eventDAO = new EventDAOImpl();

    @Override
    public Long save(Registration registration) {
        Registration created = createBookingTransaction(registration);
        return created != null ? created.getId() : null;
    }

    @Override
    public Registration createBookingTransaction(Registration registration) {
        Connection conn = null;
        try {
            conn = DBConnectionUtil.getConnection();
            conn.setAutoCommit(false); // Begin ACID Transaction

            // 1. Atomically decrement seats with conditional check (prevents overbooking)
            boolean seatReserved = eventDAO.decrementAvailableSeats(
                    registration.getEventId(),
                    registration.getTicketsCount(),
                    conn
            );

            if (!seatReserved) {
                conn.rollback();
                throw new OverbookingException(registration.getEventId(), registration.getTicketsCount(), 0);
            }

            // 2. Generate unique ticket code and QR token
            String uniqueCode = "FST-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String qrToken = "qr-" + UUID.randomUUID().toString();
            registration.setRegistrationCode(uniqueCode);
            registration.setQrToken(qrToken);
            registration.setStatus(RegistrationStatus.CONFIRMED);

            // 3. Insert registration record
            String insertSql = "INSERT INTO registrations (registration_code, user_id, event_id, tickets_count, total_amount, status, qr_token) " +
                               "VALUES (?, ?, ?, ?, ?, ?, ?)";

            try (PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, registration.getRegistrationCode());
                ps.setLong(2, registration.getUserId());
                ps.setLong(3, registration.getEventId());
                ps.setInt(4, registration.getTicketsCount());
                ps.setBigDecimal(5, registration.getTotalAmount());
                ps.setString(6, registration.getStatus().name());
                ps.setString(7, registration.getQrToken());

                int rows = ps.executeUpdate();
                if (rows > 0) {
                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (rs.next()) {
                            registration.setId(rs.getLong(1));
                        }
                    }
                }
            }

            // 4. Commit transaction
            conn.commit();
            LOGGER.info("Registration successfully committed: " + registration.getRegistrationCode());
            return registration;

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    LOGGER.log(Level.SEVERE, "Transaction rollback failed", ex);
                }
            }
            LOGGER.log(Level.SEVERE, "Database error during booking transaction", e);
            throw new RuntimeException("Booking transaction failed: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ex) {
                    LOGGER.log(Level.WARNING, "Error closing connection", ex);
                }
            }
        }
    }

    @Override
    public boolean cancelBookingTransaction(Long registrationId, Long userId) {
        Connection conn = null;
        try {
            conn = DBConnectionUtil.getConnection();
            conn.setAutoCommit(false); // Begin ACID Transaction

            // 1. Fetch registration details and verify ownership
            String findSql = "SELECT event_id, tickets_count, status FROM registrations WHERE id = ? AND user_id = ?";
            Long eventId = null;
            int ticketsCount = 0;
            String status = null;

            try (PreparedStatement ps = conn.prepareStatement(findSql)) {
                ps.setLong(1, registrationId);
                ps.setLong(2, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        eventId = rs.getLong("event_id");
                        ticketsCount = rs.getInt("tickets_count");
                        status = rs.getString("status");
                    }
                }
            }

            if (eventId == null || "CANCELLED".equals(status)) {
                conn.rollback();
                return false;
            }

            // 2. Mark registration as CANCELLED
            String updateSql = "UPDATE registrations SET status = 'CANCELLED' WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setLong(1, registrationId);
                ps.executeUpdate();
            }

            // 3. Replenish available seats on the event
            eventDAO.incrementAvailableSeats(eventId, ticketsCount, conn);

            conn.commit();
            LOGGER.info("Registration cancelled and seats replenished for ID: " + registrationId);
            return true;

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    LOGGER.log(Level.SEVERE, "Rollback failed during cancellation", ex);
                }
            }
            LOGGER.log(Level.SEVERE, "Error cancelling registration", e);
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ex) {
                    LOGGER.log(Level.WARNING, "Error resetting connection", ex);
                }
            }
        }
    }

    @Override
    public List<Registration> findByUserId(Long userId) {
        List<Registration> list = new ArrayList<>();
        String sql = "SELECT r.*, e.title AS event_title, e.venue AS event_venue, e.event_date, e.event_time " +
                     "FROM registrations r " +
                     "JOIN events e ON r.event_id = e.id " +
                     "WHERE r.user_id = ? " +
                     "ORDER BY r.booked_at DESC";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Registration reg = mapResultSetToRegistration(rs);
                    reg.setEventTitle(rs.getString("event_title"));
                    reg.setEventVenue(rs.getString("event_venue"));
                    Date d = rs.getDate("event_date");
                    if (d != null) reg.setEventDate(d.toString());
                    Time t = rs.getTime("event_time");
                    if (t != null) reg.setEventTime(t.toString());
                    list.add(reg);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching user registrations: " + userId, e);
        }
        return list;
    }

    @Override
    public List<Registration> findByEventId(Long eventId) {
        List<Registration> list = new ArrayList<>();
        String sql = "SELECT r.*, u.full_name AS user_name, u.email AS user_email, e.title AS event_title " +
                     "FROM registrations r " +
                     "JOIN users u ON r.user_id = u.id " +
                     "JOIN events e ON r.event_id = e.id " +
                     "WHERE r.event_id = ? " +
                     "ORDER BY r.booked_at DESC";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, eventId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Registration reg = mapResultSetToRegistration(rs);
                    reg.setUserName(rs.getString("user_name"));
                    reg.setUserEmail(rs.getString("user_email"));
                    reg.setEventTitle(rs.getString("event_title"));
                    list.add(reg);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching event attendees: " + eventId, e);
        }
        return list;
    }

    @Override
    public Optional<Registration> findByCode(String code) {
        String sql = "SELECT r.*, e.title AS event_title, e.venue AS event_venue, e.event_date, e.event_time, u.full_name AS user_name " +
                     "FROM registrations r " +
                     "JOIN events e ON r.event_id = e.id " +
                     "JOIN users u ON r.user_id = u.id " +
                     "WHERE r.registration_code = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, code);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Registration reg = mapResultSetToRegistration(rs);
                    reg.setEventTitle(rs.getString("event_title"));
                    reg.setEventVenue(rs.getString("event_venue"));
                    reg.setUserName(rs.getString("user_name"));
                    Date d = rs.getDate("event_date");
                    if (d != null) reg.setEventDate(d.toString());
                    Time t = rs.getTime("event_time");
                    if (t != null) reg.setEventTime(t.toString());
                    return Optional.of(reg);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding registration by code: " + code, e);
        }
        return Optional.empty();
    }

    @Override
    public int countTotalConfirmedTickets() {
        String sql = "SELECT COALESCE(SUM(tickets_count), 0) FROM registrations WHERE status = 'CONFIRMED'";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error counting confirmed tickets", e);
        }
        return 0;
    }

    @Override
    public Optional<Registration> findById(Long id) {
        String sql = "SELECT * FROM registrations WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToRegistration(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding registration by ID: " + id, e);
        }
        return Optional.empty();
    }

    @Override
    public List<Registration> findAll() {
        List<Registration> list = new ArrayList<>();
        String sql = "SELECT r.*, u.full_name AS user_name, u.email AS user_email, e.title AS event_title " +
                     "FROM registrations r " +
                     "JOIN users u ON r.user_id = u.id " +
                     "JOIN events e ON r.event_id = e.id " +
                     "ORDER BY r.booked_at DESC";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Registration reg = mapResultSetToRegistration(rs);
                reg.setUserName(rs.getString("user_name"));
                reg.setUserEmail(rs.getString("user_email"));
                reg.setEventTitle(rs.getString("event_title"));
                list.add(reg);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding all registrations", e);
        }
        return list;
    }

    @Override
    public boolean update(Registration entity) {
        String sql = "UPDATE registrations SET status = ? WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, entity.getStatus().name());
            ps.setLong(2, entity.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating registration", e);
            return false;
        }
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM registrations WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting registration ID: " + id, e);
            return false;
        }
    }

    private Registration mapResultSetToRegistration(ResultSet rs) throws SQLException {
        Registration reg = new Registration();
        reg.setId(rs.getLong("id"));
        reg.setRegistrationCode(rs.getString("registration_code"));
        reg.setUserId(rs.getLong("user_id"));
        reg.setEventId(rs.getLong("event_id"));
        reg.setTicketsCount(rs.getInt("tickets_count"));
        reg.setTotalAmount(rs.getBigDecimal("total_amount"));
        reg.setStatus(RegistrationStatus.fromString(rs.getString("status")));
        reg.setQrToken(rs.getString("qr_token"));
        Timestamp ts = rs.getTimestamp("booked_at");
        if (ts != null) {
            reg.setBookedAt(ts.toLocalDateTime());
        }
        return reg;
    }
}
