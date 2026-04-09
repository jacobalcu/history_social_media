# Kairos 🏛️

> A high-performance, full-stack social platform dedicated to historical discovery and discussion.

🔗 **[Live Application](https://www.kairoshistory.com/)** | 📚 **[Interactive API Documentation](https://history-social-media.onrender.com/docs)**

## Overview

Kairos is a modern web application designed to connect users through historical content. Users can securely register, publish articles, apply relational tags, and explore a globally curated feed of history.

This project was engineered with a strict focus on scalable system design, utilizing a fully decoupled architecture with a stateless API, advanced asynchronous caching, and automated deployment pipelines.

## System Architecture

### Frontend (Client)

- **Framework:** React 18 (built with Vite for optimized bundling)
- **Styling:** Tailwind CSS for a minimal, responsive UI
- **Network & State:** Axios for asynchronous API communication with strict session-based JWT management.
- **Deployment:** Vercel (Edge network delivery with custom rewrite rules for SPA routing)

### Backend (API)

- **Framework:** Python / FastAPI
- **Architecture:** Fully asynchronous, RESTful API design.
- **Authentication:** Stateless JSON Web Tokens (JWT) with bcrypt password hashing.
- **Deployment:** Render (Continuous deployment via GitHub integration)

### Database & Caching Layer

- **Primary Database:** PostgreSQL (hosted via Supabase)
- **ORM & Migrations:** SQLAlchemy and Alembic for robust schema evolution and remote data migrations.
- **High-Speed Cache:** Redis (hosted via Upstash) utilizing `redis.asyncio` for non-blocking read operations.

---

## Core Engineering Features

### ⚡ High-Performance "Master Slice" Pagination

To prevent database bottlenecks on the public Explore feed, the application implements an advanced Redis cache-aside pattern.

- The backend generates a "Master Slice" of the top 100 recent articles and stores it in Redis RAM.
- Incoming pagination requests (`?skip=x&limit=y`) are intercepted, and Python performs lightning-fast list slicing directly from the cached memory, dropping endpoint latency from ~200ms to ~20ms.
- "Deep Scroll" edge cases seamlessly bypass the cache to query historical PostgreSQL data directly.

### 🛡️ Automated Cache Invalidation

To guarantee strict data consistency, the backend employs a "Cache Invalidation on Write" architecture. Any `POST`, `PUT`, or `DELETE` request that alters feed data triggers a targeted, asynchronous `delete` command to the Redis server, ensuring the next read request immediately generates a fresh cache.

### 🗄️ Soft-Delete Architecture

To protect user data and maintain relational integrity, the application utilizes a soft-delete mechanism. Database drops are restricted; instead, deletions trigger a boolean update (`is_deleted = True`), which is actively filtered out by the API's read operations.

### 🔐 Stateless Security

User sessions are maintained without database lookups. The FastAPI backend mints a secure, cryptographically signed JWT upon login. The React frontend stores this in temporary `sessionStorage` to enforce strict re-authentication upon browser exit, ensuring high-level user security.
