# Corsair Agent

A local personal automation assistant that lets you create and manage automations by describing them in plain English. It talks to third-party services (Slack, Linear, Resend) through Corsair, which means the agent never sees your API keys — they're encrypted at rest and injected at runtime.

## What it does

You send a natural-language prompt. The agent:

1. Searches for relevant code examples using semantic search (embeddings)
2. Generates TypeScript code using the Corsair client, learning from examples
3. Runs it through the TypeScript compiler to verify correctness (retrying up to 3 times if it fails)
4. Either runs it immediately (one-off script) or commits it as a persistent workflow

The agent uses an **agentic approach** with tools:
- **Search tool**: Finds relevant code examples from a database of examples
- **Coding tool**: Writes code, typechecks it, and executes it (or returns errors for retry)

**One-off scripts** execute immediately via a `tsx` child process. Output is captured and stored.

**Persistent workflows** are written to `/workflows/{id}.ts`, registered with Inngest, and run forever on their schedule or trigger. On container restart they are rehydrated from Postgres automatically.

## Stack

| Layer | Technology |
|-------|-----------|
| Agent / LLM | Vercel AI SDK — OpenAI (default) or Anthropic |
| Workflow scheduler | Inngest |
| Third-party integrations | Corsair (Slack, Linear, Resend) |
| Database | Postgres — Corsair tables + agent tables |
| Backend | Express on port 3001 |
| UI | Next.js on port 3000 |
| Runtime | Node 22 + tsx (TypeScript without a compile step) |

---

## Prerequisites

- Node 20+ and npm
- Docker + Docker Compose (for the full stack)
- The `corsair` package must be **built** before starting (`dist/` with declaration files must exist):

  ```bash
  cd corsair/packages/corsair
  # Build JS bundles with tsup, then emit .d.ts files
  pnpm tsup
  npx tsc -b tsconfig.build.json --force
  ```

  You can confirm it worked by checking that `dist/index.d.ts` exists.

---

## Environment variables

Create a `.env` file in `agent/` (copy from `.env.example`):

```bash
# LLM — set at least one
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...   ← set this instead to use Claude

# Corsair master key (KEK) — encrypts stored credentials
# Generate: openssl rand -hex 32
CORSAIR_MASTER_KEY=your-32-byte-hex-key

# Postgres (only needed for local dev without Docker)
DATABASE_URL=postgres://postgres:secret@localhost:5432/corsair
```

---

## Running locally (no Docker)

Good for development. You'll need Postgres running separately.

```bash
# 1. Start Postgres (quickest way if you have Docker):
docker run -d --name corsair-pg \
  -e POSTGRES_DB=corsair \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 postgres:16

# 2. Install backend deps
cd agent
npm install

# 3. Install UI deps
cd ui
npm install
cd ..

# 4. Start the Inngest dev server (in a separate terminal)
npx inngest-cli@latest dev -u http://localhost:3001/api/inngest

# 5. Start the backend (runs migrations + rehydrates workflows on boot)
npm run dev          # → http://localhost:3001

# 6. Start the UI (in a separate terminal)
cd ui && npm run dev # → http://localhost:3000
```

The backend starts, runs all migrations, restores any previously written workflows, and begins watching the `workflows/` directory for changes.

---

## Running with Docker Compose

Everything in one command. The build context is the parent directory (`corsair/main/`) so Docker can access the local Corsair package.

```bash
# From the agent/ directory:
cd agent

# Build and start all services
docker compose up --build

# To run in the background:
docker compose up --build -d
```

Services started:
- `postgres` — Postgres 16 on port 5432
- `inngest` — Inngest dev server on port 8288 (UI at http://localhost:8288)
- `worker` — Express backend on 3001 + Next.js UI on 3000

---

## Using the agent

### Sending a prompt (backend API)

```bash
# One-off script — executes immediately
curl -X POST http://localhost:3001/api/prompt \
  -H 'Content-Type: application/json' \
  -d '{"text": "Post a message to #general saying the deploy is done"}'

# Persistent workflow — written to disk and registered with Inngest
curl -X POST http://localhost:3001/api/prompt \
  -H 'Content-Type: application/json' \
  -d '{"text": "Create a Linear issue every day at 9am summarising what is due this week"}'
```

### Managing API keys (UI or curl)

Open http://localhost:3000/keys to add credentials for each integration via the UI.

Or via curl:
```bash
# Set a key
curl -X POST http://localhost:3001/api/keys/slack \
  -H 'Content-Type: application/json' \
  -d '{"value": "xoxb-your-bot-token"}'

curl -X POST http://localhost:3001/api/keys/linear \
  -H 'Content-Type: application/json' \
  -d '{"value": "lin_api_..."}'

curl -X POST http://localhost:3001/api/keys/resend \
  -H 'Content-Type: application/json' \
  -d '{"value": "re_..."}'

# Revoke a key
curl -X DELETE http://localhost:3001/api/keys/slack
```

### UI pages

| URL | Description |
|-----|-------------|
| http://localhost:3000/workflows | Active workflows — pause, resume, delete |
| http://localhost:3000/executions | One-off script run history with stdout/stderr |
| http://localhost:3000/keys | Add / revoke credentials per integration |

---

## Project structure

```
agent/
  src/
    server.ts      # Express server — entry point, runs migrations, hot-reload watcher
    agent.ts       # LLM orchestration via Vercel AI SDK; tsc feedback loop
    executor.ts    # Routes to tsx (scripts) or disk (workflows)
    context.ts     # Assembles Corsair API signatures for the LLM prompt
    startup.ts     # Rehydrates /workflows from Postgres on boot
    corsair.ts     # Corsair instance — Slack, Linear, Resend
    inngest.ts     # Inngest client
    db.ts          # Postgres pool + Kysely + migrations

  ui/              # Next.js app (port 3000)
    app/
      workflows/   # Workflow list + pause/delete actions
      executions/  # Script run history
      keys/        # API key management

  workflows/       # Agent-generated Inngest functions — ephemeral, not git-tracked
                   # Postgres is the source of truth; this directory is rebuilt on boot

  docker-compose.yml
  Dockerfile
```

---

## Database schema

In addition to Corsair's four base tables (`corsair_integrations`, `corsair_accounts`, `corsair_entities`, `corsair_events`), the agent manages:

```sql
-- Code examples with embeddings for semantic search
code_examples (id, vector, description, code, created_at, updated_at)

-- Persistent workflows (code + status stored here)
workflows (id, name, description, code, trigger_type, trigger_config, next_run_at, last_run_at, status, created_at, updated_at)

-- Workflow execution history
workflow_executions (id, workflow_id, status, triggered_by, trigger_payload, logs, result, error, started_at, finished_at)
```

All tables are created automatically on first start. Run `npm run seed:code` to populate code examples.

---

## Code Examples System

The agent uses a database of code examples to learn how to write Corsair code. Examples are stored with embeddings for semantic search.

### Seeding Code Examples

Before using the agent, you need to:

1. **Create the database table** (if not already done):
   ```bash
   npm run db:push
   ```

2. **Seed code examples**:
   ```bash
   # Make sure you have OPENAI_API_KEY set in your .env
   npm run seed:code
   ```

This will:
1. Read code examples from `src/seed/examples.ts`
2. Generate embeddings for each example description using OpenAI
3. Store them in the `code_examples` table

### Adding More Examples

To add more code examples, edit `src/seed/examples.ts`:

```typescript
export const codeExamples: CodeExample[] = [
  {
    description: 'Your natural language description of what the code does',
    code: `async function main() {
  // Your TypeScript code example
  await corsair.slack.api.messages.post({ channel: '#general', text: 'Hello!' });
}
main().catch(console.error);`,
  },
  // Add more examples...
];
```

Then run `npm run seed:code` again to update the database.

### How It Works

1. When you send a prompt, the agent first searches for similar examples using cosine similarity on embeddings
2. The agent uses these examples to understand API patterns
3. The agent then generates code based on the examples and your prompt
4. The code is typechecked and executed (or errors are returned for retry)

---

## Key principles

- **The agent writes business logic only.** Auth, rate limiting, retries, and data sync are Corsair's responsibility.
- **TypeScript is the correctness layer.** The compiler runs on every piece of generated code before it is committed or executed.
- **Postgres is canonical, files are derived.** The `workflows/` directory is rebuilt from the database on every restart.
- **You never handle API keys.** Keys are encrypted with your master key (KEK) and stored in Postgres. The agent receives only the opaque Corsair client.
