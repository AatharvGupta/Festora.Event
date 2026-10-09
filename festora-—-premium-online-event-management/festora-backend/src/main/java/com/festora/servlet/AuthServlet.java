package com.festora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.festora.exception.FestoraException;
import com.festora.model.User;
import com.festora.model.UserRole;
import com.festora.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Jakarta Servlet for Authentication, Registration, and Session lifecycle.
 * Endpoint: /api/auth/*
 */
@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final UserService userService = new UserService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        if (session != null && session.getAttribute("currentUser") != null) {
            User user = (User) session.getAttribute("currentUser");
            // Do not send password hash to client
            user.setPasswordHash(null);
            resp.setStatus(HttpServletResponse.SC_OK);
            objectMapper.writeValue(resp.getWriter(), user);
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"No active session\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        String pathInfo = req.getPathInfo();
        if (pathInfo == null) pathInfo = "";

        try {
            Map<?, ?> payload = objectMapper.readValue(req.getInputStream(), Map.class);

            if (pathInfo.endsWith("/login")) {
                handleLogin(payload, req, resp);
            } else if (pathInfo.endsWith("/register")) {
                handleRegister(payload, req, resp);
            } else if (pathInfo.endsWith("/logout")) {
                handleLogout(req, resp);
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Unknown auth endpoint. Use /login, /register, or /logout\"}");
            }
        } catch (FestoraException e) {
            resp.setStatus(e.getStatusCode());
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        }
    }

    private void handleLogin(Map<?, ?> payload, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");

        User user = userService.authenticate(email, password);
        HttpSession session = req.getSession(true);
        session.setAttribute("currentUser", user);

        user.setPasswordHash(null);
        resp.setStatus(HttpServletResponse.SC_OK);
        objectMapper.writeValue(resp.getWriter(), user);
    }

    private void handleRegister(Map<?, ?> payload, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String fullName = (String) payload.get("fullName");
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        String phone = (String) payload.get("phone");
        String roleStr = (String) payload.get("role");

        UserRole role = roleStr != null ? UserRole.fromString(roleStr) : UserRole.ATTENDEE;
        // Restrict self-registration of ADMIN
        if (role == UserRole.ADMIN) {
            role = UserRole.ATTENDEE;
        }

        User user = userService.registerUser(fullName, email, password, phone, role);
        HttpSession session = req.getSession(true);
        session.setAttribute("currentUser", user);

        user.setPasswordHash(null);
        resp.setStatus(HttpServletResponse.SC_CREATED);
        objectMapper.writeValue(resp.getWriter(), user);
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write("{\"message\": \"Successfully logged out\"}");
    }
}
