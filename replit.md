# Compassionate Path - IFS Therapy Platform

## Overview

Compassionate Path is a web-based therapeutic platform designed to facilitate Internal Family Systems (IFS) therapy. The application provides a safe, calming digital space for individuals to explore their internal parts, process childhood wounds, and develop compassionate self-leadership. Built with a focus on emotional safety and clarity, it supports both client self-work and potential therapist-client collaboration through guided exercises, parts mapping, journaling protocols, and therapeutic activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (November 2025)

### Therapist Dashboard & Session Management (Latest)
- Full therapist dashboard with role-based routing
- Session creation and management with client selection
- Client directory showing all registered clients with session counts
- Real-time dashboard metrics: Total Clients, Active Sessions, Scheduled, Completed
- Authorization: therapist-only access to client data via /api/users endpoint
- Query optimization: staleTime: 0 and refetchOnMount: "always" for fresh data
- Error handling for corrupted localStorage with automatic cleanup

### Database Migration Completed
- Migrated from in-memory storage to PostgreSQL with Drizzle ORM
- Neon Serverless driver configured with WebSocket support
- All data now persists across sessions (users, parts, journal entries, activities, AI insights)

### Progress Tracking System Implemented
- Automatic activity creation when users complete therapeutic exercises
- Activities scoped by userId and sessionId to support multi-session workflows
- Dashboard displays real-time progress metrics from database
- Activity types: parts_mapping (in-progress), six_fs, letter_writing, witnessing, unburdening (completed)

### Current Status
- Dual authentication: Therapist and Client dashboards with role-based routing
- Therapist features: Session management, client directory, client profiles, dashboard analytics
- Client features: Parts Mapping, 6 F's Protocol, Letter Writing, Learning Library, personal dashboard
- Client Management: Therapists can view detailed client profiles with parts, journal entries, activities, and session history
- Educational System: 5 IFS lesson plans with embedded activities, progress tracking, category organization
- Database persistence working with all API routes
- AI insights infrastructure ready (Perplexity "sonar" model configured)

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: Radix UI primitives styled with Tailwind CSS following the shadcn/ui pattern. This provides accessible, customizable components with a therapeutic design system featuring calming colors (soft lavender backgrounds, warm neutrals) and rounded corners for emotional safety.

**Design Philosophy**: The application implements a "Hybrid Reference-Based Approach" drawing from BetterHelp's therapeutic interface and Headspace's mindfulness design. Typography uses Inter for body text and Poppins for headers to maintain a soft, approachable tone. Spacing follows consistent Tailwind units (2, 4, 6, 8, 12, 16, 20, 24) with mobile-first responsive breakpoints.

**State Management**: 
- TanStack Query (React Query) for server state management with custom query functions
- Local React state for component-level UI state
- LocalStorage for user session persistence

**Routing**: Wouter for lightweight client-side routing with routes for Login, Dashboard, Parts Mapping, Six F's Protocol, and Letter Writing activities.

### Backend Architecture

**Runtime & Framework**: Node.js with Express.js server providing a REST API.

**API Design**: RESTful endpoints organized by resource (auth, sessions, parts, journal entries, activities, AI insights, media) following convention:
- POST /api/auth/login for authentication
- GET/POST/PATCH endpoints for CRUD operations on resources
- Query parameters for filtering (e.g., userId)

**Session Management**: Simple credential-based authentication storing user data in localStorage. The system supports two user roles: "therapist" and "client" with dedicated dashboards for each role. Therapists can create and manage therapy sessions, view all registered clients, and track session progress. Clients access self-work tools and their personal therapeutic activities.

**Business Logic**: In-memory storage implementation using an IStorage interface, designed to be swappable with a database-backed implementation. The storage layer handles users, therapy sessions, activities, parts (the IFS concept of internal subpersonalities), journal entries, AI insights, and media.

### Data Storage Solutions

**Current Implementation**: PostgreSQL database with Drizzle ORM via the IStorage interface defined in `server/storage.ts`. This provides persistent CRUD operations for all entity types.

**Database Schema**: Fully defined in `shared/schema.ts` with tables for:
- **users**: Authentication and profile data with role differentiation
- **sessions**: Therapy session tracking with status workflow
- **parts**: IFS parts mapping (managers, firefighters, exiles) with visual positioning data
- **journalEntries**: Protocol-based journaling with structured responses
- **activities**: Tracking therapeutic exercises and their completion status
- **aiInsights**: Storage for AI-generated therapeutic insights
- **media**: Asset management for therapeutic content

**Migration Strategy**: Drizzle Kit configured for PostgreSQL with migrations directory. The Neon serverless driver is included as a dependency, indicating planned cloud database deployment.

### Core IFS Therapy Features

**Parts System**: Three-category classification aligned with IFS theory:
- **Managers**: Proactive protectors that control behavior to prevent pain
- **Firefighters**: Reactive protectors that respond to emotional emergencies  
- **Exiles**: Wounded inner child parts holding trauma and painful emotions

**Therapeutic Protocols**:
- **Six F's Protocol**: Guided journey (Find, Focus, Flesh Out, Feel Toward, beFriend, Fear) for connecting with anxious parts
- **Parts Mapping**: Visual canvas for identifying and positioning internal parts with attributes (type, emotions, body location, color, age)
- **Letter Writing**: Compassionate communication with inner child parts
- **Witnessing & Unburdening**: Additional protocols (referenced in schema but not fully implemented in visible code)

### External Dependencies

**UI & Component Libraries**:
- Radix UI suite (@radix-ui/*) for accessible primitives (dialogs, dropdowns, tooltips, etc.)
- Tailwind CSS for utility-first styling with custom therapeutic color palette
- class-variance-authority and clsx for component variant management
- Lucide React for consistent iconography

**Form Management**:
- React Hook Form for form state and validation
- Zod for schema validation
- @hookform/resolvers for integrating Zod with React Hook Form

**Data & API**:
- TanStack Query v5 for server state synchronization
- drizzle-orm and drizzle-zod for type-safe database operations
- @neondatabase/serverless for PostgreSQL connectivity

**Date Utilities**: date-fns for date manipulation and formatting

**Development Tools**:
- TypeScript for type safety across client and server
- Vite with React plugin for fast development and optimized builds
- ESBuild for server bundling in production
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error overlay)

**Session Storage**: connect-pg-simple for PostgreSQL-backed Express sessions (dependency present but not actively used in visible code)

**Font Loading**: Google Fonts for Inter and Poppins font families, loaded in HTML head for optimal performance

### Authentication & Authorization

**Current Model**: Simple credential-based login with username/password. Auto-creates users on first login attempt. No password hashing or session tokens implemented - this is a prototype/development authentication system.

**Role System**: Two-role model (therapist/client) with role-based access control:
- Therapists: Access to TherapistDashboard, session management, client directory, client profiles
- Clients: Access to personal Dashboard, therapeutic activities (Parts Mapping, 6 F's, Letter Writing)
- RoleBasedDashboard component routes users to appropriate interface based on role
- Corrupted localStorage handled gracefully with automatic cleanup and redirect to login

**Protected Endpoints**:
- `GET /api/users` - Therapist-only (validates requesting user role)
- `GET /api/users/:id` - Therapist-only (validates requesting user role)

**Security Limitations** (MVP/Prototype):
- No therapist-client relationship tracking in database
- Parts/journal/activities endpoints accessible with userId (client-owned data)
- No session tokens or JWT authentication
- Passwords stored in plain text
- No audit logging of data access

**Session Persistence**: User object stored in localStorage after successful login, retrieved on protected route access. React Query configured with aggressive refetching (staleTime: 0, refetchOnMount: "always") to ensure fresh data after login/logout cycles.

### Architectural Decisions

**Monorepo Structure**: Shared types and schemas in `/shared` directory, enabling type safety across client and server boundaries. This eliminates API contract mismatches.

**Type-Safe API Layer**: Custom query client with typed fetch wrapper and automatic error handling. Zod schemas generate both runtime validators and TypeScript types from database schema.

**Therapeutic Design System**: CSS custom properties for HSL-based theming with light/dark mode support. Elevation system using semi-transparent overlays rather than traditional shadows for softer visual hierarchy.

**Optimistic UI Pattern**: React Query configuration with stale-time infinity and disabled refetching suggests optimistic updates for therapeutic journaling activities where immediate feedback is important.

**Progressive Enhancement**: Mobile-first responsive design with careful attention to touch targets and stacking behavior for therapeutic exercises on smaller screens.