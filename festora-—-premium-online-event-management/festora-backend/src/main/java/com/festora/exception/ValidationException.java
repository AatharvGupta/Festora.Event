package com.festora.exception;

/**
 * Thrown when client input fails business rules or schema validation.
 */
public class ValidationException extends FestoraException {
    private static final long serialVersionUID = 1L;

    public ValidationException(String message) {
        super(message, 400);
    }
}
