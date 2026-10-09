package com.festora.exception;

/**
 * Base custom unchecked exception for Festora application errors.
 */
public class FestoraException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final int statusCode;

    public FestoraException(String message) {
        super(message);
        this.statusCode = 500;
    }

    public FestoraException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public FestoraException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
