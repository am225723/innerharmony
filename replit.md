# Compassionate Path - IFS Therapy Platform

## Overview

Compassionate Path is a web-based therapeutic platform designed to facilitate Internal Family Systems (IFS) therapy. It provides a safe, calming digital space for individuals to explore their internal parts, process childhood wounds, and develop compassionate self-leadership. The platform supports both client self-work and therapist-client collaboration through guided exercises, parts mapping, journaling, and therapeutic activities. Key capabilities include AI-powered therapeutic insights, a comprehensive IFS educational curriculum, and real-time collaborative session infrastructure. The business vision is to make IFS therapy accessible and effective, with market potential in mental wellness and digital health, aiming to be a leading platform for self-discovery and healing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript and Vite. It leverages Radix UI primitives styled with Tailwind CSS (shadcn/ui pattern) to create a therapeutic design system with calming colors and rounded corners. State management is handled by TanStack Query for server state, local React state for UI, and LocalStorage for user session persistence. Wouter is used for client-side routing. The design philosophy is a "Hybrid Reference-Based Approach" inspired by BetterHelp and Headspace, using Inter and Poppins fonts and a mobile-first responsive design. An Optimistic UI Pattern is implemented using TanStack Query for immediate user feedback.

### Backend Architecture

The backend is built with Node.js and Express.js, providing a REST API with endpoints organized by resource to support CRUD operations. Authentication is handled by Supabase Auth with JWT token verification on all protected routes. User roles ("therapist" and "client") support role-based access control, with therapists able to access client data and clients restricted to their own resources. Business logic is designed with a swappable storage layer. All protected routes enforce ownership checks and prevent horizontal privilege escalation.

### Data Storage Solutions

The current implementation uses a PostgreSQL database with Drizzle ORM via an `IStorage` interface. The database schema is defined in `shared/schema.ts` for entities like users, sessions, parts, journal entries, activities, AI insights, and media. Drizzle Kit is configured for PostgreSQL, utilizing the Neon serverless driver. All tables use an `IFS_` prefix and enums use an `ifs_` prefix for production consistency.

### Core IFS Therapy Features

The platform includes a Parts System classifying Managers, Firefighters, and Exiles. Therapeutic protocols like the Six F's, Parts Mapping, Letter Writing, Witnessing, and Unburdening are supported. An IFS Educational Curriculum offers 10 modules with 14 interactive activities, complemented by an IFS Knowledge Library covering foundational concepts, the 8 C's of Self-Energy, parts, childhood wounds, and daily practices.

AI-Powered Therapeutic Insights, integrated via the Perplexity API ("sonar" model), provide 8 core functions including protocol guidance, parts dialogue analysis, wound identification, unburdening visualization suggestions, reparenting phrase generation, educational Q&A, general therapeutic insights, and Conversational Parts Embodiment where AI responds as internal parts. All AI responses are trauma-informed and emphasize the 8 C's of Self-energy.

A revolutionary Conversational Parts Dialogue interface allows users to engage in real-time chat with AI embodying Manager, Firefighter, or Exile parts, featuring automatic pattern detection, conversation history tracking, and integration with parts maps.

Collaborative Therapeutic Activities are enhanced with a SharedSessionWorkspace, offering real-time chat, AI-guided 6 F's Protocol, Unburdening, Wound Exploration, and Shared Learning modules. Real-time collaboration is powered by a WebSocket-based system for therapist-client sessions.

A comprehensive Multimedia Experience includes guided meditation audio, video players for IFS concept explanations, a wound visualizer, and a background music player, all accessible via a centralized media library.

### Architectural Decisions

A monorepo structure with a `/shared` directory ensures type safety for common types and schemas. A type-safe API layer uses a custom query client with a typed fetch wrapper and Zod schemas for runtime validation. The therapeutic design system employs CSS custom properties for HSL-based theming (light/dark mode), a refined color palette (deep indigo, teal, terracotta) with WCAG AA accessibility, enhanced typography, and a comprehensive spacing scale.

### Deployment Architecture

**Production Stack**: Vercel (Frontend + API Routes) + Supabase (PostgreSQL Database)

The application is designed for deployment on Vercel with a Supabase backend. Key deployment files include `supabase_migration.sql` for PostgreSQL schema creation with RLS policies and foreign key constraints, `vercel.json` for Vercel configuration, and `DEPLOYMENT.md` providing a complete deployment guide.

**Migration Strategy**:
- **Initial Setup**: Run `supabase_migration.sql` manually in Supabase SQL Editor.
- **Ongoing Changes**: Use `npm run db:push -- --force` for schema updates via Drizzle ORM.
- **Database Naming**: All tables use `IFS_` prefix (e.g., IFS_users, IFS_sessions), all enums use `ifs_` prefix.

**Environment Variables** (configured in Vercel):
- `DATABASE_URL`, `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGPORT`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `SESSION_SECRET`, `PERPLEXITY_API_KEY`, `NODE_ENV`

## External Dependencies

**UI & Component Libraries**: Radix UI, Tailwind CSS, class-variance-authority, clsx, Lucide React.
**Form Management**: React Hook Form, Zod, @hookform/resolvers.
**Data & API**: TanStack Query v5, drizzle-orm, drizzle-zod, @neondatabase/serverless.
**AI Integration**: Perplexity API for therapeutic insights.
**Date Utilities**: date-fns.
**Development Tools**: TypeScript, Vite, ESBuild.
**Font Loading**: Google Fonts (Inter, Poppins).