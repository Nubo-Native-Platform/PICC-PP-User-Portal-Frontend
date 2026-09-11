# Development Guidelines and Contribution Standards: `PICC-PP-User-Portal-Frontend`

This document defines the architectural standards, development workflows, coding conventions, and security requirements for contributors to **`PICC-PP-User-Portal-Frontend`**.

---

## Table of Contents

1. [Architecture & Design Principles](#1-architecture--design-principles)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Directory Structure & Organization](#3-directory-structure--organization)
4. [Coding Standards & Best Practices](#4-coding-standards--best-practices)
   - [TypeScript & React Conventions](#typescript--react-conventions)
   - [Shared Styling System & Design Tokens](#shared-styling-system--design-tokens)
   - [API Service Layer & Data Fetching](#api-service-layer--data-fetching)
   - [Session Management & Cookie Policies](#session-management--cookie-policies)
   - [Zero-Trust Security & Credential Hygiene](#zero-trust-security--credential-hygiene)
5. [Code Quality & Linting Tooling](#5-code-quality--linting-tooling)
6. [Git Workflow & Commit Guidelines](#6-git-workflow--commit-guidelines)
7. [Pull Request (PR) Checklist](#7-pull-request-pr-checklist)
8. [Release Lifecycle & Versioning](#8-release-lifecycle--versioning)

---

## 1. Architecture & Design Principles

`PICC-PP-User-Portal-Frontend` is the tenant and end-user portal for the **Nubo Native Platform (NNP)** within the **Platform Infrastructure and Core Components (PICC)** ecosystem. It is designed around these core principles:

1. **Modern Component-Driven Frontend**: Built with **React 18**, **TypeScript 5.6**, and **Vite 6** for fast development cycles, high-fidelity type checking, and optimized production chunking.
2. **Standardized Platform Design System**: Styled via the public `@nubo-native-platform/nnp-shared-styles` package and Tailwind CSS, preserving design token consistency across both admin and user portals.
3. **Decoupled API Abstraction Layer**: Microservice interactions are encapsulated in strongly-typed service clients (`src/services/*`) with interceptors handling authentication headers, status codes, and error toasts. Direct unmanaged network calls in components are prohibited.
4. **Environment Portability**: All service endpoints, authentication hosts, external links, and cookie domains are externalized via Vite environment variables (`import.meta.env.VITE_*`) with resilient local fallbacks.
5. **Zero-Trust Hardened Packaging**: The production application runs inside an unprivileged Alpine NGINX container (`UID 101`) with OWASP security headers, gzip compression, and non-root execution.

---

## 2. Development Environment Setup

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` LTS
- **npm**: `v10.x` or higher
- **Git**: `v2.40+`

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Nubo-Native-Platform/PICC-PP-User-Portal-Frontend.git
cd PICC-PP-User-Portal-Frontend

# Create local environment config from template
cp .env.example .env

# Install dependencies using legacy peer deps resolution
npm ci --legacy-peer-deps

# Launch Vite development server
npm run dev
```

The portal starts on `http://localhost:3006/nnp-login/`.

---

## 3. Directory Structure & Organization

```
src/
├── assets/                     # Static media, SVG icons, and company logos
├── baseComponents/             # Core layout structures (TopHeader, Footer, LoginModal)
├── components/                 # Domain-specific feature components
│   ├── account/                # Account settings, user profile, and Kubernetes Pods
│   ├── ai/                     # AI streaming Q&A component (SearchAi)
│   ├── home/                   # Tenant dashboard and metrics
│   ├── register/               # Self-service registration & plan checkout
│   └── support/                # Support ticketing interface
├── configs/                    # App routing, navigation menus, and grid configurations
├── containers/                 # Top-level view container wrappers
├── contexts/                   # React context providers
├── models/                     # TypeScript types, interfaces, and data models
├── services/                   # HTTP service clients (Auth, Admin, Support, Cookies)
└── sharedComponents/           # Reusable UI widgets (NNPGrid, CustomModal, Accordions)
```

---

## 4. Coding Standards & Best Practices

### TypeScript & React Conventions
- **Strict Typing**: Explicitly type props, state, API payloads, and event handlers.
- **Functional Components**: Use functional components with React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Semantic Components**: Decompose large container views into reusable, testable subcomponents.

### Shared Styling System & Design Tokens
- Always import platform styles via the public package:
  ```scss
  @use '@nubo-native-platform/nnp-shared-styles/src/index.scss';
  ```
- Use CSS variables defined in `@nubo-native-platform/nnp-shared-styles` (e.g., `var(--component-color-blue)`, `var(--text-color-primary)`) rather than hardcoded hex color values.
- Leverage Tailwind utility classes for layout, flexbox, grid, spacing, and responsive breakpoints.

### API Service Layer & Data Fetching
- Define all API endpoints in `src/services/` (e.g., `AdminAPI.ts`, `PublicSvc.ts`, `AuthAPI.ts`).
- Never hardcode hostnames, ports, or IP addresses in service files. Use `import.meta.env`:
  ```typescript
  const host = import.meta.env.VITE_DASH_HOST || "http://localhost:3000/nnpdash";
  ```
- Handle errors gracefully using sweetalert2 toasts or standardized modal notices.

### Session Management & Cookie Policies
- Read and write session cookies exclusively via `CookieService` (`src/services/cookies.ts`).
- Scoped cookie domains must adapt between local testing (`.localhost`) and production (`.example.com`):
  ```typescript
  domain: import.meta.env.VITE_COOKIE_DOMAIN || "localhost"
  ```

### Zero-Trust Security & Credential Hygiene
- **Never Commit Credentials**: API tokens, private keys, GitLab PATs (`glpat-*`), internal passwords, and `.env` files must NEVER be staged or committed.
- **No Private Hostnames/IPs**: Private cluster IPs (`10.26.*`, `192.168.*`) and corporate hostnames must be replaced with environment variables or RFC 2606 / 5737 documentation standards (`example.com`, `192.0.2.x`).

---

## 5. Code Quality & Linting Tooling

Run code validation commands prior to opening a pull request:

```bash
# Execute ESLint validation
npm run lint

# Compile TypeScript and verify production bundle
npm run build
```

Ensure zero blocking lint errors and zero TypeScript compiler failures before submitting code.

---

## 6. Git Workflow & Commit Guidelines

### Branch Naming Conventions
- `feature/<issue-id>-<short-description>` (e.g., `feature/102-k8s-pod-logs`)
- `fix/<issue-id>-<short-description>` (e.g., `fix/105-session-expiry-redirect`)
- `chore/<short-description>` (e.g., `chore/bump-dependencies`)

### Conventional Commits
Format all commit messages according to the Conventional Commits specification:
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```
Examples:
- `feat(k8s): add real-time log streaming for container pods`
- `fix(auth): handle expired refresh token gracefully in interceptor`
- `docs(readme): add docker compose quick start instructions`

---

## 7. Pull Request (PR) Checklist

Before submitting a Pull Request, verify:
- [ ] Code compiles cleanly with `npm run build`.
- [ ] Linting passes with `npm run lint`.
- [ ] No hardcoded secrets, GitLab PATs, or internal IP addresses exist.
- [ ] All new environment variables are documented in `.env.example`.
- [ ] Responsive UI verified on desktop and mobile viewports.
- [ ] Commit history is clean and follows conventional commit syntax.

---

## 8. Release Lifecycle & Versioning

This project adheres to **Semantic Versioning (SemVer 2.0.0)** (`MAJOR.MINOR.PATCH`):
- **MAJOR**: Incompatible architectural changes or breaking API updates.
- **MINOR**: Backward-compatible new user portal capabilities or views.
- **PATCH**: Backward-compatible bug fixes and security patches.

Releases are published automatically via GitHub Actions upon tagging `v*.*.*`.
