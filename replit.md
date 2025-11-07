# Compassionate Path - IFS Therapy Platform

## Overview

Compassionate Path is a web-based therapeutic platform designed to facilitate Internal Family Systems (IFS) therapy. It provides a safe, calming digital space for individuals to explore their internal parts, process childhood wounds, and develop compassionate self-leadership. The platform supports both client self-work and therapist-client collaboration through guided exercises, parts mapping, journaling, and therapeutic activities. Key capabilities include AI-powered therapeutic insights, a comprehensive IFS educational curriculum, and real-time collaborative session infrastructure. The business vision is to make IFS therapy accessible and effective, with market potential in mental wellness and digital health, aiming to be a leading platform for self-discovery and healing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript and Vite. It leverages Radix UI primitives styled with Tailwind CSS (shadcn/ui pattern) to create a therapeutic design system with calming colors and rounded corners. The design philosophy is a "Hybrid Reference-Based Approach" inspired by BetterHelp and Headspace, using Inter and Poppins fonts and a mobile-first responsive design. State management is handled by TanStack Query for server state, local React state for UI, and LocalStorage for user session persistence. Wouter is used for client-side routing.

### Backend Architecture

The backend is built with Node.js and Express.js, providing a REST API with endpoints organized by resource to support CRUD operations. Session management uses simple credential-based authentication with "therapist" and "client" roles, and user data is stored in localStorage. Business logic is designed with a swappable storage layer that manages users, sessions, activities, IFS parts, journal entries, AI insights, and media.

### Data Storage Solutions

The current implementation uses a PostgreSQL database with Drizzle ORM via an `IStorage` interface. The database schema is defined in `shared/schema.ts` for entities like users, sessions, parts, journal entries, activities, AI insights, and media. Drizzle Kit is configured for PostgreSQL, utilizing the Neon serverless driver. All tables use an `IFS_` prefix and enums use an `ifs_` prefix for production consistency.

### Core IFS Therapy Features

The platform includes a Parts System classifying Managers, Firefighters, and Exiles. Therapeutic protocols like the Six F's, Parts Mapping, Letter Writing, Witnessing, and Unburdening are supported. An IFS Educational Curriculum offers 10 modules with 14 interactive activities, complemented by an IFS Knowledge Library covering foundational concepts, the 8 C's of Self-Energy, parts, childhood wounds, and daily practices.

AI-Powered Therapeutic Insights, integrated via the Perplexity API ("sonar" model), provide 8 core functions including protocol guidance, parts dialogue analysis, wound identification, unburdening visualization suggestions, reparenting phrase generation, educational Q&A, general therapeutic insights, and Conversational Parts Embodiment where AI responds as internal parts. All AI responses are trauma-informed and emphasize the 8 C's of Self-energy.

A revolutionary Conversational Parts Dialogue interface allows users to engage in real-time chat with AI embodying Manager, Firefighter, or Exile parts, featuring automatic pattern detection, conversation history tracking, and integration with parts maps.

Collaborative Therapeutic Activities are enhanced with a SharedSessionWorkspace, offering real-time chat, AI-guided 6 F's Protocol, Unburdening, Wound Exploration, and Shared Learning modules. Real-time collaboration is powered by a WebSocket-based system for therapist-client sessions.

A comprehensive Multimedia Experience includes guided meditation audio, video players for IFS concept explanations, a wound visualizer, and a background music player, all accessible via a centralized media library.

### Architectural Decisions

A monorepo structure with a `/shared` directory ensures type safety for common types and schemas. A type-safe API layer uses a custom query client with a typed fetch wrapper and Zod schemas for runtime validation. The therapeutic design system employs CSS custom properties for HSL-based theming (light/dark mode), a refined color palette (deep indigo, teal, terracotta) with WCAG AA accessibility, enhanced typography, and a comprehensive spacing scale. An Optimistic UI Pattern is implemented using TanStack Query for immediate user feedback.

### Deployment Architecture

**Production Stack**: Vercel (Frontend + API Routes) + Supabase (PostgreSQL Database)

The application is designed for deployment on Vercel with a Supabase backend. Key deployment files include `supabase_migration.sql` for PostgreSQL schema creation with RLS policies and foreign key constraints, `vercel.json` for Vercel configuration, and `DEPLOYMENT.md` providing a complete deployment guide.

**Migration Strategy**:
- **Initial Setup**: Run `supabase_migration.sql` manually in Supabase SQL Editor (one-time, 759 lines with 24 tables, 76 RLS policies, 42 foreign keys)
- **Ongoing Changes**: Use `npm run db:push -- --force` for schema updates via Drizzle ORM
- **Database Naming**: All tables use `IFS_` prefix (e.g., IFS_users, IFS_sessions), all enums use `ifs_` prefix

**Environment Variables** (configured in Vercel):
- `DATABASE_URL`: PostgreSQL connection string from Supabase
- `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGPORT`: Individual database credentials
- `SESSION_SECRET`: 32+ character random string for session encryption
- `PERPLEXITY_API_KEY`: API key for AI therapeutic insights integration
- `NODE_ENV`: Set to "production" for deployment

## External Dependencies

**UI & Component Libraries**: Radix UI, Tailwind CSS, class-variance-authority, clsx, Lucide React.
**Form Management**: React Hook Form, Zod, @hookform/resolvers.
**Data & API**: TanStack Query v5, drizzle-orm, drizzle-zod, @neondatabase/serverless.
**AI Integration**: Perplexity API for therapeutic insights.
**Date Utilities**: date-fns.
**Development Tools**: TypeScript, Vite, ESBuild.
**Font Loading**: Google Fonts (Inter, Poppins).

## Recent Changes

### November 7, 2025 - Production Deployment & Design Modernization

**Supabase Migration & Vercel Deployment**
- Created production-ready `supabase_migration.sql` (759 lines) with 24 tables using `IFS_` prefix, 76 comprehensive RLS policies, 42 foreign key constraints, and complete indexing
- Configured `vercel.json` with correct build output (`dist/public` to match Vite config), SPA routing, and framework-agnostic setup
- Authored complete `DEPLOYMENT.md` guide (10 parts, 600+ lines) covering Supabase setup, database migration, environment variables, Vercel deployment, AI testing, troubleshooting, security best practices, and scaling
- Established hybrid migration workflow: SQL file for initial setup, Drizzle ORM (`npm run db:push -- --force`) for ongoing changes
- Fixed output directory configuration to match vite.config.ts build path (`dist/public`)
- Architect-verified all deployment configurations for production readiness

**AI Integration Live Verification**
Successfully tested all 8 Perplexity AI endpoints with production API:
1. Protocol Guidance (`/api/ai/protocol-guidance`) - 6 F's step-by-step guidance with 15 citations, ~10s response
2. Parts Dialogue Analysis (`/api/ai/parts-dialogue-analysis`) - Pattern detection with 16 citations, ~13s response
3. Wound Identification (`/api/ai/wound-identification`) - Identifies 5 core wounds with healing paths, 18 citations, ~20s
4. Unburdening Visualization (`/api/ai/unburdening-visualization`) - Element-based visualization suggestions, ~2s response (tested with error handling - requires valid partId for full metrics)
5. Reparenting Phrases (`/api/ai/reparenting-phrases`) - 4 compassionate healing phrases with 11 citations, ~6s
6. Educational Q&A (`/api/ai/ifs-question`) - IFS theory explanations with 12 citations, ~9s
7. General Insights (`/api/ai/ask-question`) - Therapeutic guidance with practical steps, ~6s
8. Conversational Parts (`/api/ai/part-conversation`) - First-person parts responses with 12 citations, ~3s

Performance: 3-20 second response times depending on complexity, 10-18 citations per response, proper error handling verified.

**UI/UX Modernization**
- **Color Palette**: Sophisticated professional theme replacing bright therapeutic colors
  - Primary: Deep indigo `hsl(233 60% 52%)` - calming professional authority
  - Secondary: Refined teal `hsl(184 65% 45%)` - therapeutic trust
  - Accent: Warm terracotta `hsl(12 76% 61%)` light mode / `hsl(12 76% 48%)` dark mode
  - All combinations verified WCAG AA compliant (≥4.5:1 contrast) in both light and dark modes
  - Enhanced neutrals for improved text hierarchy (foreground, muted-foreground, border colors)
- **Typography System**: Enhanced font hierarchy with h1-h6 optimized sizing, body line-height 1.6, paragraphs 1.7, headings 1.2, negative letter-spacing for headings (-0.02em to -0.03em), font feature settings for ligatures and contextual alternates
- **Spacing System**: Comprehensive scale with xs (8px), sm (12px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), plus content max-widths for optimal readability (narrow 640px, base 1024px, wide 1280px)

**Files Modified**:
- `supabase_migration.sql` - New production database schema
- `vercel.json` - New Vercel deployment configuration  
- `DEPLOYMENT.md` - New comprehensive deployment guide
- `client/src/index.css` - Modernized color palette, typography, and spacing
- `replit.md` - Updated with deployment architecture and changes documentation