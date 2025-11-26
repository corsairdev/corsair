# Next.js Blog with Corsair

A modern, full-stack blog application built with Next.js 15, Drizzle ORM, and Corsair for type-safe database queries.

## Features

- 🚀 **Next.js 15** with App Router and React Server Components
- 🔒 **Type-Safe Queries** using Corsair's AI-powered query generation
- 💾 **PostgreSQL Database** with Drizzle ORM
- 🎨 **Modern UI** with Tailwind CSS and Radix UI components
- 💬 **Comments System** with real-time updates and user selection
- 📱 **Fully Responsive** design
- ⚡ **React Query** for efficient data fetching and caching

> **Note**: The comment system includes a user selector dropdown to simulate authentication. In a production app, this would be replaced with actual user authentication.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI
- **Database**: PostgreSQL, Drizzle ORM
- **Data Layer**: Corsair, React Query
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up your database connection in `corsair.config.ts`

3. Run database migrations:

```bash
pnpm db:push
```

4. (Optional) Seed the database:

```bash
pnpm db:seed
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog!

## Using Corsair

This project uses Corsair for generating type-safe database queries. See `CLAUDE.md` for detailed instructions on how to use Corsair with AI agents.

### Generate a Query

```bash
pnpm corsair query -n "query-name" -i "description of what the query should do"
```

### Generate a Mutation

```bash
pnpm corsair mutation -n "mutation-name" -i "description of what the mutation should do"
```

### Watch Mode

Run Corsair in watch mode during development for automatic type regeneration:

```bash
pnpm corsair watch
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (blog listing)
│   ├── posts/[slug]/      # Individual post pages
│   └── about/             # About page
├── components/            # React components
│   ├── ui/               # UI primitives (shadcn/ui)
│   ├── post-card.tsx     # Post card component
│   ├── post-list.tsx     # Post list component
│   ├── post-detail.tsx   # Post detail view
│   └── comment-section.tsx # Comments component
├── corsair/              # Corsair queries and mutations
│   ├── queries/          # All database queries
│   ├── mutations/        # All database mutations
│   ├── client.ts         # Client-side Corsair setup
│   └── procedure.ts      # Base procedure config
├── db/                   # Database setup
│   ├── schema.ts         # Drizzle schema
│   └── seed.ts          # Database seeding
└── lib/                  # Utility functions
```

## Database Schema

The blog uses the following main tables:

- **users**: User accounts with profiles
- **posts**: Blog posts with content, metadata, and author
- **comments**: Comments on posts with threading support
- **categories**: Post categories
- **tags**: Post tags
- **post_categories**: Many-to-many relationship
- **post_tags**: Many-to-many relationship

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:seed` - Seed the database
- `pnpm corsair:generate` - Generate Corsair types
- `pnpm corsair:check` - Check queries against schema

## License

MIT
