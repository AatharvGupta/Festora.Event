package com.festora.model;

/**
 * Domain model representing a system user with encapsulated credentials,
 * contact details, and role assignments.
 */
public class User extends BaseEntity<Long> {

    private static final long serialVersionUID = 1L;

    private String fullName;
    private String email;
    private String passwordHash;
    private UserRole role;
    private String phone;

    public User() {
        super();
        this.role = UserRole.ATTENDEE;
    }

    public User(Long id, String fullName, String email, String passwordHash, UserRole role, String phone) {
        super(id);
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role != null ? role : UserRole.ATTENDEE;
        this.phone = phone;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isAdmin() {
        return this.role == UserRole.ADMIN;
    }

    public boolean isOrganizer() {
        return this.role == UserRole.ORGANIZER || this.role == UserRole.ADMIN;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }
}
