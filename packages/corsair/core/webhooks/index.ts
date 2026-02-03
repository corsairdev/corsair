import type { CorsairContext } from '../endpoints';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Request & Response Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw incoming webhook data for matching (before full parsing).
 * Used by matcher functions to determine if a webhook should be handled.
 */
export type RawWebhookRequest = {
	/** HTTP headers from the webhook request */
	headers: Record<string, string | string[] | undefined>;
	/** Raw request body (string or already parsed object) */
	body: unknown;
};

/**
 * Raw incoming webhook request data after initial processing.
 * Contains the parsed payload, headers, and optional raw body string.
 * @template TPayload - The type of the parsed webhook payload
 */
export type WebhookRequest<TPayload = unknown> = {
	/** Parsed payload from the webhook request body */
	payload: TPayload;
	/** HTTP headers from the webhook request */
	headers: Record<string, string | string[] | undefined>;
	/** Raw request body string (for signature verification) */
	rawBody?: string;
};

/**
 * Response from a webhook handler that can include acknowledgment data.
 * @template TData - The type of data to return in the response
 */
export type WebhookResponse<TData = unknown> = {
	/** Whether the webhook was processed successfully */
	success: boolean;
	/** The entity relevant to the webhook (note that this is corsair_entities.id) */
	corsairEntityId?: string;
	/** Return the response of the webhook handler to the sender. Defaults to false. Usually only necessary for webhook confirmation / challenge. */
	returnToSender?: boolean;
	/** Optional data to return in the HTTP response */
	data?: TData;
	/** Optional error message if processing failed */
	error?: string;
	/** HTTP status code to return (defaults to 200 on success, 500 on error) */
	statusCode?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Handler Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A webhook matcher function that synchronously determines if a raw webhook
 * request should be handled by this webhook.
 * @param request - The raw webhook request data
 * @returns True if this webhook should handle the request
 */
export type CorsairWebhookMatcher = (request: RawWebhookRequest) => boolean;

/**
 * Bivariance hack for webhook function types to ensure proper type inference.
 * @template Args - The function arguments
 * @template R - The function return type
 */
type Bivariant<Args extends unknown[], R> = {
	bivarianceHack(...args: Args): R;
}['bivarianceHack'];

/**
 * A webhook handler function definition that processes incoming webhooks.
 * Takes context + webhook request, returns a webhook response.
 * @template Ctx - The context type passed to the handler
 * @template TPayload - The type of the webhook payload
 * @template TResponseData - The type of data returned in the response
 */
export type CorsairWebhookHandler<
	Ctx extends CorsairContext = CorsairContext,
	TPayload = unknown,
	TResponseData = unknown,
> = Bivariant<
	[ctx: Ctx, request: WebhookRequest<TPayload>],
	Promise<WebhookResponse<TResponseData>>
>;

/**
 * A complete webhook definition with both matcher and handler.
 * The matcher synchronously determines if this webhook handles the incoming request.
 * The handler processes the webhook after matching.
 * @template Ctx - The context type passed to the handler
 * @template TPayload - The type of the webhook payload
 * @template TResponseData - The type of data returned in the response
 */
export type CorsairWebhook<
	Ctx extends CorsairContext = CorsairContext,
	TPayload = unknown,
	TResponseData = unknown,
> = {
	/** Synchronously determines if this webhook handles the incoming request */
	match: CorsairWebhookMatcher;
	/** Handles the webhook request after matching */
	handler: CorsairWebhookHandler<Ctx, TPayload, TResponseData>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Tree Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A tree of webhooks that can be nested arbitrarily deep.
 * Similar to EndpointTree but for webhook handlers.
 *
 * @example
 * ```ts
 * // Flat structure
 * webhooks: {
 *   issueCreated: { match: (req) => ..., handler: async (ctx, req) => ... },
 *   issueClosed: { match: (req) => ..., handler: async (ctx, req) => ... },
 * }
 *
 * // Nested structure
 * webhooks: {
 *   issues: {
 *     created: { match: (req) => ..., handler: async (ctx, req) => ... },
 *     updated: { match: (req) => ..., handler: async (ctx, req) => ... },
 *   },
 *   pull_requests: {
 *     opened: { match: (req) => ..., handler: async (ctx, req) => ... },
 *   },
 * }
 * ```
 */
export type WebhookTree = {
	[key: string]: CorsairWebhook | WebhookTree;
};

// ─────────────────────────────────────────────────────────────────────────────
// Bound Webhook Types (Context Applied)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A bound webhook - the user-facing API after context is applied.
 * Contains both the matcher (unchanged) and the bound handler.
 * @template TPayload - The type of the webhook payload
 * @template TResponseData - The type of data returned in the response
 */
export type BoundWebhook<TPayload = unknown, TResponseData = unknown> = {
	/** Synchronously determines if this webhook handles the incoming request */
	match: CorsairWebhookMatcher;
	/** Handles the webhook request (context already applied) */
	handler: (
		request: WebhookRequest<TPayload>,
	) => Promise<WebhookResponse<TResponseData>>;
};

/**
 * A tree of bound webhooks (context already applied).
 * This is what the end user interacts with after client initialization.
 */
export type BoundWebhookTree = {
	[key: string]: BoundWebhook<any, any> | BoundWebhookTree;
};

/**
 * Recursively transforms webhook definitions to their bound (context-free) signatures.
 * Handles both flat and nested webhook structures.
 * @template T - The webhook tree to bind
 */
export type BindWebhooks<T extends WebhookTree> = {
	[K in keyof T]: T[K] extends CorsairWebhook<any, infer P, infer R>
		? BoundWebhook<P, R>
		: T[K] extends WebhookTree
			? BindWebhooks<T[K]>
			: never;
};
