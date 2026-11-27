import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { ZepContext } from '../index';

// Zep sends webhooks through Svix (https://help.getzep.com/v4/webhooks): a
// POST with `svix-id`, `svix-timestamp` and `svix-signature` headers, signed
// with the endpoint's `whsec_...` secret from the Zep dashboard. Payload
// fields below are the ones the webhooks page documents; unknown fields pass.

const base = {
	account_uuid: z.string().optional().describe('Your Zep account identifier.'),
	project_uuid: z
		.string()
		.optional()
		.describe('The project where the event occurred.'),
};

export const EpisodeProcessedSchema = z
	.object({
		event_name: z.literal('episode.processed'),
		...base,
		episode_uuid: z
			.string()
			.optional()
			.describe('The episode that finished processing.'),
		source: z
			.string()
			.optional()
			.describe('The source of the episode: text, json or message.'),
		completed_at: z
			.string()
			.optional()
			.describe('RFC 3339 time processing completed.'),
		graph_type: z
			.string()
			.optional()
			.describe('user or graph: whose graph the episode went into.'),
		graph_uuid: z.string().optional().describe('The graph the episode is in.'),
		user_uuid: z
			.string()
			.optional()
			.describe('The user, when graph_type is user.'),
		graph_id: z
			.string()
			.optional()
			.describe('The legacy v3 graph name, only for graphs that have one.'),
		user_id: z
			.string()
			.optional()
			.describe('The legacy v3 user name, only for users that have one.'),
	})
	.passthrough();
export type EpisodeProcessed = z.infer<typeof EpisodeProcessedSchema>;

export const BatchCompletedSchema = z
	.object({
		event_name: z.literal('ingest.batch.completed'),
		...base,
		batch_id: z
			.string()
			.optional()
			.describe('The uuid of the batch (as batches.create returns it).'),
		completed_at: z
			.string()
			.optional()
			.describe('RFC 3339 time the batch finished.'),
	})
	.passthrough();
export type BatchCompleted = z.infer<typeof BatchCompletedSchema>;

export const ByomRequestFailedSchema = z
	.object({
		event_name: z.literal('byom.request_failed'),
		...base,
		provider: z
			.string()
			.optional()
			.describe('The LLM provider (openai, anthropic, ...).'),
		model: z.string().optional().describe('The model name.'),
		count: z
			.number()
			.optional()
			.describe('Failures in the aggregation window.'),
		first_occurrence: z.string().optional(),
		last_occurrence: z.string().optional(),
		window_seconds: z
			.number()
			.optional()
			.describe('Length of the aggregation window (60 s or more).'),
		error_code: z
			.string()
			.optional()
			.describe(
				'BYOM_CREDENTIALS_INVALID, BYOM_CREDENTIALS_EXPIRED, BYOM_PROVIDER_UNAVAILABLE or BYOM_MODEL_NOT_SUPPORTED.',
			),
	})
	.passthrough();
export type ByomRequestFailed = z.infer<typeof ByomRequestFailedSchema>;

const EVENTS = {
	'episode.processed': EpisodeProcessedSchema,
	'ingest.batch.completed': BatchCompletedSchema,
	'byom.request_failed': ByomRequestFailedSchema,
} as const;
type EventName = keyof typeof EVENTS;

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

// `unknown` because the body is untrusted until a schema parses it.
function bodyOf(request: RawWebhookRequest): unknown {
	if (typeof request.body !== 'string') return request.body;
	try {
		return JSON.parse(request.body);
	} catch {
		return undefined;
	}
}

/** The event a Svix-signed request carries, when it is one Zep sends. */
export function zepEventName(
	request: RawWebhookRequest,
): EventName | undefined {
	if (!header(request.headers, 'svix-signature')) return undefined;
	const body = bodyOf(request);
	const name =
		typeof body === 'object' && body !== null && 'event_name' in body
			? (body as { event_name?: unknown }).event_name
			: undefined;
	return typeof name === 'string' && name in EVENTS
		? (name as EventName)
		: undefined;
}

export function matchZepWebhook(request: RawWebhookRequest): boolean {
	return zepEventName(request) !== undefined;
}

/**
 * Svix's scheme: HMAC-SHA256 of `${svix-id}.${svix-timestamp}.${raw body}`
 * with the base64 key after `whsec_`, compared with every `v1,<base64>` entry
 * of `svix-signature`. Timestamps more than five minutes off are refused.
 */
export function verifyZepSignature(
	request: WebhookRequest<unknown>,
	secret: string,
	now: number = Date.now(),
): boolean {
	const id = header(request.headers, 'svix-id');
	const timestamp = header(request.headers, 'svix-timestamp');
	const signatures = header(request.headers, 'svix-signature');
	if (!id || !timestamp || !signatures || !request.rawBody) return false;
	if (!secret.startsWith('whsec_')) return false;
	if (!/^\d+$/.test(timestamp)) return false;
	if (Math.abs(now - Number(timestamp) * 1000) > 300_000) return false;
	const encoded = secret.slice(6);
	if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return false;
	const key = Buffer.from(encoded, 'base64');
	if (key.length === 0) return false;
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${request.rawBody}`)
		.digest();
	return signatures.split(/\s+/).some((entry) => {
		const [version, signature] = entry.split(',');
		if (version !== 'v1' || !signature) return false;
		const candidate = Buffer.from(signature, 'base64');
		return (
			candidate.length === expected.length &&
			timingSafeEqual(candidate, expected)
		);
	});
}

function webhookFor<Name extends EventName>(
	name: Name,
): CorsairWebhook<
	ZepContext,
	z.infer<(typeof EVENTS)[Name]>,
	z.infer<(typeof EVENTS)[Name]>
> {
	const schema = EVENTS[name];
	return {
		match: (request) => zepEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				request.hubVerified !== true &&
				!verifyZepSignature(request, ctx.key)
			) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid webhook signature',
				};
			}
			// Parse the verified bytes, not a separately parsed payload.
			try {
				if (!request.rawBody) throw new Error('Missing raw body');
				return {
					success: true,
					data: schema.parse(JSON.parse(request.rawBody)) as z.infer<
						(typeof EVENTS)[Name]
					>,
				};
			} catch {
				return {
					success: false,
					statusCode: 400,
					error: 'Invalid webhook payload',
				};
			}
		},
	};
}

export const zepWebhooksNested = {
	episodes: { processed: webhookFor('episode.processed') },
	batches: { completed: webhookFor('ingest.batch.completed') },
	byom: { requestFailed: webhookFor('byom.request_failed') },
} as const;

export const zepWebhookSchemas = {
	'episodes.processed': {
		description:
			'An episode finished processing and was added to a graph (episode.processed).',
		payload: EpisodeProcessedSchema,
		response: EpisodeProcessedSchema,
	},
	'batches.completed': {
		description:
			'A Batch API batch finished as succeeded, canceled, or partial from canceled items (ingest.batch.completed).',
		payload: BatchCompletedSchema,
		response: BatchCompletedSchema,
	},
	'byom.requestFailed': {
		description:
			'Bring-your-own-LLM requests failed in the last window (byom.request_failed, aggregated per 60 s or more).',
		payload: ByomRequestFailedSchema,
		response: ByomRequestFailedSchema,
	},
} as const;
