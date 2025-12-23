# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sites Odonto 24H** - A comprehensive SaaS platform for dental practice website creation. Dentists complete a detailed briefing form, pay via Stripe, and receive custom websites managed through an admin dashboard. The platform includes blog management, scheduling, and a complete lead-to-delivery workflow.

**Technology Stack:**
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn-ui components
- Supabase (PostgreSQL database + auth + storage)
- Stripe (payment processing)
- Netlify Functions (serverless backend)
- React Router DOM (adaptive routing)
- TanStack React Query (data fetching/caching)
- Tiptap (rich text editor for blog)
- Zod + React Hook Form (validation)

## Development Commands

**IMPORTANT:** All commands must be run from the `swift-dent-studio-16/` directory.

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Runs on http://localhost:8080 (NOT default 5173)
# → Hot module replacement enabled
# → Lovable-tagger enabled for component debugging

# Build for production
npm run build
# → Output to dist/
# → Minified with esbuild (no source maps)

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm preview
# → Runs on http://localhost:4173
# → Opens browser automatically

# Lint code
npm run lint
```

## Key Architecture Patterns

### Adaptive Routing
The application uses intelligent routing that adapts to the hosting environment:
- `src/utils/router.ts` detects if running on Netlify vs static hosting
- Automatically switches between BrowserRouter (Netlify) and HashRouter (GitHub Pages)
- Routes defined in `src/components/RouterProvider.tsx`
- **IMPORTANT:** Always add new routes BEFORE the catch-all `*` route

### Data Layer Architecture
All database operations are centralized in `src/lib/supabase.ts`:
- 30+ typed functions for CRUD operations
- Components NEVER make direct Supabase queries
- TypeScript interfaces define all table structures
- React Query used for caching and refetching

### Component Organization
```
src/components/
├── ui/              # shadcn-ui base components
├── admin/           # Admin dashboard (KanbanBoard, Timeline, Notes, PrivateRoute)
├── blog/            # Blog system (RichTextEditor, SEO, PostContent)
├── sections/        # Original landing page sections
├── redesign/        # Modern landing page redesign
└── mobile/          # Mobile-specific components
```

### Form Data Handling
The 8-section briefing form (`src/pages/Briefing.tsx`, 2600+ lines):
- All form data stored as JSONB in `briefing_data` column
- Images compressed client-side via `utils/imageCompression.ts` (keeps payload under 5MB)
- Base64 encoded for storage, later uploaded to Supabase Storage
- `ReviewStep` component displays all collected data before submission

### Authentication & Route Protection
- Supabase Auth for admin access
- `PrivateRoute` component wraps protected routes
- `AdminLayout` provides consistent admin UI wrapper
- No authentication on public routes (landing, blog, briefing, payment)

## Project Structure

```
swift-dent-studio-16/
├── src/
│   ├── pages/                    # Route pages
│   │   ├── Index.tsx            # Landing page
│   │   ├── Briefing.tsx         # 8-section form (main funnel)
│   │   ├── Payment.tsx          # Stripe checkout
│   │   ├── Blog.tsx             # Blog listing
│   │   ├── BlogPost.tsx         # Individual post
│   │   └── admin/               # Admin dashboard
│   │       ├── DashboardOverview.tsx
│   │       ├── Leads.tsx        # Lead management (list/kanban/reports)
│   │       ├── LeadDetails.tsx  # Individual lead view
│   │       ├── BlogPosts.tsx    # Blog CMS
│   │       └── BlogPostEditor.tsx # Tiptap editor
│   │
│   ├── components/
│   │   ├── RouterProvider.tsx   # ALL routes defined here
│   │   ├── admin/
│   │   │   ├── PrivateRoute.tsx      # Auth guard
│   │   │   ├── AdminLayout.tsx       # Admin wrapper
│   │   │   ├── KanbanBoard.tsx       # Drag-drop board (@dnd-kit)
│   │   │   └── Timeline.tsx          # Status history
│   │   └── blog/
│   │       ├── RichTextEditor.tsx    # Tiptap integration
│   │       └── SEO.tsx               # Meta tags + JSON-LD
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Database layer (ALL queries go here)
│   │   └── downloadUtils.ts     # PDF/ZIP exports
│   │
│   └── utils/
│       ├── imageCompression.ts  # Client-side compression
│       └── router.ts            # Adaptive routing logic
│
├── netlify/functions/
│   ├── create-checkout-session.ts  # Stripe checkout
│   └── stripe-webhook.ts           # Payment webhooks
│
├── supabase/
│   ├── setup.sql                # Core schema
│   ├── blog-setup-fixed.sql     # Blog tables
│   └── agendamentos-setup.sql   # Scheduling tables
│
└── public/                      # Static assets
```

## Major Features & Subsystems

### 1. Lead Management System
**Flow:** Landing → Briefing Form → Payment → Admin Dashboard → Delivery

**Status Workflow:**
```
novo → em_producao → aguardando_aprovacao → aprovado_pagamento →
em_ajustes → aprovacao_final → no_ar → concluido
```

**Database Tables:**
- `leads` - Core lead data with JSONB `briefing_data`
- `lead_status_history` - Audit trail of status changes
- `lead_notes` - Internal admin notes
- `payments` - Payment records (Stripe/legacy MercadoPago)

**Admin Features:**
- 3 viewing modes: List, Kanban Board, Reports
- Drag-drop Kanban with @dnd-kit
- PDF export of briefing data
- ZIP export of customer images
- CSV export for analytics
- Timeline visualization
- Notes system

### 2. Blog System (8 Phases - Fully Integrated)
**Public Pages:**
- `/blog` - Listing with filters, search, categories
- `/blog/:slug` - Individual post with SEO, social sharing, related posts

**Admin CMS:**
- `/admin/blog` - Post management
- `/admin/blog/novo` - Create new post
- `/admin/blog/editar/:id` - Edit post
- `/admin/blog/categorias` - Manage categories (hierarchical)
- `/admin/blog/tags` - Manage tags

**Database:**
- `blog_posts` - Posts with Tiptap JSON content
- `blog_categories` - Hierarchical categories
- `blog_tags` - Tags with many-to-many relationship
- `blog_post_tags` - Junction table

**SEO Features:**
- Meta tags (title, description, Open Graph, Twitter Cards)
- JSON-LD structured data (Article schema)
- Automatic view counter
- Sitemap-ready structure

### 3. Payment Processing
**Stripe Integration:**
1. Frontend calls `/netlify/functions/create-checkout-session` with `leadId`
2. Backend creates Checkout session
3. User pays on Stripe-hosted page
4. Webhook updates Supabase via `/netlify/functions/stripe-webhook`

**Environment Variables:**
- `VITE_STRIPE_PUBLIC_KEY` - Frontend (pk_test_* or pk_live_*)
- `STRIPE_SECRET_KEY` - Backend only (sk_test_* or sk_live_*)
- `STRIPE_WEBHOOK_SECRET` - Webhook validation

### 4. Meeting Scheduling
**Tables:**
- `agendamentos` - Appointments
- `disponibilidade` - Available time slots
- `bloqueios` - Blocked times

**Pages:**
- `/agendar` - Public scheduling
- `/admin/agendamentos` - Admin management

## Database Schema Overview

### Core Tables
```typescript
leads {
  id: UUID
  status: enum (novo, em_producao, aguardando_aprovacao, ...)
  nome, email, whatsapp: string
  briefing_data: JSONB           // All form responses
  valor_total, valor_entrada, valor_saldo: integer (cents)
  preview_url, site_final_url: string
  rodadas_ajustes_usadas: integer (max 2)
  created_at, updated_at: timestamp
}

blog_posts {
  id: UUID
  slug: string (unique)
  title: string
  content: JSONB                 // Tiptap JSON
  cover_image_url: string
  status: enum (draft, published, archived)
  category_id: UUID
  view_count: integer
  published_at, created_at, updated_at: timestamp
}
```

### Supabase Storage Buckets
- `logos` - Clinic logos (public)
- `fotos` - Professional photos (public)
- `depoimentos` - Testimonial images (public)
- `blog-images` - Blog post images (public)

## Environment Variables

Required variables (see `.env.example` for full template):

```bash
# Supabase
VITE_SUPABASE_URL=              # Project URL
VITE_SUPABASE_ANON_KEY=         # Public anon key

# Stripe
VITE_STRIPE_PUBLIC_KEY=         # Frontend (pk_test_* or pk_live_*)
STRIPE_SECRET_KEY=              # Backend only
STRIPE_WEBHOOK_SECRET=          # Webhook validation

# Email (Resend)
RESEND_API_KEY=                 # API key
RESEND_FROM_EMAIL=              # Verified sender
ADMIN_NOTIFICATION_EMAIL=       # Receives notifications

# App
VITE_APP_URL=                   # Base URL for links
VITE_PRICE_TOTAL=49700          # R$ 497.00 in cents
VITE_PRICE_ENTRADA=24850        # 50% deposit
VITE_PRICE_SALDO=24850          # 50% balance
```

## Database Setup

Initial setup requires running SQL scripts in Supabase SQL Editor:
1. `supabase/setup.sql` - Core tables
2. `supabase/blog-setup-fixed.sql` - Blog system
3. `supabase/agendamentos-setup.sql` - Scheduling

Manually create storage buckets:
- Create `logos`, `fotos`, `depoimentos`, `blog-images` in Supabase Storage
- Set all buckets to public access

## Build Configuration

**Vite (`vite.config.ts`):**
- Dev server: port 8080, host `::`
- Build output: `dist/`
- Plugins: `react-swc`, `lovable-tagger` (dev mode only)
- Path alias: `@` → `./src`
- SPA routing: `historyApiFallback: true`
- Minification: esbuild (no source maps in production)

**Important Settings:**
- Dev server runs on port 8080 (NOT 5173)
- Preview runs on port 4173
- lovable-tagger only enabled in development mode

## Common Development Tasks

### Adding a New Route
1. Create page component in `src/pages/`
2. Import in `src/components/RouterProvider.tsx`
3. Add `<Route>` BEFORE the catch-all `*` route
4. Update navigation in `Header.tsx` if needed

### Adding a New Supabase Function
1. Define TypeScript interface in `src/lib/supabase.ts`
2. Create function with try-catch error handling
3. Export function
4. Use React Query in component for caching

Example:
```typescript
export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lead:', error);
    return null;
  }
}
```

### Adding a shadcn-ui Component
```bash
npx shadcn@latest add <component-name>
```

### Working with Images
Images are automatically compressed client-side:
- `utils/imageCompression.ts` handles compression
- Target: keep payload under 5MB
- Converts to base64 for briefing storage
- Later uploaded to Supabase Storage during production

### Testing Payment Flow (Test Mode)
1. Use Stripe test keys (`pk_test_*`, `sk_test_*`)
2. Test card: `4242 4242 4242 4242`, any future date, any CVC
3. Monitor webhook events in Stripe dashboard
4. Verify Supabase table updates

## Important Notes & Conventions

### Path Aliases
All imports use `@/` alias for `src/` directory:
```typescript
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
```

### CEP Integration
Brazilian address autocomplete via ViaCEP API:
- Auto-formats WhatsApp numbers to Brazilian format
- Address lookup integrated in briefing form

### Lovable Integration
Project uses lovable.dev platform:
- AI-assisted development
- Automatic git commits from Lovable
- Component debugging via lovable-tagger in dev mode

### Admin Route Protection
Admin routes are currently NOT protected by PrivateRoute. To enable:
```tsx
<Route path="/admin/dashboard" element={
  <PrivateRoute>
    <DashboardOverview />
  </PrivateRoute>
} />
```

## Deployment

**Primary Platform:** Netlify (though no netlify.toml currently in repo)
- Auto-deploy on git push to main
- Netlify Functions for serverless backend
- Environment variables set in Netlify dashboard
- Stripe webhook URL: `https://[domain]/.netlify/functions/stripe-webhook`

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

## Current Status

**Branch:** `feature/blog-integrado`

**Completed Features:**
- 8-section briefing form
- Stripe payment processing
- Admin dashboard (3 phases)
- Blog system (8 phases - fully integrated)
- Meeting scheduling system
- Lead status workflow
- Analytics and reporting

**Recent Changes:**
- Blog system fully integrated with SEO
- Fixed imports/exports in blog components
- Complete blog documentation added
