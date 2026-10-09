package com.festora.servlet;

import com.festora.model.User;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Role-Based Access Control (RBAC) Filter guarding protected endpoints and admin routes.
 */
@WebFilter({"/admin/*", "/api/admin/*", "/api/registrations/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // Skip preflight OPTIONS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(req, res);
            return;
        }

        String path = request.getRequestURI();
        HttpSession session = request.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute("currentUser") : null;

        // Protected Admin Paths
        if (path.contains("/admin/")) {
            if (currentUser == null) {
                sendUnauthorized(response, "Session expired or authentication required.");
                return;
            }
            if (!currentUser.isAdmin()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Forbidden: Administrator privileges required.\"}");
                return;
            }
        }

        // Protected Registration Paths (Booking / Viewing My Registrations)
        if (path.contains("/api/registrations/")) {
            if (currentUser == null) {
                sendUnauthorized(response, "Authentication required to manage ticket registrations.");
                return;
            }
        }

        chain.doFilter(req, res);
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"error\": \"%s\"}", message));
    }
}
