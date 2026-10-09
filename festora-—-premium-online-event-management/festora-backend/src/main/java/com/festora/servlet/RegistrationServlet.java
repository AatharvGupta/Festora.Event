package com.festora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.festora.exception.FestoraException;
import com.festora.exception.OverbookingException;
import com.festora.model.Registration;
import com.festora.model.User;
import com.festora.service.RegistrationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Jakarta Servlet managing ticket bookings, attendee passes, and thread-safe registration.
 * Endpoint: /api/registrations/*
 */
@WebServlet("/api/registrations/*")
public class RegistrationServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final RegistrationService registrationService = new RegistrationService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Authentication required\"}");
            return;
        }

        String eventIdParam = req.getParameter("eventId");
        String codeParam = req.getParameter("code");

        // 1. Single Ticket Pass Lookup by Code
        if (codeParam != null && !codeParam.trim().isEmpty()) {
            Optional<Registration> regOpt = registrationService.getRegistrationByCode(codeParam.trim());
            if (regOpt.isPresent()) {
                resp.setStatus(HttpServletResponse.SC_OK);
                objectMapper.writeValue(resp.getWriter(), regOpt.get());
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"Ticket pass not found\"}");
            }
            return;
        }

        // 2. Organizer / Admin Viewing Event Attendees
        if (eventIdParam != null) {
            if (!currentUser.isOrganizer()) {
                resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                resp.getWriter().write("{\"error\": \"Only organizers can view attendee rosters.\"}");
                return;
            }
            Long eventId = Long.parseLong(eventIdParam);
            List<Registration> attendees = registrationService.getEventAttendees(eventId);
            resp.setStatus(HttpServletResponse.SC_OK);
            objectMapper.writeValue(resp.getWriter(), attendees);
            return;
        }

        // 3. User Viewing Their Own Booked Tickets
        List<Registration> myRegistrations = registrationService.getUserRegistrations(currentUser.getId());
        resp.setStatus(HttpServletResponse.SC_OK);
        objectMapper.writeValue(resp.getWriter(), myRegistrations);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Please log in to complete your ticket registration.\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo != null && pathInfo.endsWith("/cancel")) {
            handleCancellation(req, resp, currentUser);
            return;
        }

        try {
            Map<?, ?> payload = objectMapper.readValue(req.getInputStream(), Map.class);
            Long eventId = Long.valueOf(payload.get("eventId").toString());
            int ticketsCount = Integer.parseInt(payload.get("ticketsCount").toString());

            // Execute synchronized thread-safe booking
            Registration registration = registrationService.bookSeats(currentUser, eventId, ticketsCount);

            resp.setStatus(HttpServletResponse.SC_CREATED);
            objectMapper.writeValue(resp.getWriter(), registration);

        } catch (OverbookingException e) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict for overbooking
            resp.getWriter().write(String.format("{\"error\": \"%s\", \"code\": \"OVERBOOKING_REJECTED\"}", e.getMessage()));
        } catch (FestoraException e) {
            resp.setStatus(e.getStatusCode());
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Authentication required\"}");
            return;
        }

        String idParam = req.getParameter("id");
        if (idParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Missing registration id parameter\"}");
            return;
        }

        try {
            Long registrationId = Long.parseLong(idParam);
            boolean cancelled = registrationService.cancelRegistration(registrationId, currentUser);
            if (cancelled) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\": \"Registration cancelled and seats replenished.\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Registration could not be cancelled.\"}");
            }
        } catch (FestoraException e) {
            resp.setStatus(e.getStatusCode());
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        }
    }

    private void handleCancellation(HttpServletRequest req, HttpServletResponse resp, User currentUser) throws IOException {
        try {
            Map<?, ?> payload = objectMapper.readValue(req.getInputStream(), Map.class);
            Long registrationId = Long.valueOf(payload.get("registrationId").toString());
            boolean cancelled = registrationService.cancelRegistration(registrationId, currentUser);
            if (cancelled) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\": \"Registration cancelled and seats replenished.\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Registration could not be cancelled.\"}");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        }
    }
}
