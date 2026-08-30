/**
 * Shared wire-format types for hub ↔ app delivery (browser and server transports).
 */

/**
 * Discriminator for server POST envelope bodies (`{ type, payload }`).
 *
 * Each value maps to a handler in the app's tunnel/delivery endpoint.
 */
export type TunnelType =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'webhook'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'integration.credentials'
	| 'connect.create_link'
	| 'connections.sync'
	| 'run'
	| 'probe';

/** Inbound tunnel types the app accepts (write-only — no credential reads). */
export const INBOUND_TUNNEL_TYPES = new Set<TunnelType>([
	'oauth.callback',
	'oauth.tokens',
	'webhook',
	'permission.approve',
	'permission.deny',
	'auth.credentials',
	'integration.credentials',
	'connect.create_link',
	'connections.sync',
	// Workflow execution. Only handled when the app opts in via
	// processCorsair({ allowWorkflowExecution: true }); off by default.
	'run',
	// Read-only probe (authoring dry-run / id grounding). Same opt-in gate as
	// `run`; the app runs it under runReadonly so it can never write.
	'probe',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Workflow run contract (`type: 'run'`)
//
// Hub orchestrates workflows but cannot run credentialed operations itself, so it
// delivers a signed `run` envelope to the app's /api/corsair. The app executes the
// workflow code (which touches the tenant's Corsair client) and returns the result.
//
// Durable replay: `memoizedSteps` carries the outputs of steps that already
// completed on a previous attempt. The app replays those without re-executing and
// only runs the failed step + everything after it.
// ─────────────────────────────────────────────────────────────────────────────

export type RunTriggerType = 'cron' | 'cadence' | 'webhook' | 'manual';

/** Hub → app: a single workflow execution attempt. */
export type RunTunnelPayload = {
	runId: string;
	workflowId: string;
	versionId: string;
	tenantId: string;
	/**
	 * Executable CommonJS module source. Hub transpiles the stored TypeScript
	 * workflow version to CJS before delivery; it MUST assign `module.exports.main`
	 * to `(corsair, payload, step) => Promise<void>`. Kept as JS so the app (the
	 * `corsair` package) needs no transpiler dependency.
	 */
	code: string;
	/** What fired the run; `payload` is the webhook body (or null for schedule/manual). */
	trigger: { type: RunTriggerType; payload: unknown };
	/** Completed steps from prior attempts, keyed by step id (memoization store). */
	memoizedSteps?: Record<string, { output: unknown }>;
	/** Replay attempt counter (0 on first execution). */
	attempt?: number;
};

/** One step's outcome within an execution (only steps that actually ran this attempt). */
export type RunStepResult = {
	/**
	 * Stable, unique id for this step call — the memoization key and the log
	 * correlation id. Derived from name + position, so loops / reused names don't
	 * collide and a changed step at a position gets a new id (no stale replay).
	 */
	stepId: string;
	/** Human-readable step name (may repeat across a run; use stepId for identity). */
	name: string;
	/** Execution order across all step() calls in this run (stable across attempts). */
	seq: number;
	status: 'completed' | 'failed';
	output?: unknown;
	error?: string;
};

/**
 * App → Hub: outcome of one execution attempt (returned in the tunnel ack body).
 *
 * `sleeping` is a durable pause: the workflow called `step.sleep(...)`, so the app
 * unwound `main` and reported progress so far. Hub reschedules the run for
 * `sleepUntil`; on the next attempt the sleep step is memoized (satisfied) and
 * execution continues past it. This is what makes long, multi-day workflows
 * survive process restarts.
 */
export type RunResultPayload = {
	status: 'completed' | 'failed' | 'sleeping';
	steps: RunStepResult[];
	error?: { message: string; failedStep?: string };
	/** ISO timestamp when a `sleeping` run should be re-invoked. */
	sleepUntil?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Read-only probe contract (`type: 'probe'`)
//
// Hub's authoring agent asks the app to run a short read-only script against the
// tenant's client — to ground on real ids/fields or dry-run generated code before
// saving it. The app runs it under `runReadonly`, so any write/destructive call
// throws and the probe can never change anything.
// ─────────────────────────────────────────────────────────────────────────────

/** Hub → app: one read-only script to run against the tenant's client. */
export type ProbeTunnelPayload = {
	tenantId: string;
	/** Async JS body with `corsair` in scope; `return` the value to hand back. */
	code: string;
	/** Max run time in ms, clamped app-side to (0, 10_000]; omitted, non-positive,
	 * or non-finite falls back to the 10s default. */
	timeoutMs?: number;
};

/** App → Hub: the script's value, or an error (including a blocked write). */
export type ProbeResultPayload =
	| { status: 'ok'; value: unknown }
	| { status: 'error'; error: string };

/**
 * JSON body of a server-side delivery POST from the hub.
 *
 * @typeParam TPayload - Shape of `payload` for a given {@link TunnelType}.
 */
export type TunnelEnvelope<TPayload = unknown> = {
	/** Handler discriminator; must match a supported tunnel type. */
	type: TunnelType;
	/** Type-specific data (OAuth code, credentials, permission token, etc.). */
	payload: TPayload;
};

/**
 * Discriminator inside a browser delivery token (`?d=`).
 *
 * Subset of {@link TunnelType} — values delivered via browser redirect rather than POST.
 */
export type BrowserDeliveryMode =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'connections.sync'
	| 'connect.create_link';

/**
 * Decoded payload inside a browser delivery token (`?d=` query param).
 *
 * Signed by the hub with {@link signBrowserDeliveryToken}; verified by the app with
 * {@link verifyBrowserDeliveryToken}. After applying the payload, the app redirects the
 * user to `hubSuccessUrl`.
 */
export type BrowserDeliveryPayload = {
	/** Unique id for this delivery attempt; used for replay protection. */
	jti: string;
	/** Session or OAuth row id tying this delivery back to hub DB state. */
	connectJti: string;
	/** Corsair project id (`proj_*`). */
	projectId: string;
	/** Plugin this delivery applies to. */
	plugin: string;
	/** Tenant receiving credentials or status. */
	tenantId: string;
	/** URL to redirect the user after the app applies this delivery. */
	hubSuccessUrl: string;
	/** Unix expiry (seconds); browser tokens have a short TTL (~60s). */
	exp: number;
	/** Unix issued-at (seconds). */
	iat: number;
	/** Which kind of payload is included; determines which optional fields are set. */
	deliveryMode?: BrowserDeliveryMode;
	/** BYO OAuth authorization code (`deliveryMode: oauth.callback`). */
	code?: string;
	/** OAuth state echoed from the provider (`deliveryMode: oauth.callback`). */
	state?: string;
	/** OAuth redirect URI used in the authorization request. */
	redirectUri?: string;
	/** Managed OAuth access token (`deliveryMode: oauth.tokens`). */
	accessToken?: string;
	/** Managed OAuth refresh token. */
	refreshToken?: string;
	/** Managed OAuth access token lifetime in seconds. */
	expiresIn?: number;
	/** OAuth scopes granted. */
	scope?: string;
	/** Auth type the delivered tokens belong to — `managed` (default) or `oauth_2` (BYO). */
	authType?: 'managed' | 'oauth_2';
	/** Provider token-body identity (team, workspace_id, …) for the SDK resolver. */
	providerData?: Record<string, unknown>;
	/** SDK permission token to approve or deny (`deliveryMode: permission.*`). */
	permissionToken?: string;
	/** Hub page origin for iframe postMessage replies (legacy client bridge). */
	hubOrigin?: string;
	/** Optional correlation id for debugging. */
	requestId?: string;
	/** API key / bot token fields (`deliveryMode: auth.credentials`). */
	credentials?: Record<string, string>;
	/** Plugin ids for connect link creation (`deliveryMode: connect.create_link`). */
	connectLinkPlugins?: string[];
};

/** Max age of a browser delivery token (60 seconds). */
export const BROWSER_DELIVERY_TTL_MS = 60 * 1000;

/** Max age of a server delivery request timestamp (5 minutes). */
export const SIGNED_TUNNEL_REPLAY_WINDOW_MS = 5 * 60 * 1000;
