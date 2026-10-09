package com.festora.service;

import com.festora.dao.UserDAO;
import com.festora.dao.UserDAOImpl;
import com.festora.exception.AuthenticationException;
import com.festora.exception.ValidationException;
import com.festora.model.User;
import com.festora.model.UserRole;
import com.festora.util.PasswordHasher;
import com.festora.util.ValidationUtil;

import java.util.Optional;

/**
 * Service orchestrating user credentials, validation, hashing, and authorization.
 */
public class UserService {

    private final UserDAO userDAO;

    public UserService() {
        this.userDAO = new UserDAOImpl();
    }

    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    /**
     * Registers a new user with password encryption and email uniqueness check.
     */
    public User registerUser(String fullName, String email, String password, String phone, UserRole role) {
        if (!ValidationUtil.isValidString(fullName, 2, 100)) {
            throw new ValidationException("Full name must be between 2 and 100 characters.");
        }
        if (!ValidationUtil.isValidEmail(email)) {
            throw new ValidationException("Invalid email format.");
        }
        if (!ValidationUtil.isValidPassword(password)) {
            throw new ValidationException("Password must be at least 6 characters.");
        }

        if (userDAO.emailExists(email)) {
            throw new ValidationException("An account with this email address already exists.");
        }

        String hashedPassword = PasswordHasher.hashPassword(password);
        User user = new User();
        user.setFullName(fullName.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPasswordHash(hashedPassword);
        user.setRole(role != null ? role : UserRole.ATTENDEE);
        user.setPhone(phone != null ? phone.trim() : null);

        Long newId = userDAO.save(user);
        user.setId(newId);
        return user;
    }

    /**
     * Authenticates user against stored BCrypt hash.
     */
    public User authenticate(String email, String password) {
        if (email == null || password == null) {
            throw new AuthenticationException("Email and password are required.");
        }

        Optional<User> optionalUser = userDAO.findByEmail(email.trim().toLowerCase());
        if (optionalUser.isEmpty()) {
            throw new AuthenticationException("Invalid email or password.");
        }

        User user = optionalUser.get();
        if (!PasswordHasher.checkPassword(password, user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password.");
        }

        return user;
    }

    public Optional<User> findById(Long id) {
        return userDAO.findById(id);
    }
}
