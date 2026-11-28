import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { SegmentContext } from '../index';

// Segment forwards a source's events to a URL through the Webhooks
// destination (Connections > Destinations > Webhooks). Each request is one
// event as Segment's spec defines it (type identify, track, page, screen,
// group, alias or delete), sent as JSON with `User-Agent: Segment.io/1.0`.
// When the destination has a Shared Secret, Segment adds `X-Signature`: the
// hex HMAC-SHA1 of the raw body with that secret
// (https://www.twilio.com/docs/segment/connections/destinations/catalog/webhooks).
// The plugin refuses requests without a valid signature, so set the secret.
// There is no timestamp to bound replays: drop repeats by messageId.

export const SegmentWebhookEventSchema = z.enum([
	'identify',
	'track',
	'page',
	'screen',
	'group',
	'alias',
	'delete',
]);
export type SegmentWebhookEventName = z.infer<typeof SegmentWebhookEventSchema>;

/** One Segment event: the spec's common fields stay typed, the rest pass through. */
const EventSchema = z
	.object({
		type: SegmentWebhookEventSchema,
		messageId: z.string().nullish(),
		userId: z.string().nullish(),
		anonymousId: z.string().nullish(),
		timestamp: z.string().nullish(),
		sentAt: z.string().nullish(),
		receivedAt: z.string().nullish(),
		originalTimestamp: z.string().nullish(),
		channel: z.string().nullish(),
		version: z.union([z.number(), z.string()]).nullish(),
		// `unknown` because context, integrations, properties and traits are free-form maps.
		context: z.record(z.string(), z.unknown()).nullish(),
		integrations: z.record(z.string(), z.unknown()).nullish(),
		event: z.string().nullish().describe('The event name (track).'),
		name: z.string().nullish().describe('The page or screen name.'),
		properties: z.record(z.string(), z.unknown()).nullish(),
		traits: z.record(z.string(), z.unknown()).nullish(),
		groupId: z.string().nullish().describe('The group (group).'),
		previousId: z.string().nullish().describe('The earlier id (alias).'),
	})
	.passthrough();

export type SegmentWebhookEvent = z.infer<typeof EventSchema>;

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

// `unknown` because the body is an untrusted string or object until parsed.
function bodyType(body: unknown): string | undefined {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return undefined;
		}
	}
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return undefined;
	}
	const type = (value as Record<string, unknown>).type;
	return typeof type === 'string' ? type : undefined;
}

/** The event a request from Segment's Webhooks destination carries. */
export function segmentEventName(
	request: RawWebhookRequest,
): SegmentWebhookEventName | undefined {
	const fromSegment =
		header(request.headers, 'x-signature') !== undefined ||
		/^segment\.io\//i.test(header(request.headers, 'user-agent') ?? '');
	if (!fromSegment) return undefined;
	const parsed = SegmentWebhookEventSchema.safeParse(bodyType(request.body));
	return parsed.success ? parsed.data : undefined;
}

export function matchSegmentWebhook(request: RawWebhookRequest): boolean {
	return segmentEventName(request) !== undefined;
}

/**
 * Segment's scheme: `X-Signature: <hex>`, the hex being HMAC-SHA1(secret,
 * rawBody). Compared in constant time.
 */
export function verifySegmentSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): boolean {
	const signature = header(request.headers, 'x-signature')?.trim();
	if (!signature || !request.rawBody || !secret.trim()) return false;
	if (!/^[a-f0-9]{40}$/i.test(signature)) return false;
	const expected = createHmac('sha1', secret).update(request.rawBody).digest();
	return timingSafeEqual(Buffer.from(signature, 'hex'), expected);
}

function webhookFor(
	name: SegmentWebhookEventName,
): CorsairWebhook<SegmentContext, SegmentWebhookEvent, SegmentWebhookEvent> {
	return {
		match: (request) => segmentEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				request.hubVerified !== true &&
				!verifySegmentSignature(request, ctx.key)
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
				const event = EventSchema.parse(JSON.parse(request.rawBody));
				if (event.type !== name) throw new Error('Wrong event type');
				return { success: true, data: event };
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

export const segmentWebhooksNested = {
	events: {
		identify: webhookFor('identify'),
		track: webhookFor('track'),
		page: webhookFor('page'),
		screen: webhookFor('screen'),
		group: webhookFor('group'),
		alias: webhookFor('alias'),
		delete: webhookFor('delete'),
	},
} as const;

export const segmentWebhookSchemas = {
	'events.identify': {
		description:
			'A source received an identify call: a user and the traits recorded about them.',
		payload: EventSchema,
		response: EventSchema,
	},
	'events.track': {
		description:
			'A source received a track call: an action a user performed, with its properties.',
		payload: EventSchema,
		response: EventSchema,
	},
	'events.page': {
		description: 'A source received a page call: a user viewed a web page.',
		payload: EventSchema,
		response: EventSchema,
	},
	'events.screen': {
		description:
			'A source received a screen call: a user viewed a screen of a mobile app.',
		payload: EventSchema,
		response: EventSchema,
	},
	'events.group': {
		description:
			'A source received a group call: a user was tied to a group (a company or account).',
		payload: EventSchema,
		response: EventSchema,
	},
	'events.alias': {
		description:
			'A source received an alias call: two ids of one user were merged.',
		payload: EventSchema,
		response: EventSchema,
	},
	'events.delete': {
		description:
			'Segment forwarded a user deletion request (a regulation) to the destination.',
		payload: EventSchema,
		response: EventSchema,
	},
} as const;
