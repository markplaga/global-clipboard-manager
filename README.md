# Global Clipboard Manager

A modern cross-device clipboard and text-snippet manager built with Next.js, Supabase, and Tailwind CSS. It lets users securely organize and synchronize reusable text across devices.

## Features

- Create, read, update, and delete snippets
- Favorite important entries
- Organize snippets with custom categories
- Search across saved content
- Synchronize data across devices
- Google OAuth authentication
- Protected routes and secure sessions
- Responsive design with dark-mode support

## Technology

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase PostgreSQL
- Supabase Authentication
- Row Level Security
- Lucide React icons

## Running Locally

1. Install dependencies with `npm install`.
2. Copy `.env.local.example` to `.env.local`.
3. Add the Supabase project URL and anonymous key.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Configure Google OAuth and redirect URLs.
6. Start the app with `npm run dev`.

## Deployment

The project is designed for deployment on Vercel. Add the same environment variables and production redirect URL in the hosting and Supabase settings.

## Status

Production-oriented application with a complete authentication, database, and interface structure.

## License

MIT