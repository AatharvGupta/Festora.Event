package com.festora.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Domain model representing a verified ticket registration.
 */
public class Registration extends BaseEntity<Long> {

    private static final long serialVersionUID = 1L;

    private String registrationCode;
    private Long userId;
    private Long eventId;
    private int ticketsCount;
    private BigDecimal totalAmount;
    private RegistrationStatus status;
    private LocalDateTime bookedAt;
    private String qrToken;

    // Transient attributes for joined data
    private String userName;
    private String userEmail;
    private String eventTitle;
    private String eventVenue;
    private String eventDate;
    private String eventTime;

    public Registration() {
        super();
        this.status = RegistrationStatus.CONFIRMED;
        this.bookedAt = LocalDateTime.now();
        this.ticketsCount = 1;
        this.totalAmount = BigDecimal.ZERO;
    }

    public Registration(Long id, String registrationCode, Long userId, Long eventId,
                        int ticketsCount, BigDecimal totalAmount, RegistrationStatus status,
                        LocalDateTime bookedAt, String qrToken) {
        super(id);
        this.registrationCode = registrationCode;
        this.userId = userId;
        this.eventId = eventId;
        this.ticketsCount = ticketsCount;
        this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        this.status = status != null ? status : RegistrationStatus.CONFIRMED;
        this.bookedAt = bookedAt != null ? bookedAt : LocalDateTime.now();
        this.qrToken = qrToken;
    }

    public String getRegistrationCode() {
        return registrationCode;
    }

    public void setRegistrationCode(String registrationCode) {
        this.registrationCode = registrationCode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public int getTicketsCount() {
        return ticketsCount;
    }

    public void setTicketsCount(int ticketsCount) {
        this.ticketsCount = ticketsCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventVenue() {
        return eventVenue;
    }

    public void setEventVenue(String eventVenue) {
        this.eventVenue = eventVenue;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public boolean isConfirmed() {
        return this.status == RegistrationStatus.CONFIRMED;
    }
}
