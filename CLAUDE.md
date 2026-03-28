# CLAUDE.md — Global Clipboard Manager

Guidance for AI assistants working on this codebase.

---

## Project Overview

A web-based clipboard/snippet manager built with Next.js App Router, Supabase, and shadcn/ui. Users can store, organize, and retrieve text snippets across sessions. Data is stored per-user in Supabase with Row-Level Security enforcing data isolation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI Components | shadcn/ui (new-york style) + Radix UI primitives |
| Styling | Tailwind CSS v4 with OKLCH color system |
| Backend/Auth | Supabase (PostgreSQL + Auth + RLS) |
| Icons | Lucide React |
| Fonts | Geist Sans + Geist Mono (next/font) |

---

## Repository Structure

```
global-clipboard-manager/
├── app/                        # Next.js App Router pages
│   ├── auth/callback/route.ts  # Supabase OAuth callback handler
│   ├── login/page.tsx          # Login/signup page
│   ├── page.tsx                # Main protected dashboard (server component)
│   ├── layout.tsx              # Root layout with Geist fonts
│   └── globals.css             # Tailwind v4 config + CSS variables
├── components/
│   ├── ui/                     # shadcn/ui base components (do not modify directly)
│   ├── Dashboard.tsx           # Client component; owns all snippet/category state
│   ├── AppSidebar.tsx          # Navigation: user info, filter tabs, category list
│   ├── AuthForm.tsx            # Sign in / sign up form
│   ├── SnippetCard.tsx         # Single snippet with copy, favorite, edit, delete
│   ├── AddSnippetDialog.tsx    # Modal form to create a snippet
│   ├── EditSnippetDialog.tsx   # Modal form to edit a snippet
│   ├── AddCategoryDialog.tsx   # Modal form to create a category
│   └── EditCategoryDialog.tsx  # Modal form to rename/delete a category
├── lib/
│   └── utils.ts                # cn() helper for Tailwind class merging
├── types/
│   └── index.ts                # Shared TypeScript types (Snippet, Category)
├── utils/supabase/
│   ├── client.ts               # Browser Supabase client (createBrowserClient)
│   ├── server.ts               # Server Supabase client (createServerClient + cookies)
│   └── middleware.ts           # Session refresh middleware helper
├── supabase/
│   └── schema.sql              # Full DB schema with RLS policies
├── middleware.ts               # Next.js middleware (session handling)
├── components.json             # shadcn/ui config
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Development Workflow

### Setup

```bash
npm install
```

Set required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Apply the database schema by running `supabase/schema.sql` in the Supabase SQL editor.

### Commands

```bash
npm run dev     # Start development server (http://localhost:3000)
npm run build   # Production build
npm run start   # Run production server
npm run lint    # Run ESLint
```

### No test suite exists yet. When adding tests, use Vitest + React Testing Library.

---

## Architecture Patterns

### Server vs. Client Components

- `app/page.tsx` is a **server component**: it fetches initial data (categories + snippets) from Supabase server-side and passes them as props to `Dashboard`.
- `Dashboard.tsx` is a **client component** (`"use client"`): it owns all mutable UI state and calls Supabase from the browser for mutations.
- All dialog components are client components since they use React hooks.

### Data Flow

```
app/page.tsx (server)
  └─ fetches categories + snippets via server Supabase client
  └─ passes as initialCategories / initialSnippets props to Dashboard

Dashboard.tsx (client)
  └─ useState for local state
  └─ calls Supabase browser client for all CRUD operations
  └─ passes data + handlers down to AppSidebar, SnippetCard, and dialog components
```

### Supabase Client Usage

- **Server components / route handlers**: import from `@/utils/supabase/server`
- **Client components**: import from `@/utils/supabase/client`
- Never use the server client in a client component (it uses Node.js cookie APIs).

### Authentication

- Supabase email/password auth with optional OAuth
- Sessions managed via cookies using `@supabase/ssr`
- `middleware.ts` refreshes sessions on every request
- `app/page.tsx` redirects unauthenticated users to `/login`

---

## Database Schema

Three tables in PostgreSQL (see `supabase/schema.sql`):

### `profiles`
Auto-created from `auth.users` via trigger. Stores display metadata.
- `id` (uuid, PK, references auth.users)
- `username`, `full_name`, `avatar_url`, `website`
- RLS: public read, users can only insert/update their own row

### `categories`
User-defined groups for organizing snippets.
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `name` (text)
- `color` (text, one of 8 fixed values: `blue`, `green`, `red`, `yellow`, `purple`, `pink`, `orange`, `teal`)
- RLS: full CRUD restricted to owner via `user_id`

### `snippets`
Core data — stored clipboard entries.
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `category_id` (uuid, FK → categories, nullable)
- `content` (text)
- `is_favorite` (boolean, default false)
- `created_at`, `updated_at` (timestamps; `updated_at` auto-set by trigger)
- RLS: full CRUD restricted to owner via `user_id`

---

## Key Conventions

### TypeScript

- Strict mode is enabled — no `any` types without justification.
- Shared types live in `types/index.ts`. Add new shared types there.
- Use the `@/` path alias for all imports (maps to project root).

### Styling

- Use Tailwind utility classes exclusively; avoid inline styles.
- Merge conditional classes with `cn()` from `lib/utils.ts` (wraps `clsx` + `tailwind-merge`).
- The primary color palette is **teal**. CSS variables are defined in `globals.css` using OKLCH.
- Dark mode is supported via CSS variables — use semantic tokens (`background`, `foreground`, `muted`, etc.), not hardcoded color values.
- Touch-friendly UX: action buttons on `SnippetCard` are always visible on touch devices, hover-only on desktop (achieved via `group-hover` + `@media(hover:none)`).

### Components

- UI primitives (button, dialog, input, etc.) come from `components/ui/`. These are shadcn/ui generated files — prefer not modifying them. Add variants via shadcn CLI instead.
- Dialog components follow a consistent pattern: controlled open/close state passed as props, form state local to the dialog, callback prop for saving results.
- All Supabase mutations in `Dashboard.tsx` update local state optimistically (or refetch after mutation).

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

This adds to `components/ui/`. Do not hand-write shadcn components.

### File Naming

- React components: `PascalCase.tsx`
- Utilities and helpers: `camelCase.ts`
- Route segments follow Next.js App Router conventions (`page.tsx`, `layout.tsx`, `route.ts`)

---

## Common Tasks

### Add a new snippet field

1. Update `supabase/schema.sql` with the new column (+ migration SQL)
2. Update `types/index.ts` → `Snippet` type
3. Update `AddSnippetDialog.tsx` and `EditSnippetDialog.tsx` forms
4. Update insert/update calls in `Dashboard.tsx`
5. Update `SnippetCard.tsx` display if needed

### Add a new page/route

1. Create `app/<route>/page.tsx` (server component by default)
2. Add `"use client"` only if the page needs hooks or browser APIs
3. Update `AppSidebar.tsx` navigation links if it should appear in the nav

### Add a new category color

1. Add the color name to the `colors` array in `AddCategoryDialog.tsx` and `EditCategoryDialog.tsx`
2. Add a corresponding Tailwind class mapping in the same files (color dot rendering)
3. The `color` field in the DB is freeform text — no migration needed

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |

Both variables are exposed to the browser (prefixed `NEXT_PUBLIC_`). Do not store sensitive keys this way.

---

## Deployment

Designed for deployment on **Vercel**:
- Set environment variables in the Vercel project settings
- Supabase OAuth redirect URL must be configured to include the Vercel domain
- The `middleware.ts` requires the Edge Runtime (Vercel default)

---

## Known Gaps / Future Work

- **No test suite** — unit and integration tests should be added (Vitest + React Testing Library recommended)
- **No real-time sync** — architecture supports Supabase Realtime subscriptions but they are not yet wired up
- **No error boundaries** — global error handling via React error boundaries is not implemented
- **No loading states** — skeleton loaders or suspense boundaries not yet added
