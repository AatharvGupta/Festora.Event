package com.festora.model;

/**
 * Role-Based Access Control (RBAC) user roles.
 */
public enum UserRole {
    ATTENDEE("Attendee"),
    ORGANIZER("Event Organizer"),
    ADMIN("System Administrator");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static UserRole fromString(String roleStr) {
        if (roleStr == null) return ATTENDEE;
        try {
            return UserRole.valueOf(roleStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ATTENDEE;
        }
    }
}
