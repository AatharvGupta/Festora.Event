package com.festora.exception;

/**
 * Thrown for invalid credentials, expired session, or unauthorized actions.
 */
public class AuthenticationException extends FestoraException {
    private static final long serialVersionUID = 1L;

    public AuthenticationException(String message) {
        super(message, 401);
    }
}
