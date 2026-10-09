package com.festora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.festora.exception.FestoraException;
import com.festora.model.Event;
import com.festora.model.User;
import com.festora.service.EventService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Jakarta Servlet exposing REST endpoints and MVC routing for Events.
 * Endpoint: /api/events/*
 */
@WebServlet("/api/events/*")
public class EventServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final EventService eventService = new EventService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        String pathInfo = req.getPathInfo();
        String idParam = req.getParameter("id");

        // 1. Single Event Detail
        if (idParam != null || (pathInfo != null && pathInfo.length() > 1)) {
            Long eventId = null;
            try {
                eventId = idParam != null ? Long.parseLong(idParam) : Long.parseLong(pathInfo.substring(1));
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Invalid event ID format\"}");
                return;
            }

            Optional<Event> eventOpt = eventService.getEventById(eventId);
            if (eventOpt.isPresent()) {
                resp.setStatus(HttpServletResponse.SC_OK);
                objectMapper.writeValue(resp.getWriter(), eventOpt.get());
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"Event not found\"}");
            }
            return;
        }

        // 2. Featured Events Check
        String featured = req.getParameter("featured");
        if ("true".equalsIgnoreCase(featured)) {
            int limit = 6;
            try {
                if (req.getParameter("limit") != null) limit = Integer.parseInt(req.getParameter("limit"));
            } catch (NumberFormatException ignored) {}

            List<Event> featuredEvents = eventService.getFeaturedEvents(limit);
            resp.setStatus(HttpServletResponse.SC_OK);
            objectMapper.writeValue(resp.getWriter(), featuredEvents);
            return;
        }

        // 3. Search and Multi-Filter
        String q = req.getParameter("q");
        String category = req.getParameter("category");
        String dateRange = req.getParameter("date");
        String sortBy = req.getParameter("sort");
        Double maxPrice = null;

        try {
            if (req.getParameter("maxPrice") != null) {
                maxPrice = Double.parseDouble(req.getParameter("maxPrice"));
            }
        } catch (NumberFormatException ignored) {}

        List<Event> events = eventService.searchEvents(q, category, dateRange, maxPrice, sortBy);
        resp.setStatus(HttpServletResponse.SC_OK);
        objectMapper.writeValue(resp.getWriter(), events);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null || !currentUser.isOrganizer()) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"error\": \"Only event organizers and admins can create events.\"}");
            return;
        }

        try {
            Event event = objectMapper.readValue(req.getInputStream(), Event.class);
            Event created = eventService.createEvent(event, currentUser);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            objectMapper.writeValue(resp.getWriter(), created);
        } catch (FestoraException e) {
            resp.setStatus(e.getStatusCode());
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Authentication required\"}");
            return;
        }

        try {
            Event event = objectMapper.readValue(req.getInputStream(), Event.class);
            boolean success = eventService.updateEvent(event, currentUser);
            if (success) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\": \"Event updated successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Failed to update event\"}");
            }
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
            resp.getWriter().write("{\"error\": \"Missing event id parameter\"}");
            return;
        }

        try {
            Long eventId = Long.parseLong(idParam);
            boolean deleted = eventService.deleteEvent(eventId, currentUser);
            if (deleted) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\": \"Event deleted successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"Event not found or cannot be deleted\"}");
            }
        } catch (FestoraException e) {
            resp.setStatus(e.getStatusCode());
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(String.format("{\"error\": \"%s\"}", e.getMessage()));
        }
    }
}
