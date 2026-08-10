# Event Bus (`waitForEvent` / `sendEvent`) — completing the step suite

**Status:** scoped, not built. Build *after* the step.ai suite ships (E2E → review → PR).

**Goal:** add the fourth workflow shape — **coordinate** — so a run can suspend on an
external event, a human action, or another workflow, and resume with that event's data.
The suite then covers all four shapes: **react** (webhook), **schedule** (cron/sleep),
**transform** (AI), **coordinate** (events).

**Explicit non-goal:** scale. High-volume fan-out, parallel-step throughput, and
windowed aggregation-as-performance are out of scope. This is about *expressive
completeness*, not throughput.

## Decisions (locked)

1. **Unified event stream.** Every inbound plugin webhook we already ingest, plus custom
   `sendEvent` events, plus channel-native human interactions — all normalized to one
   envelope `{ name, data, tenantId }` and run through one matcher.
2. **Filter-object match.** A wait declares `{ event, match: { <path>: <value>, … } }`;
   all path→value equalities are ANDed. Hub evaluates it as plain data against each inbound
   event. No expression DSL, no `eval`.
3. **Out-of-order buffering.** Hub buffers inbound events with a short TTL. On reaching a
   wait, Hub checks the buffer first (already-arrived match → resume now); otherwise it
   registers a waiter.
4. **Timeout → null.** `timeout` is optional (duration string like cadence, e.g. `'8h'`).
   On expiry the wait resolves to `null` and the workflow branches. No timeout = durable-forever.
5. **`sendEvent` + event trigger.** `step.sendEvent(name, data)` emits into the same stream;
   a new trigger type `event` lets a workflow *start* from an internal event (pub/sub,
   workflow-to-workflow).
6. **Human input = channel-native first.** Interactive approval/choice happens via provider
   components (Slack buttons, etc.); the click/reply returns as a webhook event that
   `waitForEvent` matches — free from the unified stream. A Hub-hosted `waitForInput` form
   is deferred (fast-follow).
7. **`cancelOn` deferred** (phase-2b) — an event that cancels matching in-flight runs is a
   distinct feature, not needed for multi-phase completeness.
8. **Rides the `sleep` suspend/resume rails** already shipped.

## Surface

```ts
step.waitForEvent<T>(
  name: string,
  opts: { event: string; match?: Record<string, unknown>; timeout?: string },
): Promise<T | null>;                 // event payload, or null on timeout

step.sendEvent(name: string, data: unknown): Promise<void>;

// trigger: { type: 'event', value: '<event-name>' }
```

Example (two-phase, channel-native human input):

```ts
export const main = async (corsair, payload: WebhookPayload, step) => {
  const refundId = payload.refund.id;
  await step('ask', async () =>
    corsair.slack.api.messages.post({ channel: mgr, text: 'Approve $600 refund?', blocks: [approveRejectButtons] }),
  );
  const decision = await step.waitForEvent('decision', {
    event: 'slack.interaction',
    match: { 'data.callback_id': refundId },
    timeout: '1d',
  });
  if (!decision || decision.data.action !== 'approve') return; // timed out or rejected
  await step('refund', async () => corsair.stripe.api.refunds.create({ id: refundId }));
};
```

## Architecture

The key insight: `waitForEvent` is `sleep` whose wake condition is "a matching event
arrived (or the timeout fired)" instead of a clock. The resume path is identical to
sleep — Hub injects the resolved value as the memoized output for that step's id and
re-delivers the run envelope; the SDK replays past the wait.

### SDK (small — mirrors sleep)

- `WaitInterrupt` mirrors `SleepInterrupt`: unwinds `main` at the wait boundary.
- `executeWorkflowRun` returns `{ status: 'waiting', steps, waiter: { stepId, event, match, timeoutAt } }`
  — analogous to `{ status: 'sleeping', sleepUntil }`.
- On resume, Hub supplies `memoizedSteps[stepId].output` = the matched event (or `null` on
  timeout); replay proceeds past the wait. Reuses `memoizedSteps` verbatim.
- `sendEvent` is a memoized step that POSTs `{ name, data }` to Hub.
- `step.waitForEvent` / `step.sendEvent` added to the in-realm `makeStep` and the
  `WorkflowStep` type (both pure in-realm sugar, like `sleepUntil`).

### Hub (the real build)

- **`waiters` store:** `(runId, stepId, tenantId, event, matchJson, timeoutAt, status)`.
- **`events` buffer:** `(tenantId, name, dataJson, receivedAt)` with TTL (default 24h).
- **Ingestion:** existing webhook dispatch + a new `POST /events` (for `sendEvent`) →
  normalize to `{ name, data, tenantId }` → (a) write to buffer, (b) match open waiters
  (name equality + every `match` path→value deep-equals) → resume each matching run
  (re-deliver the run envelope with the event injected as the step output).
- **Wait registration:** when a run returns `status: 'waiting'`, persist the waiter and
  check the buffer for an already-arrived match → resume immediately if found.
- **Timeout sweeper:** waiters past `timeoutAt` with no match → resume the run with `null`
  for that step. Reuses the sleep scheduler's due-run mechanism.
- **Event trigger:** a workflow with trigger `{ type: 'event', value }` starts a new run
  when a matching event arrives (dispatched like a webhook trigger).
- **Run status:** `waiting` (alongside `sleeping`).

### Authoring (prompt / validation)

Same three places as step.ai:
- `prompt.ts` — teach `step.waitForEvent` / `step.sendEvent`, the filter-match + timeout
  pattern, and the `event` trigger.
- `dry-run.ts` stub — `waitForEvent` returns `null` (a save-time dry-run can't simulate a
  future event), `sendEvent` is a no-op. Without this, valid two-phase code TypeErrors at save.
- `heal.ts` — teach the primitives so healing preserves waits.
- `validate-paths.ts` — unaffected: event names are string args, not `corsair.<plugin>.api`
  paths, so the static op-path validator neither needs nor loses anything.

## Matching semantics

- **Event name:** exact equality. For webhooks the name is `'<plugin>.<event>'` — the same
  id used as a webhook trigger value.
- **`match`:** each key is a dot-path into the normalized event (`{ name, data }`); the value
  must deep-equal. All keys ANDed. A missing path is a non-match.
- **Resolution:** the first open waiter for a run's step resolves it; duplicate matching
  events after resolution are ignored (idempotent).
- **Multiple runs waiting on one event:** all matching waiters resume (fan-out is fine at
  completeness scale).

## Edge cases

- **Long waits (weeks):** the waiter persists; zero resource hold; resume is event/timer-driven;
  survives deploys.
- **Out-of-order (either arrival order):** the buffer + buffer-check-on-registration handles it.
- **Loops of waits (conversational):** each `waitForEvent` gets a stable `stepId` (name+seq)
  like any step; conversation state is rebuilt from memoized wait outputs on replay.

## Deferred (non-blocking)

- **`waitForInput`** — Hub-hosted form/token for generic human input without a channel.
- **`cancelOn`** — an event that cancels matching in-flight runs.
- **Aggregation / windowing** — "N events within a window, act once" is a *separate*
  primitive, not the single-run wait.

## Test plan (when built)

- **SDK:** `WaitInterrupt` unwind → `waiting` payload; resume via `memoizedSteps` replays
  past the wait with event/null; `sendEvent` memoized.
- **Hub:** waiter persist; match eval (single/multi-field + miss); buffer hit on late
  registration; timeout sweeper → `null` resume; event-trigger dispatch; idempotent duplicate.
- **E2E:** author (via chat) a two-phase workflow (webhook → `waitForEvent` → write),
  trigger phase 1, emit the awaited event, assert resume + completion.
