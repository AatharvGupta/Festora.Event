package com.festora.util;

import java.util.regex.Pattern;

/**
 * Validates web form inputs, data types, and business boundary constraints.
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$");

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidPassword(String password) {
        // Minimum 6 characters
        return password != null && password.trim().length() >= 6;
    }

    public static boolean isValidString(String str, int minLen, int maxLen) {
        if (str == null) return false;
        String trimmed = str.trim();
        return trimmed.length() >= minLen && trimmed.length() <= maxLen;
    }

    public static boolean isValidSeats(int seats) {
        return seats > 0 && seats <= 100000;
    }

    public static boolean isValidTicketQuantity(int quantity) {
        return quantity >= 1 && quantity <= 10; // Max 10 tickets per booking
    }
}
