package com.festora.dao;

import com.festora.model.User;
import java.util.Optional;

/**
 * Data Access Object contract for User operations.
 */
public interface UserDAO extends GenericDAO<User, Long> {

    /**
     * Finds a user by their registered email address.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if an email is already registered in the system.
     */
    boolean emailExists(String email);
}
