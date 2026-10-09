<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.festora.model.User" %>
<%
    User currentUser = (User) session.getAttribute("currentUser");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Festora — Discover. Connect. Celebrate.</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-dark: #3730a3;
            --surface: #ffffff;
            --background: #f8fafc;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background: var(--background);
            color: var(--text-main);
            line-height: 1.5;
        }
        .header {
            background: #fff;
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .brand {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .tagline {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: 500;
        }
        .hero {
            padding: 4rem 2rem;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }
        .hero h1 {
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 1rem;
            color: #0f172a;
        }
        .hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: var(--primary);
            color: #fff;
            padding: 0.75rem 1.75rem;
            border-radius: 0.5rem;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.15s ease;
        }
        .btn:hover { background: var(--primary-dark); }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 1.5rem;
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }
        .card {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .card img {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }
        .card-body {
            padding: 1.25rem;
        }
        .card-title {
            font-size: 1.15rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .card-meta {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
        }
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border);
        }
        .price { font-weight: 700; color: var(--primary); }
    </style>
</head>
<body>
    <header class="header">
        <div>
            <a href="index.jsp" class="brand">Festora</a>
            <span class="tagline">Discover. Connect. Celebrate.</span>
        </div>
        <nav style="display:flex; gap:1.5rem; align-items:center;">
            <a href="events.jsp" style="text-decoration:none; color:inherit; font-weight:500;">Events</a>
            <% if (currentUser != null) { %>
                <a href="my-tickets.jsp" style="text-decoration:none; color:inherit; font-weight:500;">My Tickets</a>
                <% if (currentUser.isAdmin()) { %>
                    <a href="admin/dashboard.jsp" style="text-decoration:none; color:inherit; font-weight:500;">Admin</a>
                <% } %>
                <span style="font-size:0.9rem; color:#4f46e5; font-weight:600;"><%= currentUser.getFullName() %></span>
                <a href="api/auth/logout" class="btn" style="padding:0.4rem 1rem; font-size:0.85rem;">Logout</a>
            <% } else { %>
                <a href="login.jsp" style="text-decoration:none; color:inherit; font-weight:500;">Login</a>
                <a href="register.jsp" class="btn" style="padding:0.5rem 1.25rem;">Get Started</a>
            <% } %>
        </nav>
    </header>

    <main>
        <section class="hero">
            <h1>Discover Unforgettable Events.<br>Connect with Passions.</h1>
            <p>Festora powers premier gatherings, technical summits, artisan workshops, and live concerts. Powered by enterprise Java Jakarta Servlets and MySQL.</p>
            <a href="events.jsp" class="btn">Explore All Events</a>
        </section>
    </main>
</body>
</html>
