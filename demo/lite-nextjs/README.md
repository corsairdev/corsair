# Next.js Lite

A modern full-stack Next.js application with TanStack Query, Drizzle ORM, tRPC, and Better Auth.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TanStack Query** - Powerful data synchronization for React
- **tRPC** - End-to-end type-safe APIs
- **Drizzle ORM** - TypeScript-first SQL ORM
- **Better Auth** - Modern authentication library
- **PostgreSQL** - Relational database
- **Tailwind CSS** - Utility-first CSS framework

## Features

- User authentication (email/password)
- Create and view posts
- Comment on posts
- Like posts
- Full type safety from database to UI

## Database Schema

The application includes the following tables:
- **users** - User accounts
- **sessions** - Auth sessions
- **accounts** - OAuth provider accounts
- **posts** - User-created posts
- **comments** - Comments on posts
- **likes** - Post likes

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Copy `.env.local` and update with your database credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Set up the database:**

   Generate migrations:
   ```bash
   npm run db:generate
   ```

   Push schema to database:
   ```bash
   npm run db:push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...all]/     # Better Auth API routes
│   │   └── trpc/[trpc]/       # tRPC API routes
│   ├── auth/                  # Auth pages (signin, signup)
│   ├── posts/                 # Posts pages
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Home page
├── lib/
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema definitions
│   │   └── index.ts           # Database client
│   ├── trpc/
│   │   ├── routers/           # tRPC routers
│   │   ├── client.ts          # tRPC React client
│   │   ├── context.ts         # tRPC context
│   │   ├── provider.tsx       # React Query provider
│   │   ├── root.ts            # Root router
│   │   └── trpc.ts            # tRPC setup
│   ├── auth.ts                # Better Auth config
│   └── auth-client.ts         # Better Auth client
└── drizzle.config.ts          # Drizzle Kit config
```

## Usage

### Creating an Account

1. Navigate to the sign-up page
2. Enter your name, email, and password
3. You'll be automatically signed in

### Creating Posts

1. Sign in to your account
2. Navigate to the Posts page
3. Fill out the form with a title and content
4. Click "Create Post"

### Interacting with Posts

- View all posts on the posts page
- Click on a post to view details and comments
- Like posts by clicking the like button
- Add comments when signed in

## Development

The application uses:
- **Server Components** for static content
- **Client Components** for interactive features
- **tRPC procedures** for type-safe API calls
- **TanStack Query** for data fetching and caching
- **Drizzle ORM** for database operations

## Database Management

Use Drizzle Studio to visualize and manage your database:

```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio`

## License

MIT
