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
**IFS Knowledge Library**: Comprehensive educational resource accessible at /ifs-library with 7 tabs covering Foundations of IFS, 8 C's of Self-Energy, Parts System (Manager/Firefighter/Exile), Five Childhood Wounds (Rejection, Abandonment, Injustice, Betrayal, Neglect), 6 F's Protocol, Unburdening Process, and Daily Practices. Each section includes detailed descriptions, examples, and therapeutic guidance.
**AI-Powered Therapeutic Insights**: Perplexity API integration ("llama-3.1-sonar-small-128k-online" model) via dedicated AI Service (server/ai-service.ts) providing 7 core functions: (1) Protocol guidance for 6 F's steps, (2) Parts dialogue analysis with pattern recognition, (3) Wound identification from description/symptoms, (4) Unburdening visualization suggestions with element selection (fire/water/light/air), (5) Reparenting phrase generation for Self-to-exile work, (6) Educational Q&A about IFS theory, and (7) General therapeutic insights. All AI responses include citations and follow trauma-informed IFS principles with emphasis on the 8 C's of Self-energy.
**Parts Dialogue Journal**: Dedicated page (/parts-dialogue) for writing Self-to-parts conversations with AI-powered analysis identifying wounds, patterns, and protective strategies. Includes dialogue templates for Manager, Firefighter, and Exile parts, plus automatic insight saving to user's AI insights collection.
**Collaborative Therapeutic Activities**: Enhanced SharedSessionWorkspace (/session/:sessionId) with 5 specialized tabs: (1) Chat - real-time messaging with WebSocket, (2) 6 F's Protocol - step-by-step collaborative walkthrough with AI guidance at each step, (3) Unburdening - sacred 5-step process (Witness, Validate, Retrieve, Unburden, Invite) with AI-generated visualizations and reparenting phrases, (4) Wound Exploration - AI-powered identification of the 5 childhood wounds with symptom checklist and detailed healing paths, (5) Shared Learning - collaborative curriculum module viewing. All protocols support both therapist and client roles with appropriate prompts and guidance.
**Real-Time Collaboration**: WebSocket-based system for therapist-client sessions, featuring room-based communication, persistent message/note storage, and event handling for real-time updates.
**Multimedia Experience**: Comprehensive multimedia system including guided meditation audio with 3 player variants (default, compact, background), video player for IFS concept explanations with fullscreen support, wound visualizer with color-coded visual representations of 5 core childhood wounds using Lucide icons, and background music player with localStorage persistence for calming atmosphere during protocol work. Centralized media library accessible at /media-library with 4 tabs (Meditations, Videos, Music, Wound Map). Media players use event-driven state management for reliable playback control.

### Architectural Decisions

**Monorepo Structure**: `/shared` directory for common types and schemas, ensuring type safety.
**Type-Safe API Layer**: Custom query client with typed fetch wrapper, Zod schemas for runtime validation and TypeScript types.
**Therapeutic Design System**: CSS custom properties for HSL-based theming (light/dark mode), elevation system with semi-transparent overlays.
**Optimistic UI Pattern**: TanStack Query configured for optimistic updates where immediate feedback is beneficial.

## External Dependencies

**UI & Component Libraries**: Radix UI, Tailwind CSS, class-variance-authority, clsx, Lucide React.
**Form Management**: React Hook Form, Zod, @hookform/resolvers.
**Data & API**: TanStack Query v5, drizzle-orm, drizzle-zod, @neondatabase/serverless.
**AI Integration**: Perplexity API for therapeutic insights via Replit's blueprint integration, with API key managed through environment secrets.
**Date Utilities**: date-fns.
**Development Tools**: TypeScript, Vite, ESBuild, Replit-specific plugins.
**Font Loading**: Google Fonts (Inter, Poppins).

## Recent Changes (November 4, 2025)

### AI-Powered Collaborative Features
- **AI Service Integration**: Complete Perplexity API integration with 7 therapeutic AI functions accessible via backend endpoints at /api/ai/*
- **Parts Dialogue Journal**: New standalone page for writing and analyzing Self-to-parts conversations with AI pattern recognition
- **Collaborative Protocols**: Enhanced SharedSessionWorkspace with AI-guided 6 F's Protocol, Unburdening Process, and Wound Exploration
- **Educational Enhancements**: New IFS Library page with comprehensive content on 8 C's, childhood wounds, and therapeutic protocols
- **Dashboard Improvements**: Client dashboard redesigned to prioritize learning with daily rotating IFS insights and quick access to educational resources

### Key Files Added
- `server/ai-service.ts` - Core AI service with Perplexity integration
- `client/src/pages/PartsDialogueJournal.tsx` - Parts dialogue journal with AI insights
- `client/src/pages/IFSLibrary.tsx` - Comprehensive IFS educational library
- `client/src/components/collaborative/Collaborative6Fs.tsx` - AI-guided 6 F's Protocol
- `client/src/components/collaborative/CollaborativeUnburdening.tsx` - Unburdening workspace
- `client/src/components/collaborative/WoundExploration.tsx` - AI wound identification
- `client/src/lib/ifsKnowledge.ts` - Complete IFS educational content library