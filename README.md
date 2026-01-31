# Global Clipboard Manager

A modern, cross-device clipboard manager built with Next.js, Supabase, and Tailwind CSS. Manage your text snippets across multiple devices with Google Authentication.

![Global Clipboard Manager](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-teal)

## Features

✨ **Core Functionality**
- 📋 Create, read, update, and delete text snippets
- ⭐ Favorite important snippets for quick access
- 🏷️ Organize snippets with custom categories
- 🔍 Real-time search across all snippets
- 🔄 Cross-device synchronization via Supabase

🎨 **Design**
- Modern, distinctive teal color palette
- Fully responsive layout
- Dark mode support
- Clean, production-ready UI with shadcn/ui components

🔐 **Authentication**
- Google OAuth integration via Supabase
- Secure session management
- Protected routes with middleware

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.com/)
  - PostgreSQL Database
  - Google OAuth Authentication
  - Row Level Security (RLS)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account ([sign up free](https://supabase.com))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd global-clipboard-manager
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > API**
3. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create tables, RLS policies, and triggers

### 5. Enable Google OAuth

1. In Supabase dashboard, go to **Authentication > Providers**
2. Enable **Google** provider
3. Add your OAuth credentials (or use Supabase's for testing)
4. Add your site URL to **Redirect URLs** (e.g., `http://localhost:3000`)

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── auth/callback/     # OAuth callback handler
│   ├── login/             # Login page
│   ├── page.tsx           # Main dashboard (protected)
│   └── globals.css        # Global styles & Tailwind config
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── AppSidebar.tsx     # Navigation sidebar
│   ├── AuthButton.tsx     # Google sign-in button
│   ├── Dashboard.tsx      # Main dashboard logic
│   ├── SnippetCard.tsx    # Snippet display card
│   └── AddSnippetDialog.tsx
├── utils/supabase/        # Supabase client utilities
├── types/                 # TypeScript definitions
└── supabase/
    └── schema.sql         # Database schema
```

## Database Schema

### Tables

**profiles**
- User profile information (auto-created on signup)

**categories**
- User-defined categories for organizing snippets
- Fields: `id`, `user_id`, `name`, `color`

**snippets**
- The clipboard snippets
- Fields: `id`, `user_id`, `category_id`, `content`, `is_favorite`, `created_at`, `updated_at`

All tables have Row Level Security (RLS) policies ensuring users can only access their own data.

## Deployment

### Deploy to Vercel

The easiest way to deploy is via [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add your environment variables in the Vercel project settings.

### Update Redirect URLs

After deployment, add your production URL to Supabase:
1. Go to **Authentication > URL Configuration**
2. Add your production URL to **Redirect URLs**

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
