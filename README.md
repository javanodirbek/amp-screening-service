<div align="center">

# 🛡️ AML Screening & Transaction Monitoring System

### Anti-Money Laundering platform with real-time fuzzy name screening, blacklist management and a four-eyes compliance workflow.

[![Java](https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#license)

</div>

---

## 📌 Overview

**AML-STMS** is a full-stack platform that helps financial institutions detect transactions involving sanctioned, terrorist or extremist individuals before money leaves the system. Every outgoing transaction is screened against a configurable blacklist using two complementary string-similarity algorithms; matches above a defined threshold are blocked automatically and routed to a compliance officer for a final decision.

The project demonstrates an end-to-end implementation of a regulated-industry workflow: secure REST API, role-based access control, an auditable review process, bulk import of watch lists, and a clean operational UI.

> Built as a graduation project, engineered to production standards.

---

## ✨ Key Features

- 🔎 **Real-time screening** — every transaction is automatically checked against the blacklist on creation
- 🧠 **Hybrid fuzzy matching** — combines **Levenshtein distance** and **Jaro–Winkler similarity** to catch typos, transliterations and partial matches
- 🌐 **Cyrillic / Latin aware normalization** — Unicode NFC, lowercase, ё→е, hyphen handling, diacritics stripping
- 🧾 **Configurable threshold** — `screening.threshold` (default `0.80`) tunes false-positive vs false-negative balance
- 👥 **Role-based access control** — three roles (`ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER`) with method-level `@PreAuthorize`
- 🔐 **Stateless JWT authentication** — Spring Security 6, BCrypt password hashing, custom `AuthenticationEntryPoint`
- 📥 **Bulk blacklist import** — JSON-based mass loading of sanctions / watch lists
- 🧑‍⚖️ **Four-eyes review workflow** — operators submit, compliance officers approve or reject blocked transactions with mandatory comments
- 📊 **Auditable decisions** — every check is persisted with score, algorithm, threshold and timestamp
- 🛡️ **PII masking in logs** — full names are masked (`Ivanov I. I.`) before being written to logs
- 🐳 **One-command deployment** — `docker compose up` brings up app + database

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────────────────────┐         ┌────────────────┐
│                     │  HTTPS  │           Spring Boot 3.3.4          │   JPA   │                │
│  React 18 SPA       │ ──────▶ │                                      │ ──────▶ │  PostgreSQL 15 │
│  (Bootstrap 5)      │  JWT    │  ┌────────────────────────────────┐  │         │                │
│                     │ ◀────── │  │ Controllers (REST)             │  │         └────────────────┘
└─────────────────────┘         │  ├────────────────────────────────┤  │
                                │  │ Services                       │  │
                                │  │  • ScreeningService (fuzzy)    │  │
                                │  │  • ReviewService (workflow)    │  │
                                │  │  • ImportService (bulk)        │  │
                                │  │  • AuthService (JWT)           │  │
                                │  ├────────────────────────────────┤  │
                                │  │ Spring Security + JWT Filter   │  │
                                │  ├────────────────────────────────┤  │
                                │  │ Repositories (Spring Data JPA) │  │
                                │  └────────────────────────────────┘  │
                                └──────────────────────────────────────┘
```

### Transaction lifecycle

```
            ┌─────────┐
            │ PENDING │
            └────┬────┘
                 ▼
           ┌──────────┐
           │ CHECKING │  ◀── ScreeningService (Levenshtein + Jaro–Winkler)
           └────┬─────┘
        ┌──────┴───────┐
        ▼              ▼
   ┌─────────┐   ┌──────────────┐
   │  CLEAR  │   │ BLOCKED_AUTO │
   └─────────┘   └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │ UNDER_REVIEW │  ◀── Operator submits for review
                 └──────┬───────┘
                  ┌─────┴─────┐
                  ▼           ▼
             ┌──────────┐ ┌──────────┐
             │ APPROVED │ │ REJECTED │  ◀── Compliance officer decides
             └──────────┘ └──────────┘
```

---

## 🧰 Tech Stack

### Backend
| Layer            | Technology                                                                 |
|------------------|----------------------------------------------------------------------------|
| Language         | **Java 21**                                                                |
| Framework        | **Spring Boot 3.3.4** (Web, Data JPA, Security, Validation, Actuator)      |
| Security         | Spring Security 6, **JWT** (`jjwt 0.12.3`), BCrypt                         |
| Persistence      | Spring Data JPA, Hibernate, **PostgreSQL 15**                              |
| Mapping          | **MapStruct 1.5.5**                                                        |
| Fuzzy matching   | **Apache Commons Text 1.15** (Levenshtein, Jaro-Winkler)                   |
| Boilerplate      | Lombok                                                                     |
| Build            | Gradle (Wrapper)                                                           |
| Testing          | JUnit 5, Spring Security Test, **Testcontainers** (PostgreSQL)             |
| Container        | Eclipse Temurin 21 JRE Alpine, Docker Compose                              |

### Frontend
| Layer            | Technology                                                                 |
|------------------|----------------------------------------------------------------------------|
| Library          | **React 18**                                                               |
| Routing          | React Router 6                                                             |
| HTTP             | Axios (with interceptors for JWT)                                          |
| UI               | Bootstrap 5 + Bootstrap Icons                                              |
| Auth             | Context API (`AuthContext`) + Private routes with role guards              |

---

## 🔐 Security Model

| Role                  | Capabilities                                                                                  |
|-----------------------|-----------------------------------------------------------------------------------------------|
| `ADMIN`               | Manage users, full blacklist CRUD, bulk import, view everything                               |
| `OPERATOR`            | Register clients, create transactions, browse blacklist, submit blocked transactions to review |
| `COMPLIANCE_OFFICER`  | Review blocked transactions, approve / reject with mandatory comment, browse blacklist        |

- **Stateless** sessions, JWT in `Authorization: Bearer` header
- Whitelisted endpoints: `/auth/login`, `/auth/register`
- All other endpoints protected by JWT filter + `@PreAuthorize` per-method authorization
- CORS configured for Vercel frontend domain (configurable via `CORS_ALLOWED_ORIGINS` env variable)

---

## 🧮 The Screening Algorithm

The matching pipeline lives in [`ScreeningService`](src/main/java/aml/code/screeningservice/service/ScreeningService.java) and runs on every new transaction:

1. **Normalization** — Unicode NFC → lowercase → `ё→е` → strip non-letter chars → collapse whitespace
2. **Candidate selection** — index lookup by the first word of the recipient name against active blacklist entries (avoids comparing against the full list)
3. **Dual scoring** — for each candidate compute:
   - `Levenshtein` similarity = `1 - distance / max(len)`
   - `Jaro-Winkler` similarity
4. **Best score wins** — `max(levenshtein, jaroWinkler)` is taken as the match score
5. **Decision** — score `>= threshold` → `HIT` → `BLOCKED_AUTO`; otherwise → `CLEAR`
6. **Audit** — a `CheckResult` row is persisted with score, algorithm, threshold, matched entry and timestamp

This dual-algorithm approach is robust against:
- Typos and OCR errors (Levenshtein)
- Word-order and prefix variations common in transliterated names (Jaro-Winkler)

---

## 📡 REST API

> Base URL: `http://localhost:7777`

### Auth
| Method | Endpoint          | Access | Description                |
|--------|-------------------|--------|----------------------------|
| POST   | `/auth/login`     | Public | Get JWT                    |
| POST   | `/auth/register`  | Public | Register a new user        |

### Clients
| Method | Endpoint          | Access                                  | Description                |
|--------|-------------------|-----------------------------------------|----------------------------|
| POST   | `/clients`        | `ADMIN`, `OPERATOR`                     | Register new client        |
| GET    | `/clients`        | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | List clients             |
| GET    | `/clients/{id}`   | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | Get client by id         |

### Blacklist
| Method | Endpoint            | Access                                  | Description                          |
|--------|---------------------|-----------------------------------------|--------------------------------------|
| POST   | `/blacklist`        | `ADMIN`                                 | Add entry                            |
| GET    | `/blacklist`        | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | Paginated list (filter by status, listType) |
| GET    | `/blacklist/{id}`   | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | Get by id                            |
| PATCH  | `/blacklist/{id}`   | `ADMIN`, `COMPLIANCE_OFFICER`           | Update entry                         |
| DELETE | `/blacklist/{id}`   | `ADMIN`                                 | Delete entry                         |
| POST   | `/blacklist/import` | `ADMIN`                                 | Bulk import                          |

### Transactions & Review
| Method | Endpoint                              | Access                                  | Description                                    |
|--------|---------------------------------------|-----------------------------------------|------------------------------------------------|
| POST   | `/transactions`                       | `ADMIN`, `OPERATOR`                     | Create transaction (auto-screened)             |
| GET    | `/transactions`                       | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | Paginated list (filter by status)              |
| GET    | `/transactions/{id}`                  | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | Get transaction with check result              |
| POST   | `/transactions/{id}/submit-review`    | `ADMIN`, `OPERATOR`, `COMPLIANCE_OFFICER` | Send blocked transaction to officer            |
| POST   | `/transactions/{id}/approve`          | `COMPLIANCE_OFFICER`                    | Approve blocked transaction (with comment)     |
| POST   | `/transactions/{id}/reject`           | `COMPLIANCE_OFFICER`                    | Reject blocked transaction (with comment)      |

### Supported list types

`TERRORIST`, `EXTREMIST`, `SANCTIONS_RU`, `SANCTIONS_EU`, `ROSFINMONITORING`

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://front-aml.vercel.app](https://front-aml.vercel.app) |
| **Backend API** | [render.com](render.com) |

### Demo credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

---



### Prerequisites
- JDK **21**
- Node.js **18+** and npm
- Docker & Docker Compose (optional but recommended)

### Option A — Run with Docker Compose (recommended)

```bash
./gradlew clean build -x test
docker compose up --build
```

Services:
- API → `http://localhost:7777`
- PostgreSQL → `localhost:5433`

### Option B — Run locally

1. Start PostgreSQL and create database `aml` (user `postgres`, password `1111`, port `5432`).
2. Run the backend:
   ```bash
   ./gradlew bootRun
   ```
3. Run the frontend:
   ```bash
   cd front
   npm install
   npm start
   ```
   Frontend → `http://localhost:3000`

### Configuration

Override defaults via environment variables or `application.properties`:

| Property                       | Default                  | Description                       |
|--------------------------------|--------------------------|-----------------------------------|
| `SPRING_DATASOURCE_URL`        | `jdbc:postgresql://...`  | JDBC URL                          |
| `SPRING_DATASOURCE_USERNAME`   | `postgres`               | DB user                           |
| `SPRING_DATASOURCE_PASSWORD`   | `1111`                   | DB password                       |
| `JWT_SECRET`                   | _(set in compose)_       | HMAC secret for JWT signing       |
| `SCREENING_THRESHOLD`          | `0.80`                   | Match threshold (0.0 – 1.0)       |
| `SERVER_PORT`                  | `7777`                   | HTTP port                         |

> ⚠️ **Production note:** rotate the JWT secret and database credentials. The values shipped in `docker-compose.yml` are dev-only.

---

## 📁 Project Structure

```
aml-diploma-project/
├── src/main/java/aml/code/screeningservice/
│   ├── config/           # Security, CORS, password encoder, app config
│   ├── controller/       # REST endpoints
│   ├── dto/              # Request / response DTOs
│   ├── entity/           # JPA entities (Client, Transaction, BlacklistEntry, CheckResult, User)
│   │   └── enums/        # Domain enums (TransactionStatus, MatchResult, ListType, UserRole, …)
│   ├── exception/        # Custom exceptions
│   ├── filter/           # JWT authentication filter
│   ├── handler/          # Global exception handler
│   ├── mapper/           # MapStruct mappers
│   ├── repository/       # Spring Data JPA repositories
│   ├── security/         # Authentication helpers
│   ├── service/          # Business logic (Screening, Review, Auth, Import, …)
│   └── util/             # Utilities
├── src/main/resources/
│   └── application.properties
├── front/                # React 18 SPA
│   └── src/
│       ├── api/          # Axios client with JWT interceptor
│       ├── components/   # Navbar, Sidebar, PrivateRoute, Pagination, …
│       ├── context/      # AuthContext
│       └── pages/        # Login, Dashboard, Clients, Transactions, Blacklist, Import, Users
├── Dockerfile
├── docker-compose.yml
└── build.gradle
```

---

## 🧪 Testing

```bash
./gradlew test
```

The test suite uses **JUnit 5**, **Spring Security Test** and **Testcontainers** (PostgreSQL) so integration tests run against a real database without polluting the local one.

---

## 🗺️ Roadmap

- [ ] OpenAPI / Swagger UI documentation
- [ ] Refresh tokens and token rotation
- [ ] Audit log entity for every state transition
- [ ] Webhook notifications on `BLOCKED_AUTO`
- [ ] CSV / XLSX bulk import in addition to JSON
- [ ] Metrics dashboard (Micrometer + Prometheus + Grafana)
- [ ] CI pipeline (GitHub Actions: build, test, docker push)
- [ ] Internationalization of the frontend (en / ru / uz)

---

## 👤 Author

Built with care as a graduation project.

If this project helped you or you'd like to chat about backend engineering, AML / compliance tech, or fuzzy matching — feel free to reach out.

---