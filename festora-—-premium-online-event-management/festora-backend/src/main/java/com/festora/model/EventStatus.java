package com.festora.model;

/**
 * Event lifecycle status.
 */
public enum EventStatus {
    ACTIVE,
    SOLD_OUT,
    CANCELLED,
    COMPLETED;

    public static EventStatus fromString(String statusStr) {
        if (statusStr == null) return ACTIVE;
        try {
            return EventStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ACTIVE;
        }
    }
}
