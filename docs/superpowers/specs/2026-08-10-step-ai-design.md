# step.ai — durable typed inference (v1)

**Goal:** Add `step.ai` to the workflow step suite — one durable, memoized LLM
inference whose structured output is typed to a plugin op's input schema.

**Scope:** SDK executor (`corsair`) + one thin Hub proxy route. Independent of
the unmerged reshape (#631) and workflow-management (#58) PRs — branches off
`origin/main` in both repos. `step.ai` adds no `corsair.*` client-namespace
surface, so there is no overlap with the reshape.

## Execution model (given — not changed)

The whole workflow `main(corsair, payload, step)` runs app-side in the SDK
sandbox: Hub delivers a signed `run` envelope, the app executes and returns
`RunResultPayload`. `step(name, fn)` and `step.sleep` already exist, with
durable memoization keyed by a stable `stepId` and replay-on-retry. `step.ai`
is the only primitive that must reach Hub — the `llm.corsair.dev` key is a
central secret the app must never hold.

## Surface

Each verb is memoized by `name` like `step.run`; a replay returns the stored
output and never re-calls the model.

```ts
interface AiStep {
  object<Op extends OpId, K extends keyof OpInput<Op> = keyof OpInput<Op>>(
    name: string,
    opts: { input: unknown; prompt: string; returnObject: { op: Op; pick?: readonly K[] }; model?: string },
  ): Promise<Pick<OpInput<Op>, K>>;
  text(name: string, opts: { input: unknown; prompt: string; model?: string }): Promise<string>;
  enum<const T extends readonly string[]>(
    name: string,
    opts: { input: unknown; prompt: string; options: T; model?: string },
  ): Promise<T[number]>;
  bool(name: string, opts: { input: unknown; prompt: string; model?: string }): Promise<boolean>;
}
```

- `input` is required and separate from `prompt` — makes "what the model sees"
  impossible to forget (the failure mode in the original hand-written example).
- `enum`/`bool` are `object` with a constrained schema underneath — one host
  code path — but typed to `T[number]`/`boolean` so callers don't unwrap.

## Decision B: `returnObject` = op reference

`returnObject: { op: OpId, pick? }`. The op **string** crosses the sandbox
trivially. The SDK resolves it **host-side** to the plugin's real Zod schema,
converts to JSON Schema for the model's `response_format`, and validates the
response with that same Zod schema. No Zod instance crosses the sandbox.

**Op-id format (verified):** `"<pluginId>.<endpointPath>"`, e.g.
`"linear.issues.create"`. The first segment is the plugin id; the remainder is
the `endpointSchemas` key. `EndpointPathsOf` emits the endpoint path **without**
`.api.` and without the plugin prefix (`"issues.create"`), so the resolver
splits on the first dot:

```ts
const [pluginId, ...rest] = op.split(".");
const key = rest.join(".");                                  // "issues.create"
const plugin = internal.plugins.find((p) => p.id === pluginId);
let schema = plugin?.endpointSchemas?.[key]?.input;          // live ZodTypeAny
if (!schema) throw new Error(`No input schema for op "${op}"`);
if (pick) schema = schema.pick(Object.fromEntries(pick.map((k) => [k, true])));
const jsonSchema = z.toJSONSchema(schema, { target: "draft-7", io: "input" });  // Zod 4.1 native
// … Hub call … then schema.parse(output) for the authoritative validation
```

**Runtime is the floor and is guaranteed** — resolution + validation work with
no sandbox changes (verified against `packages/linear`: `endpointSchemas` holds
live Zod). **Compile-time typing is layered on top** via a generic authoring
type `WorkflowStep<TCorsair>`: `returnObject.op` narrows to `OpId<TCorsair>` and
the return to `Pick<OpInput<TCorsair, Op>, K>`, built over `EndpointPathsOf`.
This is a type-only surface — the runtime `step` is untyped, so the executor is
unaffected. If a caller uses the non-generic `WorkflowStep`, `op` is `string`
and runtime validation still holds. The one op id feeds both `step.ai`'s
`returnObject` and (later) `step.corsair`, so the two compose.

Rejected: injecting `z` + live schemas into the sandbox (fragile Zod-through-
membrane, buys nothing B lacks); loose inline shape (loses typing to the op).

## Boundaries

- **realm ↔ host:** only plain data crosses. `opts` is strings/arrays. The
  result returns as a **JSON string**, parsed in-realm (same trick as
  `payload`), so the workflow never holds a bare host reference.
- **host ↔ Hub:** only the `AiStepRequest` JSON. The Zod schema stays host-side
  as the authoritative validator; the JSON Schema goes to Hub as
  `response_format`.

## Hub route: `POST /workflows/ai`

Project-API-key auth, env+tenant scoped — same middleware as the shipped
management routes. Thin proxy to `llm.corsair.dev` via the **existing** hub LLM
client (`packages/api/src/workflows/heal.ts` / `agent.ts`). Stateless — no DB,
no migration.

```ts
type AiStepRequest = {
  runId: string; workflowId: string; stepName: string;
  kind: "object" | "text" | "enum" | "bool";
  prompt: string; input: unknown;
  responseSchema?: JSONSchema;   // object/enum/bool; omitted for text
  model?: string;                // optional; Hub picks the default
};
type AiStepResponse = { output: unknown; model: string; usage?: { inputTokens: number; outputTokens: number } };
```

## Executor wiring

- `ExecuteWorkflowRunInput` gains `ai(req): Promise<string>` — opaque to the
  executor, exactly like `corsair`.
- `makeStep` gains `step.ai.*`; each verb routes through the existing
  `step(name, fn)`, so memo / replay / failed-step recording are reused whole.
- `tunnel/index.ts` builds `ai` (bound to the hub client + `runId`/`tenant`)
  and passes it into `executeWorkflowRun`, next to `corsair`.
- New file `workflows/ai.ts` holds the host `ai` callback: resolve
  `{op,pick}` → JSON Schema, `hubFetch("/workflows/ai")`, Zod-validate + one
  corrective retry.

Net new surface: one host closure + one input field. No new memo, no new
transport, no change to the `run` envelope (`hub/contracts/tunnel.ts`) — `ai`
is a side call.

## Retry / error / heal

Model output that fails the Zod parse → one corrective retry (validation errors
appended to the prompt, same shape as the existing auto-heal retry). Second
failure → `hostAi` throws → the wrapping `step` records a failed step →
existing heal/error path. Classification: invalid-output-after-retry is a
code/prompt fault → **healable**; gateway/transport failure → **not healable**
(mirrors the delivery-path distinction).

## Out of scope (deferred, stated not silent)

`step.corsair`, event bus (`waitForEvent`/`sendEvent`), `step.agent` (tool-loop),
per-tenant token caps, Hub-side `(runId,stepId)` result persistence (crash-mid-
inference re-call), and connection preconditions (`requirements` op + `requires`
manifest) — the last is a fast-follow that stacks on #631 because it adds a
`workflows.*` namespace method.

## Files

**SDK — `corsair-connect/packages/corsair/`**

| File | Change |
|---|---|
| `workflows/execute.ts` | extend `WorkflowStep` with `.ai.{object,text,enum,bool}`; add `ai` to `ExecuteWorkflowRunInput`; extend sandbox `makeStep` with the four wrappers |
| `workflows/ai.ts` *(new)* | host `ai` callback — op→JSON Schema, hubFetch, Zod-validate + one retry |
| `tunnel/index.ts` | build and pass `ai` into `executeWorkflowRun` |
| `package.json` | version bump at merge |

**Hub — `corsairdev/hub/`**

| File | Change |
|---|---|
| `apps/api/src/server.ts` | `POST /workflows/ai` route, existing project-API-key + env/tenant middleware |
| `packages/api/src/workflows/ai-http.ts` *(new)* | handler → existing LLM client → `llm.corsair.dev` with `response_format`; return `{output, model, usage}` |

## Testing

- **SDK unit** (`executeWorkflowRun` with a stub `ai`, offline): object/text/
  enum/bool happy paths; memo/replay returns stored output with **no** `ai`
  re-call; invalid output → one retry → fail; failed `step.ai` classified
  healable; realm receives parsed (not host) objects.
- **Hub** (`ai-http` handler): auth + env/tenant scoping; `responseSchema`
  forwarded as `response_format`; usage passthrough; gateway error → 5xx mapped
  to a not-healable app-side failure.
