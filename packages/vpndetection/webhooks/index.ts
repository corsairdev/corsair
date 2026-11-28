import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { VpndetectionContext } from '../context';

/**
 * Database delivery events. A webhook destination (console: Database >
 * Delivery) posts `{ type, timestamp, data }`, signed to the Standard
 * Webhooks spec:
 *
 *   webhook-id, webhook-timestamp (Unix seconds),
 *   webhook-signature: "v1,<base64 HMAC-SHA256>" (two during a rotation)
 *
 * over `<webhook-id>.<webhook-timestamp>.<raw body>`, keyed with the secret
 * after its `whsec_` prefix, base64-decoded. Deliveries older than five
 * minutes are refused. https://docs.vpndetection.io/integrations/webhooks
 */
const TOLERANCE_SECONDS = 5 * 60;

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type VpndetectionWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyVpndetectionWebhook(
	// `unknown` payload: the signature covers the raw body, never the parsed one.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): VpndetectionWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No VPNDetection signing secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const id = getHeader(request.headers, 'webhook-id');
	const timestamp = getHeader(request.headers, 'webhook-timestamp');
	const signatures = getHeader(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatures) {
		return { valid: false, error: 'Missing Standard Webhooks headers' };
	}
	const sentAt = Number(timestamp);
	if (
		!Number.isFinite(sentAt) ||
		Math.abs(nowSeconds - sentAt) > TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'Webhook timestamp outside five minutes' };
	}
	const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${request.rawBody}`)
		.digest('base64');
	const matched = signatures.split(' ').some((entry) => {
		const [version, signature] = entry.split(',', 2);
		return version === 'v1' && !!signature && safeEqual(signature, expected);
	});
	return matched
		? { valid: true }
		: { valid: false, error: 'Invalid VPNDetection webhook signature' };
}

const FileSchema = z
	.object({
		format: z.string().optional(),
		size: z.number().optional(),
		sha256: z.string().optional(),
		url: z.string().optional(),
		dataset: z.string().optional(),
		path: z.string().optional(),
		build: z.string().optional(),
	})
	.passthrough();

const DestinationSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		kind: z.string().optional(),
	})
	.passthrough();

function eventSchema<T extends string, D extends z.ZodType>(type: T, data: D) {
	return z
		.object({
			type: z.literal(type),
			timestamp: z.string(),
			data,
		})
		.passthrough();
}

export const DatabaseUpdatedEventSchema = eventSchema(
	'database.updated',
	z
		.object({
			dataset: z.string(),
			name: z.string().optional(),
			build: z.string(),
			published_at: z.string().optional(),
			files: z.array(FileSchema).optional(),
		})
		.passthrough(),
);

export const DatabaseDeliveredEventSchema = eventSchema(
	'database.delivered',
	z
		.object({
			destination: DestinationSchema.optional(),
			build: z.string().optional(),
			files: z.array(FileSchema).optional(),
		})
		.passthrough(),
);

export const DatabaseDeliveryFailedEventSchema = eventSchema(
	'database.delivery_failed',
	z
		.object({
			destination: DestinationSchema.optional(),
			failing_since: z.string().optional(),
			error_code: z.string().optional(),
			error: z.string().optional(),
		})
		.passthrough(),
);

// The test event's data is not documented; it passes through whole.
export const DatabaseTestEventSchema = eventSchema(
	'database.test',
	z.object({}).passthrough().optional(),
);

const EVENTS = {
	databaseUpdated: {
		type: 'database.updated',
		schema: DatabaseUpdatedEventSchema,
		description:
			'A database the destination announces was published with new contents; carries the build and each file with its size, SHA-256 and download URL',
	},
	databaseDelivered: {
		type: 'database.delivered',
		schema: DatabaseDeliveredEventSchema,
		description:
			"New files reached one of the organization's storage destinations",
	},
	databaseDeliveryFailed: {
		type: 'database.delivery_failed',
		schema: DatabaseDeliveryFailedEventSchema,
		description:
			"Deliveries to one of the organization's storage destinations have failed for a day",
	},
	databaseTest: {
		type: 'database.test',
		schema: DatabaseTestEventSchema,
		description:
			'Test connection was clicked for this destination in the console',
	},
} as const;

export type VpndetectionWebhookId = keyof typeof EVENTS;

export type VpndetectionWebhookPayloads = {
	[Id in VpndetectionWebhookId]: z.infer<(typeof EVENTS)[Id]['schema']>;
};

// unknown: a raw body is a string or already-parsed JSON until narrowed.
function eventTypeOf(body: unknown): string | undefined {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return undefined;
		}
	}
	if (value && typeof value === 'object' && 'type' in value) {
		const type = (value as { type: unknown }).type;
		return typeof type === 'string' ? type : undefined;
	}
	return undefined;
}

/** A Standard Webhooks delivery whose type is one of the four database events. */
export function isVpndetectionDelivery(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, 'webhook-signature')) return false;
	const type = eventTypeOf(request.body);
	return Object.values(EVENTS).some((event) => event.type === type);
}

export type VpndetectionWebhook<Id extends VpndetectionWebhookId> =
	CorsairWebhook<
		VpndetectionContext,
		VpndetectionWebhookPayloads[Id],
		VpndetectionWebhookPayloads[Id]
	>;

function vpndetectionWebhook<Id extends VpndetectionWebhookId>(
	id: Id,
): VpndetectionWebhook<Id> {
	const event = EVENTS[id];
	return {
		match: (request) =>
			!!getHeader(request.headers, 'webhook-signature') &&
			eventTypeOf(request.body) === event.type,
		handler: async (ctx, request) => {
			const verification = verifyVpndetectionWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = event.schema.safeParse(request.payload);
			if (!parsed.success) {
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `VPNDetection ${event.type} payload did not match its documented shape (${where})`,
				};
			}
			await logEventFromContext(
				ctx,
				`vpndetection.webhook.${id}`,
				// webhook-id repeats on every retry: use it to skip a duplicate.
				{
					type: event.type,
					deliveryId: getHeader(request.headers, 'webhook-id'),
				},
				'completed',
			);
			return {
				success: true,
				data: parsed.data as VpndetectionWebhookPayloads[Id],
			};
		},
	};
}

export const vpndetectionWebhooksNested = {
	database: {
		updated: vpndetectionWebhook('databaseUpdated'),
		delivered: vpndetectionWebhook('databaseDelivered'),
		deliveryFailed: vpndetectionWebhook('databaseDeliveryFailed'),
		test: vpndetectionWebhook('databaseTest'),
	},
} as const;

function schemaEntry(id: VpndetectionWebhookId) {
	return {
		description: EVENTS[id].description,
		payload: EVENTS[id].schema,
		response: EVENTS[id].schema,
	};
}

export const vpndetectionWebhookSchemas = {
	'database.updated': schemaEntry('databaseUpdated'),
	'database.delivered': schemaEntry('databaseDelivered'),
	'database.deliveryFailed': schemaEntry('databaseDeliveryFailed'),
	'database.test': schemaEntry('databaseTest'),
} as const;
