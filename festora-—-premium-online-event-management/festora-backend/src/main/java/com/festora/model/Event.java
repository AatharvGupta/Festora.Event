package com.festora.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Domain model representing an event with venue coordinates, schedule,
 * capacity boundaries, ticket pricing, and availability states.
 */
public class Event extends BaseEntity<Long> {

    private static final long serialVersionUID = 1L;

    private String title;
    private String description;
    private String category;
    private String venue;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private int totalSeats;
    private int availableSeats;
    private BigDecimal price;
    private String imageUrl;
    private Long organizerId;
    private EventStatus status;

    // Transient helper fields for UI display
    private String organizerName;

    public Event() {
        super();
        this.status = EventStatus.ACTIVE;
        this.price = BigDecimal.ZERO;
    }

    public Event(Long id, String title, String description, String category, String venue,
                 LocalDate eventDate, LocalTime eventTime, int totalSeats, int availableSeats,
                 BigDecimal price, String imageUrl, Long organizerId, EventStatus status) {
        super(id);
        this.title = title;
        this.description = description;
        this.category = category;
        this.venue = venue;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.price = price != null ? price : BigDecimal.ZERO;
        this.imageUrl = imageUrl;
        this.organizerId = organizerId;
        this.status = status != null ? status : EventStatus.ACTIVE;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
        if (this.availableSeats <= 0) {
            this.status = EventStatus.SOLD_OUT;
        } else if (this.status == EventStatus.SOLD_OUT && this.availableSeats > 0) {
            this.status = EventStatus.ACTIVE;
        }
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price != null ? price : BigDecimal.ZERO;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public boolean isFree() {
        return price == null || price.compareTo(BigDecimal.ZERO) == 0;
    }

    public boolean isSoldOut() {
        return availableSeats <= 0 || status == EventStatus.SOLD_OUT;
    }

    public boolean canBook(int requestedTickets) {
        return status == EventStatus.ACTIVE && requestedTickets > 0 && availableSeats >= requestedTickets;
    }

    public int getBookedSeats() {
        return totalSeats - availableSeats;
    }

    public double getCapacityPercentage() {
        if (totalSeats == 0) return 0.0;
        return ((double) getBookedSeats() / totalSeats) * 100.0;
    }
}
