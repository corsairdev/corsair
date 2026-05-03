# Corsair Agent — Architecture

## Overview

`packages/agent` wraps the Corsair integration layer with a persistent async workflow runtime. A developer wires up Corsair plugins and an LLM provider once. From that point forward, any agent using Corsair — whether through Claude.ai + MCP, a custom chat UI, or a CLI — can create durable jobs that survive beyond the conversation, self-heal on failure, and execute across two LLM tiers depending on cost requirements.

The mental model: **the agent sets intelligent alarms for itself.** It goes to sleep, and the runtime wakes it when something meaningful happens.

---

## Current Scope

- **Single-tenant only.** The agent package assumes a single-tenant Corsair instance (`multiTenancy: false`). Agent tables carry no `tenant_id` and the executor makes no tenant-scoping decisions. Multi-tenancy support is out of scope for now.

---

## Core Concepts

**Job** — A stored alarm definition. Contains a trigger (when to fire), an optional filter (whether to fire), and a workflow (what to do). Persisted in `agent_jobs`. Never in the Corsair config file.

**Hook** — A DB-backed event listener that intercepts Corsair's plugin hook dispatch path. Keeps `corsair.ts` completely static. Stored in `agent_hooks`.

**Instance** — One live execution of a job. Created each time a trigger fires and passes its filter. Stores current step, context, and pause state. Lives in `agent_job_instances`.

**Step Execution** — A durable record of a single step's run. Persists both the exact input it received and the exact output it produced. If a step fails, the input is already stored — fix the step definition, re-run it with the same data. Lives in `agent_step_executions`.

**Context** — A variable bag that flows through the workflow. Each step writes its output into context under its `outputVar`. Subsequent steps interpolate from it via `{{variable.path}}` syntax.

---

## Dual LLM Architecture

Two LLMs with distinct roles, modeled on human System 1 / System 2 cognition:

```
System 1 (Haiku)                    System 2 (Sonnet)
─────────────────                   ─────────────────
Always-on gatekeeper                Deep reasoning engine
Woken on every event                Woken only when needed
Binary output: yes / no             Full workflow execution
Runs System 2's pre-written prompt  Writes System 1's filter prompts
~$0.0001 per evaluation             ~$0.015 per execution
```

**System 2 writes System 1's prompts at job creation time.** When a user says "wake me when an important email comes in," System 2 interprets what "important" means given context, writes a precise classification prompt, and stores it with the job. System 1 receives that stored prompt on every incoming email. System 2 never sees unimportant emails.

---

## Three Execution Tiers

Every job falls into one of three tiers, determined by System 2 at job creation time:

**Tier 1 — Fully Deterministic**
No LLM involved at any point. A rule-based predicate on the event payload. Zero marginal cost per trigger.
```
Trigger fires → rule evaluation → pass or drop → execute workflow
```

**Tier 2 — System 1 Gated**
Haiku evaluates every incoming event using a stored prompt. Sonnet only wakes on a "yes."
```
Trigger fires → Haiku(stored_prompt + event) → "yes/no" → Sonnet executes
```

**Tier 3 — System 2 Direct**
No filtering needed. Cron jobs, heartbeats, one-off delays. Sonnet executes on every fire.
```
Trigger fires → Sonnet executes
```

---

## Workflow Step Types

Each step is a self-contained, serializable JSON unit with a defined input shape and output shape.

```typescript
type WorkflowStep =
  | {
      type: 'plugin_call'
      plugin: string                   // 'gmail', 'slack', 'github'
      action: string                   // 'messages.search', 'messages.post'
      params: Record<string, unknown>  // supports {{context.var}} interpolation
      outputVar: string
      next: string
    }
  | {
      type: 'agent_node'
      model: 'system1' | 'system2'
      prompt: string                   // supports {{context.var}} interpolation
      tools: string[]                  // 'web_search', 'calculator', etc.
      outputVar: string
      next: string
    }
  | {
      type: 'wait_for_input'
      channel: string                  // 'slack', 'email', 'internal_timer'
      message: string                  // supports interpolation
      timeout: string                  // '10m', '3d', '1h'
      onTimeout: string                // default value if no response
      outputVar: string
      next: string
    }
  | {
      type: 'branch'
      condition: string                // 'context.answer == "yes"'
      ifTrue: string                   // step id or 'end'
      ifFalse: string
    }
  | {
      type: 'register_trigger'         // mid-workflow: plant a competing wakeup
      plugin: string
      event: string
      correlationKey: string           // 'context.deal.id'
      resumeAtStep: string             // which step to jump to if this fires
    }
  | { type: 'end' }
```

The `register_trigger` step enables competing event scenarios — a workflow can plant a second listener mid-execution and be woken by whichever fires first.

---

## Workflow Lifecycle

```
1. User sends prompt
        ↓
2. System 2 parses intent
   → determines tier (deterministic / S1-gated / direct)
   → constructs workflow step graph
   → if S1-gated: writes Haiku classification prompt
   → saves to agent_jobs + agent_hooks
        ↓
3. Trigger fires (webhook / cron tick / heartbeat tick)
        ↓
4. Filter evaluation
   Tier 1 → evaluate rule predicate
   Tier 2 → Haiku(stored_prompt + event payload) → "yes/no"
   Tier 3 → pass immediately
        ↓
5. Create agent_job_instances row (status: running)
        ↓
6. Step executor loop
   for each step:
     a. resolve params against context ({{variable}} interpolation)
     b. save input to agent_step_executions BEFORE running
     c. execute step
     d. save output to agent_step_executions
     e. merge output into context under outputVar
     f. advance to next step id
        ↓
7. On wait_for_input step:
   → send message via plugin
   → persist correlation_id + timeout_at on instance
   → set instance status: paused
   → return (execution suspends)
        ↓
8. Resume paths (any of):
   a. External event (Slack reply, webhook) matches correlation_id
   b. timeout_at passes → background poller injects onTimeout default
   c. Manual approval via Studio UI
        ↓
9. On resume:
   → inject reply value into context at outputVar
   → set instance status: running
   → continue step executor from current_step_id
        ↓
10. On step failure:
    → save error + stack to agent_job_errors
    → set instance status: failed
    → spawn self-healing agent:
        input: { workflow_definition, failed_step, step_input (from agent_step_executions), error }
        task: propose minimal patch to step definition
    → store proposed patch in agent_job_errors.fix_proposed
    → surface via approval system: "Job X failed at step Y. Approve fix?"
    → on approval: patch agent_jobs.workflow, re-run step with saved input, continue
```

---

## Keeping the Corsair Instance Pristine

The developer's `corsair.ts` never changes after initial setup. All dynamic behavior is stored in the database. Corsair's internal hook dispatch is intercepted at runtime:

```typescript
// Inside plugin hook dispatch — injected by the agent package at startup
async function dispatchHook(path: string, ctx, res) {
  // 1. static hooks from developer's corsair.ts config (unchanged)
  await config.hooks?.[path]?.(ctx, res)

  // 2. dynamic hooks registered by the agent (from agent_hooks table)
  const hooks = await db
    .selectFrom('agent_hooks')
    .where('path', '=', path)
    .where('status', '=', 'active')
    .selectAll()
    .execute()

  for (const hook of hooks) {
    await createAndRunInstance(hook.job_id, { trigger: { ctx, res } })
  }
}
```

Incoming webhooks (Slack replies, GitHub events, HubSpot deal updates) hit Corsair's existing HTTP server. The webhook handler checks `agent_hooks` for dynamic registrations before routing to static config handlers. Paused instance correlation routing also lives here.

---

## Corsair MCP Interface

The agent interacts with Corsair through **introspection only** at job authoring time. It uses two of the existing MCP tools from `packages/mcp` to understand what plugins and operations are available before producing a workflow definition:

- `list_operations` — discover which plugins are configured and what operation paths exist
- `get_schema` — fetch the parameter shape for a specific operation before referencing it in a step

The agent does **not** use `run_script`, `corsair_setup`, or `request_permission` internally. Execution at runtime bypasses MCP entirely — the step executor calls Corsair directly by resolving operation paths on the Corsair instance.

```
Authoring time:  list_operations → get_schema → WorkflowStep[] saved to DB
Execution time:  corsair[plugin][action](params)  — no MCP involved
```

---

## Agent MCP Tools

When `packages/agent` is active, it registers six additional MCP tools alongside the core four. These give any MCP client (Claude.ai, Claude SDK, custom chat UI) full conversational control over jobs and visibility into their execution state.

```
agent_create_job      { prompt }           Create a new job from a natural language description.
                                           System 2 calls list_operations + get_schema internally,
                                           produces a WorkflowStep[], saves to DB, registers hooks.

agent_list_jobs       { status? }          List all registered jobs. Optional filter by status
                                           (active | paused | broken). Returns id, name, trigger
                                           summary, status for each.

agent_get_job         { job_id }           Full job definition: trigger config, WorkflowStep[],
                                           status, and a summary of recent instance history.

agent_update_job      { job_id, prompt }   Mutate an existing job from a natural language follow-up.
                                           System 2 loads the current definition, applies a minimal
                                           patch, and saves the updated workflow back to DB.

agent_delete_job      { job_id }           Deactivate a job and deregister its hooks. Historical
                                           instances and step execution records are preserved.

agent_list_instances  { job_id? }          Read-only observability. Lists running, paused, and
                                           failed instances. Useful for debugging ("why hasn't my
                                           meeting research fired today?"). Optional filter by job.
```

No resume tool. Paused instances resume automatically via the correlation system (incoming Slack reply routes back through the webhook handler) or the timeout poller. Manual resume is not needed in normal operation and can be added later if required.

---

## Database Schema

### Corsair core tables (unchanged)

Corsair's existing tables (`corsair_integrations`, `corsair_accounts`, `corsair_entities`, `corsair_permissions`, `pending_sessions`, etc.) are not modified by the agent package.

### Agent tables (owned by `packages/agent`)

These five tables are **not part of Corsair core**. They are created and migrated by the agent package when `createCorsairAgent()` is called. If a developer uses Corsair without the agent package, none of these tables exist.

Migration runs automatically on `createCorsairAgent()` init against the same database connection provided by the Corsair instance.

```sql
-- alarm definitions
agent_jobs (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT,
  trigger      TEXT NOT NULL,  -- JSON: { type, plugin, event, filter }
  workflow     TEXT NOT NULL,  -- JSON: WorkflowStep[]
  status       TEXT NOT NULL,  -- active | paused | broken
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
)

-- maps plugin/webhook events → jobs (dynamic hook registry)
-- keeps corsair.ts pristine
agent_hooks (
  id           TEXT PRIMARY KEY,
  job_id       TEXT NOT NULL REFERENCES agent_jobs(id),
  path         TEXT NOT NULL,  -- e.g. 'slack.messages.after', 'github.pull_request.opened'
  status       TEXT NOT NULL,  -- active | inactive
  created_at   INTEGER NOT NULL
)

-- one row per job firing
agent_job_instances (
  id               TEXT PRIMARY KEY,
  job_id           TEXT NOT NULL REFERENCES agent_jobs(id),
  status           TEXT NOT NULL,  -- running | paused | completed | failed
  current_step_id  TEXT,
  context          TEXT,           -- JSON: live variable bag as workflow executes
  correlation_id   TEXT,           -- routes external events (Slack reply, webhook) to this instance
  timeout_at       INTEGER,        -- unix ms, set when paused on wait_for_input
  triggered_by     TEXT,           -- JSON: the raw event that started this instance
  started_at       INTEGER NOT NULL,
  completed_at     INTEGER
)

-- durable per-step record — the key to self-healing
agent_step_executions (
  id           TEXT PRIMARY KEY,
  instance_id  TEXT NOT NULL REFERENCES agent_job_instances(id),
  step_id      TEXT NOT NULL,
  status       TEXT NOT NULL,  -- pending | running | completed | failed
  input        TEXT,           -- JSON: exact args this step received (saved before execution)
  output       TEXT,           -- JSON: exact return value
  error        TEXT,           -- JSON: error + stack if failed
  started_at   INTEGER,
  completed_at INTEGER
)

-- failure audit trail and self-healing proposals
agent_job_errors (
  id            TEXT PRIMARY KEY,
  instance_id   TEXT NOT NULL REFERENCES agent_job_instances(id),
  step_id       TEXT NOT NULL,
  error         TEXT NOT NULL,  -- JSON: error message + stack
  fix_proposed  TEXT,           -- JSON: patched step definition from self-healing agent
  fix_status    TEXT,           -- pending_approval | approved | rejected
  occurred_at   INTEGER NOT NULL
)
```

**Why `input` is saved before execution:** If a step fails, `agent_step_executions.input` contains the exact payload that caused the failure. Fix the step definition, call retry with that same row — no need to replay the entire workflow to reproduce and re-run the failing step.

---

## `createCorsairAgent` API

```typescript
import { createCorsairAgent } from '@corsair-dev/agent'

const agent = createCorsairAgent(corsair, {
  system1: {
    apiKey: process.env.CHEAP_API_KEY!,
    model: 'claude-haiku-4-5',       // any AI SDK compatible model string
  },
  system2: {
    apiKey: process.env.EXPENSIVE_API_KEY!,
    model: 'claude-sonnet-4-6',
  },
  // optional: tools available to agent_node steps
  tools: {
    web_search: myWebSearchTool,
  },
})

// conversational interface — creates/modifies jobs or executes directly
const response = await agent.chat("Let me know when Bob emails me")

// streaming variant for chat UIs
const stream = agent.stream("remind me 1 hour before every meeting...")

// start the runtime: runs agent DB migrations, starts webhook routing,
// cron scheduler, heartbeat ticker, and timeout poller
await agent.start()
```

`agent.chat` uses AI SDK's `generateObject` with a Zod schema to produce structured job definitions from natural language. `agent.start()` initializes four background processes in the same Node.js process as the developer's server: the cron/heartbeat schedulers, the timeout poller, and the webhook routing extension on Corsair's existing HTTP server. **It also runs the agent DB migration on startup**, creating the five agent tables if they don't exist — no separate migration step required.

---

## Package Structure

```
packages/agent/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                  ← exports createCorsairAgent
    ├── agent.ts                  ← factory, wires everything together
    ├── types.ts                  ← WorkflowStep, JobDefinition, JobInstance, etc.
    ├── db/
    │   ├── migrate.ts            ← runs agent table migrations on startup
    │   ├── jobs.ts               ← agent_jobs CRUD
    │   ├── instances.ts          ← agent_job_instances CRUD
    │   ├── steps.ts              ← agent_step_executions CRUD
    │   └── hooks.ts              ← agent_hooks CRUD
    ├── executor/
    │   ├── run-instance.ts       ← the step executor loop
    │   ├── run-step.ts           ← handler per step type
    │   └── interpolate.ts        ← {{context.var}} resolution
    ├── scheduler/
    │   ├── cron.ts               ← node-cron based cron job runner
    │   ├── heartbeat.ts          ← setInterval heartbeat runner
    │   └── timeout.ts            ← polls for paused instances past timeout_at
    ├── filter/
    │   └── system1.ts            ← Haiku evaluation (generateText yes/no)
    ├── system2/
    │   ├── create-job.ts         ← prompt → JobDefinition (generateObject + Zod)
    │   ├── mutate-job.ts         ← existing job + prompt → patched definition
    │   ├── self-heal.ts          ← error + step → proposed fix
    │   └── run-agent-node.ts     ← agent_node step execution (generateText + tools)
    ├── mcp/
    │   └── tools.ts              ← agent_create_job, agent_list_jobs, agent_get_job,
    │                                agent_update_job, agent_delete_job, agent_list_instances
    └── chat/
        └── handler.ts            ← intent routing: new job vs mutation vs direct execute
```

---

## The 5 Examples

---

### Example 1 — "Let me know when Bob emails me"

**Tier:** Fully Deterministic

**What System 2 does at creation:**
Recognizes sender-based email filter. No ambiguity, no LLM needed at runtime. Generates a `rule` filter and a two-step workflow.

```json
{
  "trigger": {
    "type": "webhook",
    "plugin": "gmail",
    "event": "email.received",
    "filter": { "type": "rule", "from": "bob" }
  },
  "workflow": [
    {
      "id": "s1", "type": "plugin_call",
      "plugin": "slack", "action": "messages.post",
      "params": {
        "channel": "#notifications",
        "text": "Bob emailed you: {{trigger.event.subject}}"
      },
      "outputVar": "slack_result", "next": "end"
    },
    { "id": "end", "type": "end" }
  ]
}
```

**At runtime:**
```
Gmail webhook fires (new email)
  → rule check: event.from.includes("bob") → true
  → create instance
  → s1: slack.messages.post ({ text: "Bob emailed you: [subject]" })
  → end

Total LLM calls: 0
Total cost per trigger: $0
```

**Mutation — "Also include the first two lines of the email":**
System 2 patches `s1.params.text` to include `{{trigger.event.body_preview}}`. One field updated, job saved.

---

### Example 2 — "Send me a daily digest of my unread emails every morning at 9am"

**Tier:** Direct System 2

**What System 2 does at creation:**
Recognizes cron pattern. No filter needed — every tick fires. Workflow requires an `agent_node` for summarization since output is dynamic prose.

```json
{
  "trigger": { "type": "cron", "schedule": "0 9 * * *" },
  "workflow": [
    {
      "id": "s1", "type": "plugin_call",
      "plugin": "gmail", "action": "messages.list",
      "params": { "query": "is:unread", "maxResults": 50 },
      "outputVar": "emails", "next": "s2"
    },
    {
      "id": "s2", "type": "branch",
      "condition": "context.emails.length == 0",
      "ifTrue": "end", "ifFalse": "s3"
    },
    {
      "id": "s3", "type": "agent_node",
      "model": "system2",
      "prompt": "Summarize these {{context.emails.length}} unread emails into a clean daily digest. Group by sender or topic. Flag anything urgent.\n\nEmails:\n{{context.emails}}",
      "tools": [],
      "outputVar": "digest", "next": "s4"
    },
    {
      "id": "s4", "type": "plugin_call",
      "plugin": "slack", "action": "messages.post",
      "params": { "channel": "#personal", "text": "{{context.digest}}" },
      "outputVar": "_", "next": "end"
    },
    { "id": "end", "type": "end" }
  ]
}
```

**At runtime:**
```
9am cron tick fires
  → create instance
  → s1: gmail.messages.list → { emails: [...50 emails] }
  → s2: branch → emails.length > 0 → s3
  → s3: Sonnet summarizes emails → { digest: "Here's your morning digest..." }
  → s4: slack.messages.post digest
  → end

Total LLM calls: 1 (Sonnet, s3)
```

**Step failure example:** s3 fails because one email has malformed encoding that breaks the prompt. `agent_step_executions` has the exact email list that was passed in. Self-healing agent patches the `prompt` field to add a sanitization instruction. Re-run s3 with the same input. s4 continues normally.

---

### Example 3 — "1 hour before any meeting, ask me on Slack if you should research who I'm meeting with. If yes, do it. If no reply in 10 mins, do it anyway."

**Tier:** Direct System 2 (heartbeat)

**What System 2 does at creation:**
Recognizes time-relative calendar pattern — not a pure cron, needs to dynamically compute "60 minutes before event start." Generates a heartbeat trigger with a calendar lookup condition. Identifies the pause/resume pattern for the Slack confirmation. Identifies web research requires an `agent_node` with `web_search`.

```json
{
  "trigger": {
    "type": "heartbeat",
    "interval": "5m",
    "condition": {
      "plugin": "googlecalendar",
      "action": "events.list",
      "params": { "timeMin": "now+55m", "timeMax": "now+65m" },
      "fireIfResultNonEmpty": true
    }
  },
  "workflow": [
    {
      "id": "s1", "type": "plugin_call",
      "plugin": "googlecalendar", "action": "events.get",
      "params": { "eventId": "{{trigger.event.id}}" },
      "outputVar": "event_details", "next": "s2"
    },
    {
      "id": "s2", "type": "wait_for_input",
      "channel": "slack",
      "message": "Meeting with {{context.event_details.attendee.name}} ({{context.event_details.attendee.company}}) in 1 hour. Should I research them?",
      "timeout": "10m",
      "onTimeout": "yes",
      "outputVar": "should_research", "next": "s3"
    },
    {
      "id": "s3", "type": "branch",
      "condition": "context.should_research == 'no'",
      "ifTrue": "end", "ifFalse": "s4"
    },
    {
      "id": "s4", "type": "agent_node",
      "model": "system2",
      "prompt": "Research {{context.event_details.attendee.name}} at {{context.event_details.attendee.company}} ({{context.event_details.attendee.title}}). Find their professional background, recent work, notable projects, and anything useful to know before a meeting.",
      "tools": ["web_search"],
      "outputVar": "research", "next": "s5"
    },
    {
      "id": "s5", "type": "plugin_call",
      "plugin": "slack", "action": "messages.post",
      "params": {
        "channel": "#personal",
        "text": "Here's what I found on {{context.event_details.attendee.name}}:\n\n{{context.research}}"
      },
      "outputVar": "_", "next": "end"
    },
    { "id": "end", "type": "end" }
  ]
}
```

**At runtime:**
```
Heartbeat fires every 5 mins
  → googlecalendar.events.list({ timeMin: now+55m, timeMax: now+65m })
  → result non-empty → create instance

s1: fetch full event → context.event_details = { attendee: { name: "Sarah Chen", company: "Stripe" } }

s2: slack.post "Meeting with Sarah Chen (Stripe) in 1 hour. Research her?"
  → instance.status = paused
  → instance.correlation_id = slack_msg_id_abc
  → instance.timeout_at = now + 10m
  → execution suspends

─── 4 minutes later ───
User replies "yes" on Slack
  → POST /webhooks/slack fires
  → match thread_id = slack_msg_id_abc → find instance
  → context.should_research = "yes", resume at s3

s3: branch → "yes" → s4
s4: Sonnet + web_search researches Sarah Chen → 3-paragraph summary
s5: slack.post summary → end
```

**Mutation — "Also tell me if I've talked to them in the past 6 months":**
System 2 inserts a new step between s1 and s2:
```json
{
  "id": "s1b", "type": "plugin_call",
  "plugin": "gmail", "action": "messages.search",
  "params": { "from": "{{context.event_details.attendee.email}}", "after": "6 months ago" },
  "outputVar": "past_emails", "next": "s2"
}
```
Patches s1's `next` from `"s2"` to `"s1b"`. Patches s2's message template to include the email count. Job saved. Next heartbeat runs the updated workflow.

---

### Example 4 — "Watch our GitHub repo. Any PR that touches the payments module should get a risk assessment — check the author's history on that module and post a Slack thread with ✅ or ⚠️"

**Tier:** System 1 Gated

**What System 2 does at creation:**
Every PR open event would be wasteful to run through Sonnet. System 2 writes a Haiku filter prompt scoped to payment-related files. Builds a multi-step Sonnet workflow for cases that pass.

```json
{
  "trigger": {
    "type": "webhook",
    "plugin": "github",
    "event": "pull_request.opened",
    "filter": {
      "type": "llm",
      "model": "system1",
      "prompt": "Does this PR touch files in src/payments/, lib/billing/, or contain significant changes to payment processing, checkout, or billing logic? Answer only 'yes' or 'no'.\n\nPR title: {{event.title}}\nFiles changed: {{event.files_changed}}\nDescription: {{event.body}}",
      "passIf": "yes"
    }
  },
  "workflow": [
    {
      "id": "s1", "type": "plugin_call",
      "plugin": "github", "action": "pulls.get",
      "params": { "pull_number": "{{trigger.event.number}}", "includeFiles": true },
      "outputVar": "pr", "next": "s2"
    },
    {
      "id": "s2", "type": "plugin_call",
      "plugin": "github", "action": "commits.listForRepo",
      "params": { "author": "{{trigger.event.author}}", "path": "src/payments" },
      "outputVar": "author_payment_history", "next": "s3"
    },
    {
      "id": "s3", "type": "agent_node",
      "model": "system2",
      "prompt": "Analyze this PR to the payments module.\n\nPR diff:\n{{context.pr.diff}}\n\nAuthor's history on this module ({{context.author_payment_history.total_commits}} commits):\n{{context.author_payment_history.summary}}\n\nProvide: (1) risk level low/medium/high, (2) what specifically changed, (3) any concerns. Be concise.",
      "tools": [],
      "outputVar": "assessment", "next": "s4"
    },
    {
      "id": "s4", "type": "branch",
      "condition": "context.assessment.risk_level == 'low' && context.author_payment_history.total_commits > 5",
      "ifTrue": "s5_ok", "ifFalse": "s5_warn"
    },
    {
      "id": "s5_ok", "type": "plugin_call",
      "plugin": "slack", "action": "messages.post",
      "params": {
        "channel": "#payments-prs",
        "text": "✅ *{{trigger.event.title}}* by {{trigger.event.author}}\n{{context.assessment.summary}}\n{{trigger.event.url}}"
      },
      "outputVar": "_", "next": "end"
    },
    {
      "id": "s5_warn", "type": "plugin_call",
      "plugin": "slack", "action": "messages.post",
      "params": {
        "channel": "#payments-prs",
        "text": "⚠️ *{{trigger.event.title}}* by {{trigger.event.author}}\nRisk: {{context.assessment.risk_level}}\n{{context.assessment.concerns}}\n{{trigger.event.url}}"
      },
      "outputVar": "_", "next": "end"
    },
    { "id": "end", "type": "end" }
  ]
}
```

**At runtime:**
```
50 PRs opened this week:
  → 50x Haiku evaluations (~$0.0001 each) = $0.005 total
  → 8 touch the payments module → "yes"
  → 42 filtered out, no instances created

For each of the 8:
  → s1: fetch full PR diff
  → s2: fetch author's commit history on src/payments/
  → s3: Sonnet risk assessment
  → s4: branch on risk + experience
  → s5_warn or s5_ok: Slack post

8 Sonnet calls vs. 50 without System 1.
```

---

### Example 5 — "Set up deal intelligence in HubSpot: when a lead moves to Proposal Sent, pull their contact info and scan our email history for concerns they've raised. If they haven't opened the proposal in 3 days, draft a personalized follow-up addressing their concerns and send it to me for approval first. If they open it at any point before then, immediately ping me on Slack."

**Tier:** System 1 Gated + competing triggers + multi-source synthesis + human-in-the-loop

This is the hardest class of workflow. It has cross-service data synthesis, a 3-day dormant wait, two competing wakeup events (timeout vs. HubSpot open tracking), human approval on a generated draft, and mid-execution trigger registration.

**What System 2 does at creation:**
Recognizes HubSpot stage change as the primary trigger. Writes a Haiku filter: "did this deal move to Proposal Sent?" Builds a workflow that includes a `register_trigger` step — mid-execution, the instance plants a second listener for the `deal.email_opened` event correlated to this specific deal ID. The instance then goes dormant for 3 days. Whichever fires first (the open event or the timeout) takes the lead.

```json
{
  "trigger": {
    "type": "webhook",
    "plugin": "hubspot",
    "event": "deal.stage_changed",
    "filter": {
      "type": "llm",
      "model": "system1",
      "prompt": "A HubSpot deal stage changed. Did it move TO 'Proposal Sent' (not away from it)? Answer only 'yes' or 'no'.\n\nFrom: {{event.previous_stage}}\nTo: {{event.new_stage}}",
      "passIf": "yes"
    }
  },
  "workflow": [
    {
      "id": "s1", "type": "plugin_call",
      "plugin": "hubspot", "action": "contacts.get",
      "params": { "dealId": "{{trigger.event.deal_id}}" },
      "outputVar": "contact", "next": "s2"
    },
    {
      "id": "s2", "type": "plugin_call",
      "plugin": "gmail", "action": "messages.search",
      "params": { "from": "{{context.contact.email}}", "maxResults": 30, "includeBody": true },
      "outputVar": "email_history", "next": "s3"
    },
    {
      "id": "s3", "type": "agent_node",
      "model": "system1",
      "prompt": "Read this email history with {{context.contact.name}}. Extract any concerns, objections, or open questions they raised. Quote the relevant lines.\n\nEmails:\n{{context.email_history}}",
      "tools": [],
      "outputVar": "objections", "next": "s4"
    },
    {
      "id": "s4", "type": "register_trigger",
      "plugin": "hubspot",
      "event": "deal.email_opened",
      "correlationKey": "{{trigger.event.deal_id}}",
      "resumeAtStep": "s_opened"
    },
    {
      "id": "s5", "type": "wait_for_input",
      "channel": "internal_timer",
      "message": "",
      "timeout": "3d",
      "onTimeout": "check",
      "outputVar": "timer_result", "next": "s6"
    },
    {
      "id": "s6", "type": "plugin_call",
      "plugin": "hubspot", "action": "deals.get",
      "params": { "dealId": "{{trigger.event.deal_id}}" },
      "outputVar": "deal_state", "next": "s7"
    },
    {
      "id": "s7", "type": "branch",
      "condition": "context.deal_state.proposal_opened == true",
      "ifTrue": "s_opened", "ifFalse": "s8"
    },
    {
      "id": "s8", "type": "agent_node",
      "model": "system2",
      "prompt": "Draft a short, personalized follow-up email to {{context.contact.name}} at {{context.contact.company}}. They haven't opened our proposal. Address these specific concerns they raised:\n\n{{context.objections}}\n\nKeep it warm, not pushy. Under 150 words.",
      "tools": [],
      "outputVar": "draft_email", "next": "s9"
    },
    {
      "id": "s9", "type": "wait_for_input",
      "channel": "slack",
      "message": "{{context.contact.name}} hasn't opened the proposal (sent 3 days ago). Here's a draft follow-up:\n\n---\n{{context.draft_email}}\n---\n\nReply 'approve' to send, 'no' to skip, or reply with edits to send those instead.",
      "timeout": "24h",
      "onTimeout": "skip",
      "outputVar": "approval", "next": "s10"
    },
    {
      "id": "s10", "type": "branch",
      "condition": "context.approval == 'skip' || context.approval == 'no'",
      "ifTrue": "end", "ifFalse": "s11"
    },
    {
      "id": "s11", "type": "plugin_call",
      "plugin": "gmail", "action": "messages.send",
      "params": {
        "to": "{{context.contact.email}}",
        "subject": "Re: Our Proposal",
        "body": "{{context.approval == 'approve' ? context.draft_email : context.approval}}"
      },
      "outputVar": "_", "next": "end"
    },
    {
      "id": "s_opened", "type": "plugin_call",
      "plugin": "slack", "action": "messages.post",
      "params": {
        "channel": "#personal",
        "text": "🔥 {{context.contact.name}} just opened your proposal. Good time to reach out. {{context.contact.phone}}"
      },
      "outputVar": "_", "next": "end"
    },
    { "id": "end", "type": "end" }
  ]
}
```

**At runtime:**
```
HubSpot stage_changed webhook fires
  → Haiku: "did it move TO Proposal Sent?" → "yes"
  → create instance, deal_id: deal_789, contact: Marcus Webb at Acme

s1: hubspot.contacts.get → { name: "Marcus Webb", email: "marcus@acme.com" }
s2: gmail.messages.search (from: marcus@acme.com) → 12 emails
s3: Haiku extracts objections
    → "- Worried about migration timeline (email 3)
       - Asked about SOC2 compliance (email 7)
       - Concerned about team onboarding (email 11)"

s4: register_trigger
    → INSERT agent_hooks: { event: 'deal.email_opened', correlation_key: 'deal_789', resume_at: 's_opened' }
    → two wakeup paths now registered for this instance

s5: internal_timer (3 days)
    → instance.status = paused
    → instance.timeout_at = now + 3 days
    → execution suspends

─── scenario A: Marcus opens the proposal on day 2 ───

HubSpot deal.email_opened webhook fires
  → match correlation_key: deal_789 → find paused instance
  → cancel timeout
  → jump to s_opened
  → slack.post "🔥 Marcus Webb just opened your proposal..."
  → end

─── scenario B: 3 days pass, no open ───

timeout_at passes, background poller wakes instance
  → resume at s5, timer_result = "check"
  → s6: hubspot.deals.get → { proposal_opened: false }
  → s7: branch → not opened → s8
  → s8: Sonnet drafts personalized email addressing the 3 objections
  → s9: wait_for_input (Slack approval, 24h timeout)
      → slack.post draft, instance pauses again

─── user replies "looks good, send it" ───

  → resume at s10 → approval != "skip" → s11
  → gmail.messages.send to marcus@acme.com
  → end
```

**What makes this the hardest tier:**
- System 1 used twice: once as trigger filter, once for mid-workflow data extraction (s3 — cheap enough and fast enough for objection mining)
- Instance registers a competing trigger mid-execution (`register_trigger` at s4)
- Two completely separate events can resume the instance, each jumping to a different step
- Two human-in-the-loop pauses: the 3-day dormant wait and the email approval
- Sonnet's draft at s8 is personalized from data synthesized across two services (HubSpot + Gmail) earlier in the same instance's context
- User can reply with edits instead of "approve" — s11 sends the raw reply as the body if it's neither "skip" nor "no"

---

## Summary

| Example | Tier | LLM calls at runtime | Pauses | Competing triggers |
|---|---|---|---|---|
| Bob's email | Deterministic | 0 | 0 | No |
| Daily digest | Direct S2 | 1 (summary) | 0 | No |
| Meeting research | Direct S2 | 1 (research) | 1 (Slack confirm) | No |
| Payments PR | S1 → S2 | 1 S1 filter + 1 S2 assessment | 0 | No |
| Deal intelligence | S1 → S2 | 1 S1 filter + 1 S1 extract + 1 S2 draft | 2 (timer + approval) | Yes |
