package com.festora.model;

/**
 * Registration/Ticket booking state.
 */
public enum RegistrationStatus {
    CONFIRMED,
    CANCELLED,
    CHECKED_IN;

    public static RegistrationStatus fromString(String str) {
        if (str == null) return CONFIRMED;
        try {
            return RegistrationStatus.valueOf(str.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return CONFIRMED;
        }
    }
}
