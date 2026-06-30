# Converso — AI-Powered Learning Management System

Converso is an industry-grade, real-time AI-powered tutoring and Learning Management System (LMS) designed to facilitate interactive, voice-driven study sessions. Leveraging cutting-edge Speech-to-Speech (S2S) AI models and a modern web stack, Converso allows users to build personalized AI companions tailored to specific subjects and topics, participate in voice learning sessions, and track their educational journey.
---

## 🚀 Key Features

*   **Real-time AI Voice Tutoring:** Voice-to-voice interaction sessions powered by the **Vapi AI Web SDK** with low latency, providing immediate speech feedback.
*   **Custom Companion Builder:** Users can create AI companions customized by name, academic subject (Maths, Science, Coding, History, Economics, etc.), learning topics, AI voice (male/female), speech style (formal/casual), and session duration.
*   **Context-Aware Dialogues:** Dynamic system prompt generation that instructs the LLM background model on tutor guidelines, specific topic scope, and pedagogical approaches.
*   **Interactive Voice Transcripts:** Live captioning system displaying conversational transcripts dynamically in real-time.
*   **Personal Dashboard (My Journey):** Personalized student stats dashboard showing lessons completed, custom companions created, bookmarked lessons, and detailed historical logs.
*   **Dynamic Theme System:** Fully responsive light and dark mode toggling, styled via CSS variables, tailwind, and Shadcn UI.
*   **Robust Session History & Bookmarks:** Integrated bookmarking mechanisms and session logs with database timestamps to keep track of user interactions.

---

## 🛠️ Technology Stack & Third-Party Tools

Converso is built using high-performance modern web technologies:

*   **Frontend Framework:** Next.js (App Router, Server Actions, TypeScript)
*   **CSS & UI Components:** Tailwind CSS & Shadcn UI (for clean, responsive, and beautiful layouts)
*   **Voice AI Service:** Vapi AI (for Speech-to-Text, Voice synthesis, and Conversation Orchestration)
*   **Voice Synthesis:** ElevenLabs (via Vapi AI voice providers mapping casual/formal voices)
*   **Database & Backend:** Supabase (PostgreSQL with Realtime capabilities)
*   **Authentication & Identity:** Clerk Authentication (secure sessions, user accounts, and sign-in widgets)
*   **Animations:** Lottie React (rendering interactive audio soundwaves during active tutoring sessions)
*   **Error Monitoring:** Sentry (real-time application error logging)

---

## 📁 Repository Structure

```text
├── app/                      # Next.js App Router pages and API routes
│   ├── api/                  # Backend endpoints (Sentry examples, webhooks)
│   ├── companions/           # Companion creation form and dynamic workspace sessions
│   ├── my-journey/           # User dashboard, stats, and historical logs
│   ├── globals.css           # Global stylesheets, Tailwind base, and Dark/Light variables
│   ├── layout.tsx            # Global layout wrapping Clerk and Theme Providers
│   └── page.tsx              # Home / Dashboard landing page
├── components/               # Reusable React components
│   ├── ui/                   # Shadcn UI primitives (Accordion, Table, Button, Form)
│   ├── CompanionComponent.tsx# Core Vapi voice call, transcript handler, and Lottie animations
│   ├── CompanionForm.tsx     # Zod-validated React Hook Form to construct companions
│   ├── Navbar.tsx            # Main top navigation header with user profile & theme toggle
│   ├── ThemeProvider.tsx     # Context provider managing theme state persistence
│   └── ThemeToggle.tsx       # Sun/Moon theme toggler
├── constants/                # Project constants, voice configuration IDs, and subjects
├── lib/                      # Helper utilities and server actions
│   ├── actions/              # Supabase database Server Actions (companions, sessions, bookmarks)
│   ├── supabase.ts           # Supabase client instantiation
│   └── vapi.sdk.ts           # Vapi SDK singleton instance
├── types/                    # TypeScript interfaces and Vapi event declarations
└── package.json              # NPM dependencies and project scripts
```

---

## 🔑 Environment Variables & API Keys

To run Converso locally, you will need to set up the following keys in a `.env.local` file at the root of your project directory:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Route Configurations
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase PostgreSQL Configuration Keys
NEXT_PUBLIC_SUPABASE_URL=https://your_supabase_project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Vapi Web SDK Key
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
```

---

## ⚙️ How to Run Locally

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI-LMS---SAAS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file at the root of the project using the variables described in the [Environment Variables](#-environment-variables--api-keys) section.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the application.

### 5. Build for production
```bash
npm run build
npm start
```
