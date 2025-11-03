# IFS Therapy Application Design Guidelines

## Design Approach

**Selected Framework**: Hybrid Reference-Based Approach  
**Primary References**: BetterHelp's therapeutic interface + Headspace's interactive mindfulness design  
**Core Principle**: Create a calming, trust-building environment that supports deep emotional work while maintaining clarity and functionality

**Design Philosophy**: The application serves as a safe container for vulnerable therapeutic work. Every design decision prioritizes emotional safety, clarity, and gentle guidance while supporting complex collaborative interactions between therapists and clients.

---

## Typography System

**Font Families**:
- **Primary (UI/Body)**: Inter (400, 500, 600 weights)
- **Display/Headers**: Poppins (500, 600, 700 weights)

**Hierarchy**:
- **Hero Headings**: Poppins 600, 48px / 56px line height (mobile: 32px/40px)
- **Section Headers**: Poppins 600, 32px / 40px (mobile: 24px/32px)
- **Card Titles**: Poppins 500, 20px / 28px
- **Body Large**: Inter 400, 18px / 28px (therapeutic content, journaling)
- **Body Regular**: Inter 400, 16px / 24px (standard UI)
- **Labels/Meta**: Inter 500, 14px / 20px
- **Small/Helper**: Inter 400, 13px / 18px

**Emphasis**: Use Inter 500-600 for emphasis rather than bold; maintain soft, approachable tone

---

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units: **2, 4, 6, 8, 12, 16, 20, 24** (as in p-2, m-4, gap-6, etc.)

**Grid Foundation**:
- **Container Max-Width**: max-w-7xl for full layouts, max-w-4xl for content-focused areas
- **Card Padding**: p-6 (mobile), p-8 (desktop)
- **Section Spacing**: py-12 (mobile), py-20 (desktop)
- **Component Gaps**: gap-4 for tight groupings, gap-6 for related items, gap-8 for distinct sections

**Responsive Breakpoints**:
- Mobile-first approach
- Cards stack vertically on mobile, 2-column on tablet (md:), 3-column on desktop (lg:) where appropriate
- Collaborative canvas switches to stacked view on mobile with clear role indicators

---

## Component Library

### Navigation
- **Therapist/Client Portal Header**: Fixed top navigation with role indicator badge, session status, and user avatar
- **Dual-role indicator**: Clear visual differentiation showing current role (therapist vs. client view)
- **Session breadcrumbs**: Show current activity within session flow
- **Mobile**: Hamburger menu with slide-out drawer

### Cards & Containers
- **Base Card**: Rounded corners (12px radius), subtle shadow (shadow-sm), gentle hover lift (shadow-md on hover)
- **Activity Cards**: Feature icon at top, title, description, progress indicator, and CTA button
- **Session Cards**: Include participant avatars, timestamp, status badge, and preview of last activity
- **Parts Mapping Cards**: Draggable elements with distinct visual treatment for Managers, Firefighters, and Exiles

### Forms & Inputs
- **Input Fields**: 12px rounded corners, soft border, generous padding (p-3), focus state with gentle glow
- **Journaling Textarea**: Large, comfortable writing area with line-height of 1.75 for readability
- **Collaborative Indicators**: Real-time typing indicators showing when therapist/client is active
- **Letter Writing Interface**: Styled like handwritten paper with subtle texture

### Interactive Elements
- **Parts Mapping Canvas**: Zoomable/pannable infinite canvas with sticky notes, connecting lines, and color-coded part types
- **Meditation Player**: Clean audio controls with waveform visualization, progress bar, and bookmarking
- **AI Insight Panels**: Distinct container for Perplexity-generated guidance with thoughtful iconography
- **Unburdening Ceremony Module**: Visual step-by-step progress with illustration support for each phase

### Data Display
- **Progress Trackers**: Gentle progress rings/bars showing completion of activities and sessions
- **Session History Timeline**: Vertical timeline with icons marking different activity types
- **Dashboard Widgets**: Summary cards for completed exercises, upcoming sessions, and insights

### Overlays
- **Modals**: Centered with backdrop blur, max-width of prose for content, smooth fade-in animation
- **Tooltips**: Contextual help for IFS terminology, appearing on hover with gentle fade
- **Confirmation Dialogs**: For sensitive actions like ending sessions or unburdening ceremonies

---

## Visual Treatment Specifications

**Shadows**: 
- Cards: `shadow-sm` default, `shadow-md` on hover
- Elevated elements (modals): `shadow-lg`
- Therapeutic imagery: No harsh shadows, use soft drop-shadows

**Borders**: 
- Subtle borders using opacity variations of primary colors rather than grays
- 1px borders for input fields, 2px for focus states

**Whitespace Philosophy**:
- Generous breathing room (24px minimum padding) around all therapeutic content
- Never crowd emotional content; prefer scrolling over cramping
- Collaborative spaces use 32px padding to create sanctuary feeling

**Iconography**: 
- Use Heroicons throughout for consistency
- IFS-specific icons: Soft, rounded style matching Headspace aesthetic
- Part types get distinct icon treatments (Manager: shield, Firefighter: flame, Exile: heart)

---

## Specialized Design Patterns

### Dual Authentication & Role Management
- **Login Screen**: Split-view option for therapist/client with visual distinction
- **Role Switcher**: Prominent toggle for therapists who also engage in personal work
- **Permission States**: Clear visual indicators for collaborative vs. private spaces

### Collaborative Workspace
- **Real-time Presence**: Avatar overlays showing who's viewing/editing
- **Shared Canvas**: Parts mapping with simultaneous editing, color-coded cursors
- **Turn-taking Indicators**: Visual cues for guided exercises where one person leads

### Therapeutic Content Areas
- **6 F's Protocol Interface**: Step-by-step wizard with progress indicator, one question per screen for focus
- **Witness/Retrieval Modules**: Immersive full-screen experience with ambient background, minimal UI chrome
- **Reparenting Toolkit**: Gallery view of activities with preview cards

### AI Integration
- **Perplexity Insight Cards**: Distinct styling with AI indicator, sources linked, "save insight" action
- **Contextual Prompts**: Appearing in sidebar during journaling with gentle suggestions
- **Guided Prompts**: AI-generated questions based on user's current IFS work phase

---

## Images

**Hero Section**: Yes - large calming hero image  
**Placement**: Landing/welcome screen with soft gradient overlay, featuring abstract peaceful imagery (meditation space, nature, soft light)

**Throughout Application**:
- **Activity Cards**: Small illustrative icons/thumbnails representing each reparenting activity
- **Inner Child Visualizations**: User-uploaded or stock images for meditation and witnessing exercises
- **Therapist/Client Avatars**: Circular profile images with soft borders
- **Unburdening Ceremony**: Abstract visual elements (water, fire, light) matching chosen release method
- **Background Patterns**: Subtle, calming textures in therapeutic spaces (very low opacity)

**Image Treatment**: All images use 12px rounded corners, soft shadows, and gentle opacity overlays when text is layered

---

## Animation & Interaction

**Minimal Philosophy**: Animations serve emotional regulation, not decoration

**Permitted Animations**:
- **Gentle Fades**: For transitions between IFS protocol steps (300ms ease-in-out)
- **Progress Indicators**: Smooth fills for completion tracking
- **Collaborative Cursors**: Subtle movement in shared spaces
- **Focus Transitions**: Smooth camera movements in Parts Mapping canvas
- **Loading States**: Breathing pulse animation for AI generation

**No Animations For**: Standard interactions, navigation, most hovers

---

## Accessibility & Therapeutic Safety

- High contrast ratios maintained (WCAG AA minimum)
- Focus states highly visible with soft glow
- Crisis resources always accessible via fixed button
- Pause/exit buttons prominent in all guided exercises
- Screen reader support for all IFS terminology with explanations
- Keyboard navigation throughout, especially for journaling and mapping

---

This design creates a sanctuary for deep therapeutic work while maintaining the clarity and functionality required for professional clinical practice. Every element supports the vulnerable, transformative journey of IFS healing.