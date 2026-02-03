# Deployment Guide

This guide walks you through deploying your Corsair app to Fly.io and connecting it with Inngest.

## Prerequisites

- Fly.io account (https://fly.io)
- Inngest account (https://inngest.com)
- Fly.io CLI installed locally

## Step-by-Step Deployment

### 1. Install Fly.io CLI

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. Login to Fly.io

```bash
fly auth login
```

### 3. Launch Your App

From your project directory:

```bash
fly launch
```

When prompted:
- **App name**: Choose a unique name (e.g., `my-corsair-app`)
- **Region**: Choose the region closest to you
- **Postgres database**: Say **NO** (we'll create one separately)
- **Redis**: Say **NO**
- **Deploy now**: Say **NO** (we need to set up the database first)

### 4. Create PostgreSQL Database

```bash
fly postgres create
```

When prompted:
- **App name**: Choose a name (e.g., `my-corsair-db`)
- **Region**: Same region as your app
- **Configuration**: Development (or Production for real apps)

Save the connection details shown!

### 5. Attach Database to Your App

```bash
fly postgres attach <postgres-app-name> -a <your-app-name>
```

This automatically sets the `DATABASE_URL` secret.

### 6. Set Environment Variables

```bash
# Corsair encryption key (generate with: openssl rand -base64 32)
fly secrets set CORSAIR_KEK="$(openssl rand -base64 32)" -a <your-app-name>

# Integration credentials
fly secrets set SLACK_BOT_TOKEN="xoxb-..." -a <your-app-name>
fly secrets set RESEND_API_KEY="re_..." -a <your-app-name>
fly secrets set LINEAR_API_KEY="lin_oauth_..." -a <your-app-name>

# Optional configurations
fly secrets set SLACK_LINEAR_CHANNEL_ID="C..." -a <your-app-name>
fly secrets set LINEAR_TEAM_ID="..." -a <your-app-name>
```

### 7. Deploy Your App

```bash
fly deploy
```

### 8. Push Database Schema

After deployment, connect to your database and push the schema:

```bash
# Option 1: Using fly proxy
fly proxy 5432 -a <postgres-app-name>
# In another terminal:
npm run db:push

# Option 2: SSH into the app and run migrations
fly ssh console -a <your-app-name>
# Then manually create tables or run a migration script
```

### 9. Verify Deployment

```bash
# Check app status
fly status -a <your-app-name>

# View logs
fly logs -a <your-app-name>

# Test health endpoint
curl https://<your-app-name>.fly.dev/api/health
```

## Inngest Setup

### 1. Create Inngest Account

Go to https://inngest.com and create a free account.

### 2. Create New App in Inngest

1. In the Inngest dashboard, create a new app
2. Name it something like "Corsair Fly Demo"

### 3. Get Your Event Key

1. Go to your app settings
2. Copy the **Event Key**
3. Set it in Fly.io:

```bash
fly secrets set INNGEST_EVENT_KEY="your-event-key-here" -a <your-app-name>
```

### 4. Configure Inngest Endpoint

1. In Inngest dashboard, go to **Apps** → **Your App** → **Serve**
2. Click **Add Endpoint**
3. Enter your Fly.io app URL:
   ```
   https://<your-app-name>.fly.dev/api/inngest
   ```
4. Click **Add Endpoint**
5. Inngest will verify the endpoint and start sending events to it

### 5. Get Signing Key (Production)

For production deployments:

1. In Inngest dashboard, go to **Signing Keys**
2. Copy the signing key
3. Set it in Fly.io:

```bash
fly secrets set INNGEST_SIGNING_KEY="your-signing-key" -a <your-app-name>
```

### 6. Test Inngest Integration

Trigger a test event:

```bash
# From your local machine, set the production URL
export INNGEST_EVENT_KEY="your-event-key"

# Run the trigger script
npm run trigger:inngest
```

Check the Inngest dashboard to see if the event was received.

## Monitoring and Debugging

### View Application Logs

```bash
fly logs -a <your-app-name>
```

### Check Application Status

```bash
fly status -a <your-app-name>
```

### SSH into Application

```bash
fly ssh console -a <your-app-name>
```

### View PostgreSQL Logs

```bash
fly logs -a <postgres-app-name>
```

### Connect to PostgreSQL

```bash
fly postgres connect -a <postgres-app-name>
```

## Scaling

### Scale Compute Resources

```bash
# Add more memory
fly scale memory 512 -a <your-app-name>

# Add more VMs
fly scale count 2 -a <your-app-name>
```

### Scale Database

```bash
fly postgres update --vm-size shared-cpu-2x -a <postgres-app-name>
```

## Custom Domains

### Add Custom Domain

```bash
fly certs add <your-domain.com> -a <your-app-name>
```

Then add the DNS records shown by Fly.io to your domain provider.

## Troubleshooting

### App Won't Start

1. Check logs: `fly logs -a <your-app-name>`
2. Verify environment variables: `fly secrets list -a <your-app-name>`
3. Check app status: `fly status -a <your-app-name>`

### Database Connection Issues

1. Verify DATABASE_URL is set: `fly secrets list -a <your-app-name>`
2. Check database is running: `fly status -a <postgres-app-name>`
3. Test connection: `fly postgres connect -a <postgres-app-name>`

### Inngest Events Not Processing

1. Verify INNGEST_EVENT_KEY is set
2. Check endpoint is configured in Inngest dashboard
3. Test health endpoint: `curl https://<your-app-name>.fly.dev/api/health`
4. Check Inngest endpoint: `curl https://<your-app-name>.fly.dev/api/inngest`
5. View app logs for errors

### Build Failures

1. Check Dockerfile syntax
2. Ensure all dependencies are in package.json
3. Try building locally: `docker build -t test .`
4. Check fly.toml configuration

## Costs

### Fly.io Free Tier Includes:
- Up to 3 shared-cpu-1x VMs with 256MB RAM each
- 3GB persistent volume storage
- 160GB outbound data transfer

### Inngest Free Tier Includes:
- 50,000 function runs per month
- 25 concurrency
- 14-day log retention

For production apps, expect to pay:
- Fly.io: ~$5-20/month depending on resources
- Inngest: ~$20+/month for higher volumes

## Next Steps

1. Set up CI/CD with GitHub Actions
2. Configure monitoring and alerting
3. Set up backups for PostgreSQL
4. Add more Inngest functions
5. Implement authentication
6. Add observability (Sentry, LogRocket, etc.)

## Useful Commands

```bash
# List all apps
fly apps list

# List all databases
fly postgres list

# View app info
fly info -a <your-app-name>

# SSH into app
fly ssh console -a <your-app-name>

# View secrets
fly secrets list -a <your-app-name>

# Remove a secret
fly secrets unset SECRET_NAME -a <your-app-name>

# Restart app
fly apps restart <your-app-name>

# Destroy app (careful!)
fly apps destroy <your-app-name>
```
