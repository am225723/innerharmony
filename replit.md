# Compassionate Path - IFS Therapy Platform

## Overview

Compassionate Path is a web-based therapeutic platform designed to facilitate Internal Family Systems (IFS) therapy. It provides a safe, calming digital space for individuals to explore their internal parts, process childhood wounds, and develop compassionate self-leadership. The platform supports both client self-work and therapist-client collaboration through guided exercises, parts mapping, journaling, and therapeutic activities. Key capabilities include AI-powered therapeutic insights, a comprehensive IFS educational curriculum, and real-time collaborative session infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite.
**UI Component Library**: Radix UI primitives styled with Tailwind CSS (shadcn/ui pattern), featuring a therapeutic design system with calming colors and rounded corners.
**Design Philosophy**: "Hybrid Reference-Based Approach" inspired by BetterHelp and Headspace, with Inter and Poppins fonts for an approachable tone. Mobile-first responsive design.
**State Management**: TanStack Query for server state, local React state for UI, LocalStorage for user session persistence.
**Routing**: Wouter for client-side routing.

### Backend Architecture

**Runtime & Framework**: Node.js with Express.js for a REST API.
**API Design**: RESTful endpoints organized by resource, supporting CRUD operations.
**Session Management**: Simple credential-based authentication with "therapist" and "client" roles, each having dedicated dashboards. User data stored in localStorage.
**Business Logic**: Swappable storage layer handling users, sessions, activities, IFS parts, journal entries, AI insights, and media.

### Data Storage Solutions

**Current Implementation**: PostgreSQL database with Drizzle ORM via `IStorage` interface.
**Database Schema**: Defined in `shared/schema.ts` for users, sessions, parts, journal entries, activities, aiInsights, and media.
**Migration Strategy**: Drizzle Kit configured for PostgreSQL, utilizing the Neon serverless driver.

### Core IFS Therapy Features

**Parts System**: Three-category classification (Managers, Firefighters, Exiles) aligned with IFS theory.
**Therapeutic Protocols**: Includes the Six F's Protocol, Parts Mapping (visual canvas with attributes), Letter Writing, Witnessing, and Unburdening.
**IFS Educational Curriculum**: A 10-module professional course with 14 interactive protocol-based activities, tiered safety system, and trauma warnings.
**AI-Powered Therapeutic Insights**: Perplexity API integration ("sonar" model) for real-time, trauma-informed IFS insights (journal reflection, parts pattern analysis, Q&A, unburdening visualizations, protector appreciation).
**Real-Time Collaboration**: WebSocket-based system for therapist-client sessions, featuring room-based communication, persistent message/note storage, and event handling for real-time updates.

### Architectural Decisions

**Monorepo Structure**: `/shared` directory for common types and schemas, ensuring type safety.
**Type-Safe API Layer**: Custom query client with typed fetch wrapper, Zod schemas for runtime validation and TypeScript types.
**Therapeutic Design System**: CSS custom properties for HSL-based theming (light/dark mode), elevation system with semi-transparent overlays.
**Optimistic UI Pattern**: TanStack Query configured for optimistic updates where immediate feedback is beneficial.

## External Dependencies

**UI & Component Libraries**: Radix UI, Tailwind CSS, class-variance-authority, clsx, Lucide React.
**Form Management**: React Hook Form, Zod, @hookform/resolvers.
**Data & API**: TanStack Query v5, drizzle-orm, drizzle-zod, @neondatabase/serverless.
**Date Utilities**: date-fns.
**Development Tools**: TypeScript, Vite, ESBuild, Replit-specific plugins.
**Font Loading**: Google Fonts (Inter, Poppins).