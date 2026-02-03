# Corsair Fly.io Demo

A Next.js application configured for fly.io deployment with Inngest integration, Drizzle ORM, and Corsair plugins for Slack, Linear, and Resend.

## Features

- Next.js 14 with App Router
- Inngest for background jobs and event processing
- Drizzle ORM with PostgreSQL
- Corsair for multi-tenant integrations (Slack, Linear, Resend)
- tRPC for type-safe APIs
- Docker support for local and production deployment
- Fly.io ready configuration

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Fly.io CLI (for deployment)
- Inngest account (free at https://inngest.com)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Database
DATABASE_URL="postgres://postgres:postgres@localhost:5432/corsair_demo"

# Corsair Encryption Key (generate with: openssl rand -base64 32)
CORSAIR_KEK="your-encryption-key"

# Integration API Keys
SLACK_BOT_TOKEN="xoxb-..."
RESEND_API_KEY="re_..."
LINEAR_API_KEY="lin_oauth_..."

# Inngest Configuration
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Optional configurations
SLACK_LINEAR_CHANNEL_ID="C..."
LINEAR_TEAM_ID="..."
```

### 3. Start Local Database

```bash
npm run db:up
```

### 4. Push Database Schema

```bash
npm run db:push
```

### 5. Start Development Server

In separate terminals:

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Inngest dev server
npm run inngest:dev
```

Your app will be available at:
- Next.js: http://localhost:3000
- Inngest: http://localhost:8288

## Available Scripts

### Database

- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations

### Development

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run inngest:dev` - Start Inngest dev server

### Testing

- `npm run test` - Test Slack channels
- `npm run test:db` - Test database connection
- `npm run test:linear` - Test Linear integration
- `npm run trigger:inngest` - Trigger a test Inngest event

## API Endpoints

### Health Check

```
GET /api/health
```

Returns the application health status and database connectivity.

### Inngest

```
GET/POST/PUT /api/inngest
```

Inngest event handler endpoint.

### tRPC

```
GET/POST /api/trpc/*
```

Type-safe API endpoints:
- `health.check` - Health check
- `events.trigger` - Trigger Inngest events
- `events.testEvent` - Send test event

### Webhooks

```
POST /api/webhook
```

Generic webhook handler that forwards to Inngest.

## Deploying to Fly.io

### 1. Install Fly.io CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login to Fly.io

```bash
fly auth login
```

### 3. Create a Fly.io App

```bash
fly launch
```

Follow the prompts. The `fly.toml` configuration is already set up.

### 4. Create a PostgreSQL Database

```bash
fly postgres create
```

### 5. Attach Database to App

```bash
fly postgres attach <postgres-app-name>
```

### 6. Set Environment Variables

```bash
fly secrets set CORSAIR_KEK="your-encryption-key"
fly secrets set SLACK_BOT_TOKEN="xoxb-..."
fly secrets set RESEND_API_KEY="re_..."
fly secrets set LINEAR_API_KEY="lin_oauth_..."
fly secrets set INNGEST_EVENT_KEY="your-inngest-event-key"
fly secrets set INNGEST_SIGNING_KEY="your-inngest-signing-key"
fly secrets set SLACK_LINEAR_CHANNEL_ID="C..."
fly secrets set LINEAR_TEAM_ID="..."
```

### 7. Deploy

```bash
fly deploy
```

### 8. Push Database Schema

After deployment, push the schema to your production database:

```bash
# Connect to your Fly.io app and run migrations
fly ssh console -C "node -e \"require('./scripts/migrate.js')\""

# Or use fly proxy to connect locally
fly proxy 5432 -a <postgres-app-name>
# Then run: npm run db:push
```

## Connecting Inngest to Fly.io

1. Go to your Inngest dashboard (https://app.inngest.com)
2. Navigate to your app settings
3. Add your Fly.io app URL as an event endpoint:
   ```
   https://your-app.fly.dev/api/inngest
   ```
4. Inngest will send events to this endpoint, which will be processed by your functions

## Project Structure

```
.
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── health/          # Health check endpoint
│   │       ├── inngest/         # Inngest handler
│   │       ├── trpc/            # tRPC endpoints
│   │       └── webhook/         # Generic webhooks
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   └── schema.ts           # Drizzle schema
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/        # tRPC routers
│   │   │   ├── root.ts         # Root router
│   │   │   └── trpc.ts         # tRPC setup
│   │   ├── inngest/
│   │   │   ├── client.ts       # Inngest client
│   │   │   └── functions.ts    # Inngest functions
│   │   └── corsair.ts          # Corsair setup
│   └── scripts/
│       ├── test-channels.ts    # Test Slack
│       ├── test-db.ts          # Test database
│       ├── test-linear.ts      # Test Linear
│       └── trigger-inngest.ts  # Trigger Inngest event
├── Dockerfile                   # Docker configuration
├── docker-compose.yml          # Local PostgreSQL
├── fly.toml                    # Fly.io configuration
└── drizzle.config.ts           # Drizzle configuration
```

## Inngest Functions

The following Inngest functions are configured:

- `slack-event-handler` - Process Slack events
- `linear-event-handler` - Process Linear events and send Slack notifications
- `issue-reported-handler` - Create Linear issues from custom events
- `test-event-handler` - Test event handler

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Make sure PostgreSQL is running: `npm run db:up`
2. Check the `DATABASE_URL` in `.env`
3. Test the connection: `npm run test:db`

### Inngest Events Not Processing

1. Make sure Inngest dev server is running: `npm run inngest:dev`
2. Check that `INNGEST_EVENT_KEY` is set
3. Verify the endpoint is configured in Inngest dashboard

### Fly.io Deployment Issues

1. Check logs: `fly logs`
2. Verify environment variables: `fly secrets list`
3. Check app status: `fly status`

## License

MIT
