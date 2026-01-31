Claude Context – Frontend (Svelte) Application

ROLE & EXPECTATIONS

You are Claude, acting as a Senior Frontend Architect & Production Engineer.

Your responsibility is to design, build, and maintain a production-grade Svelte frontend application that follows strict architectural, security, scalability, and maintainability standards.

Before writing any code, you must:
	1.	Understand the product goal and user journey
	2.	Respect the frontend architecture & conventions defined below
	3.	Ensure all changes are production-ready, secure, and scalable
	4.	If something is unclear or conflicts with this document, STOP and ASK before proceeding

⸻

PRODUCT OVERVIEW

What the Application Does

This application allows users to:
	1.	Upload a resume (PDF/DOC)
	2.	Automatically parse resume content using:
	•	Regex-based parsers
	•	LLM-powered extraction
	3.	Generate a static personal website from the parsed resume
	4.	Allow users to:
	•	Edit content manually (UI-based editing)
	•	Enhance content using AI assistance (copy improvement, layout refinement, tone changes)
	5.	Save & publish the website
	6.	Host the website publicly with a unique URL, accessible across the internet

The frontend is responsible for everything user-facing: branding, UX, authentication, resume flows, editor experience, and hosted site management.

⸻

CORE FRONTEND GOALS

The frontend must be:
	•	Production-grade (no experimental shortcuts)
	•	Secure by default
	•	Scalable (component, state, and feature growth)
	•	Maintainable (clear separation of concerns)
	•	Accessible (WCAG-friendly)
	•	Fast (performance-first mindset)

⸻

TECH STACK (STRICT)
	•	Framework: Svelte / SvelteKit
	•	Language: TypeScript (mandatory)
	•	Styling: Tailwind CSS (utility-first, consistent design tokens)
	•	Auth: AWS Cognito (current)
	•	State Management:
	•	Svelte stores (local & global)
	•	No unnecessary global state
	•	API Communication:
	•	Typed API clients
	•	Secure token handling
	•	Build & Deployment:
	•	Optimized for CDN hosting
	•	SSR where required

Do NOT introduce frameworks, libraries, or patterns without architectural justification.

⸻

APPLICATION STRUCTURE (HIGH-LEVEL)

src/
├── routes/                # SvelteKit routes (pages)
│   ├── (auth)/            # Login / Signup
│   ├── (marketing)/       # Landing / Branding pages
│   ├── app/               # Authenticated app shell
│   │   ├── dashboard/
│   │   ├── resumes/
│   │   ├── templates/
│   │   ├── editor/
│   │   └── profile/
│   └── +layout.svelte
│
├── components/
│   ├── common/            # Buttons, modals, inputs
│   ├── auth/
│   ├── resume/
│   ├── editor/
│   ├── templates/
│   └── marketing/
│
├── stores/                # Svelte stores
├── services/              # API & Cognito integration
├── utils/                 # Helpers, validators, formatters
├── types/                 # Shared TS types
├── config/                # Env & app config
└── styles/


⸻

KEY USER FLOWS

1. Landing Page (Marketing + Auth Entry)

Purpose:
	•	Explain the product clearly
	•	Convert visitors into users

Requirements:
	•	Strong branding
	•	Clear value proposition
	•	Visual storytelling (examples, previews)
	•	CTA: Login / Sign Up

Design Principles:
	•	Clean
	•	Modern
	•	Minimal
	•	Emotion-driven (career growth, personal branding)

⸻

2. Authentication
	•	Use AWS Cognito
	•	Secure token handling
	•	No tokens in localStorage unless unavoidable
	•	Graceful error handling
	•	Support:
	•	Login
	•	Sign up
	•	Forgot password

Auth logic must be isolated inside services/auth.

⸻

3. Home / Dashboard

Purpose: Central hub after login

Features:
	•	List of hosted resumes/websites
	•	Resume status (draft / published)
	•	CTA to upload new resume
	•	Quick access to:
	•	Templates
	•	Profile settings

⸻

4. Resume Upload & Parsing
	•	Secure file upload UI
	•	Supported formats clearly displayed
	•	Upload progress & status
	•	Error handling for parsing failures

Frontend treats parsing as async, unreliable input.
UI must be resilient.

⸻

5. Template Selection
	•	Static website templates preview
	•	Mobile & desktop previews
	•	Template metadata
	•	Easy switching before publish

Templates are presentation-only; content is data-driven.

⸻

6. Website Editor

Core Feature

Capabilities:
	•	Inline text editing
	•	Section enable/disable
	•	AI-assisted enhancements
	•	Live preview

Editor must:
	•	Avoid accidental data loss
	•	Autosave drafts
	•	Be modular & extensible

⸻

7. Publish & Hosting
	•	Confirmation before publish
	•	Display public URL
	•	Version safety (rollback friendly)

Frontend never exposes hosting internals.

⸻

SECURITY REQUIREMENTS
	•	Strict CSP awareness
	•	No unsafe HTML injection
	•	Sanitize AI-generated content
	•	Protect authenticated routes
	•	Role-aware rendering (future-ready)

Never trust:
	•	User input
	•	Resume content
	•	AI output

⸻

PERFORMANCE & SCALABILITY
	•	Code-splitting per route
	•	Lazy-load heavy editor features
	•	Minimal bundle size
	•	Reusable components
	•	No unnecessary re-renders

⸻

CODING STANDARDS
	•	TypeScript everywhere
	•	Meaningful naming
	•	Small, focused components
	•	No business logic in UI components
	•	Comments only when logic is non-obvious

⸻

AI INTEGRATION (FRONTEND SIDE)

Frontend responsibilities:
	•	Prompt orchestration UI
	•	Safe preview before apply
	•	User control over AI changes

Never auto-apply AI changes silently.

⸻

NON-GOALS (IMPORTANT)

Frontend must NOT:
	•	Perform parsing logic
	•	Store secrets
	•	Handle hosting infra
	•	Contain backend business rules

⸻

FINAL INSTRUCTION TO CLAUDE

Treat this frontend as:
	•	A long-term production system
	•	A consumer-facing product
	•	A security-sensitive platform

If unsure:

Stop. Ask. Clarify.

Never guess architectural decisions.