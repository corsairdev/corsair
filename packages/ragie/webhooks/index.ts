import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { RagieContext } from '..';

/**
 * Ragie posts `{ type, payload, nonce }` to each webhook endpoint
 * (webhookEndpoints.create) and signs it:
 *
 *   X-Signature: <hex HMAC-SHA256 of the raw body, keyed by the endpoint's signing secret>
 *
 * as Ragie's reference receivers verify it (github.com/ragieai/
 * python-webhook-example, ragieai/basechat). `nonce` is unique per delivery:
 * use it to drop a repeat.
 */
function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type RagieWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyRagieWebhook(
	// `unknown` payload: the signature covers the raw body only.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): RagieWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Ragie signing secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const signature = getHeader(request.headers, 'x-signature');
	if (!signature) return { valid: false, error: 'Missing X-Signature header' };
	const expected = createHmac('sha256', secret)
		.update(request.rawBody)
		.digest('hex');
	return safeEqual(signature.trim().toLowerCase(), expected)
		? { valid: true }
		: { valid: false, error: 'Invalid Ragie webhook signature' };
}

const Payload = z.record(z.string(), z.unknown());

function eventSchema<T extends string, P extends z.ZodType>(
	type: T,
	payload: P,
) {
	return z
		.object({ type: z.literal(type), payload, nonce: z.string() })
		.loose();
}

const DocumentPayload = z
	.object({
		document_id: z.string(),
		external_id: z.string().nullish(),
		partition: z.string().nullish(),
		status: z.string().optional(),
		metadata: Payload.optional(),
	})
	.loose();

const ConnectionPayload = z
	.object({
		connection_id: z.string(),
		partition: z.string().nullish(),
		connection_metadata: Payload.optional(),
	})
	.loose();

const EVENTS = {
	documentStatusUpdated: {
		type: 'document_status_updated',
		schema: eventSchema('document_status_updated', DocumentPayload),
		description:
			'A document moved to a new processing status (pending, partitioned, indexed, ready, failed...)',
	},
	documentDeleted: {
		type: 'document_deleted',
		schema: eventSchema('document_deleted', DocumentPayload),
		description: 'A document was deleted',
	},
	entityExtracted: {
		type: 'entity_extracted',
		schema: eventSchema(
			'entity_extracted',
			z
				.object({
					entity_id: z.string().optional(),
					document_id: z.string().optional(),
					instruction_id: z.string().optional(),
					data: Payload.optional(),
				})
				.loose(),
		),
		description: 'An instruction extracted an entity from a document',
	},
	connectionSyncStarted: {
		type: 'connection_sync_started',
		schema: eventSchema('connection_sync_started', ConnectionPayload),
		description: 'A connection began syncing',
	},
	connectionSyncProgress: {
		type: 'connection_sync_progress',
		schema: eventSchema('connection_sync_progress', ConnectionPayload),
		description:
			'A connection sync reports progress (documents created, updated, deleted)',
	},
	connectionSyncFinished: {
		type: 'connection_sync_finished',
		schema: eventSchema('connection_sync_finished', ConnectionPayload),
		description: 'A connection sync finished',
	},
	connectionLimitExceeded: {
		type: 'connection_limit_exceeded',
		schema: eventSchema('connection_limit_exceeded', ConnectionPayload),
		description: 'A connection reached its page limit and stopped syncing',
	},
	partitionLimitExceeded: {
		type: 'partition_limit_exceeded',
		schema: eventSchema(
			'partition_limit_exceeded',
			z.object({ partition: z.string() }).loose(),
		),
		description: 'A partition reached one of its page or media limits',
	},
} as const;

export type RagieWebhookId = keyof typeof EVENTS;

export type RagieWebhookPayloads = {
	[Id in RagieWebhookId]: z.infer<(typeof EVENTS)[Id]['schema']>;
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

/** A signed delivery whose type is one of Ragie's events. */
export function isRagieDelivery(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, 'x-signature')) return false;
	const type = eventTypeOf(request.body);
	return Object.values(EVENTS).some((event) => event.type === type);
}

export type RagieWebhook<Id extends RagieWebhookId> = CorsairWebhook<
	RagieContext,
	RagieWebhookPayloads[Id],
	RagieWebhookPayloads[Id]
>;

function ragieWebhook<Id extends RagieWebhookId>(id: Id): RagieWebhook<Id> {
	const event = EVENTS[id];
	return {
		match: (request) =>
			!!getHeader(request.headers, 'x-signature') &&
			eventTypeOf(request.body) === event.type,
		handler: async (ctx, request) => {
			const verification = verifyRagieWebhook(request, ctx.key);
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
					error: `Ragie ${event.type} payload did not match its shape (${where})`,
				};
			}
			await logEventFromContext(
				ctx,
				`ragie.webhook.${id}`,
				// Type and nonce only: payloads carry document metadata.
				{ type: event.type, nonce: (parsed.data as { nonce: string }).nonce },
				'completed',
			);
			return { success: true, data: parsed.data as RagieWebhookPayloads[Id] };
		},
	};
}

export const ragieWebhooksNested = {
	documents: {
		statusUpdated: ragieWebhook('documentStatusUpdated'),
		deleted: ragieWebhook('documentDeleted'),
	},
	entities: {
		extracted: ragieWebhook('entityExtracted'),
	},
	connections: {
		syncStarted: ragieWebhook('connectionSyncStarted'),
		syncProgress: ragieWebhook('connectionSyncProgress'),
		syncFinished: ragieWebhook('connectionSyncFinished'),
		limitExceeded: ragieWebhook('connectionLimitExceeded'),
	},
	partitions: {
		limitExceeded: ragieWebhook('partitionLimitExceeded'),
	},
} as const;

function schemaEntry(id: RagieWebhookId) {
	return {
		description: EVENTS[id].description,
		payload: EVENTS[id].schema,
		response: EVENTS[id].schema,
	};
}

export const ragieWebhookSchemas = {
	'documents.statusUpdated': schemaEntry('documentStatusUpdated'),
	'documents.deleted': schemaEntry('documentDeleted'),
	'entities.extracted': schemaEntry('entityExtracted'),
	'connections.syncStarted': schemaEntry('connectionSyncStarted'),
	'connections.syncProgress': schemaEntry('connectionSyncProgress'),
	'connections.syncFinished': schemaEntry('connectionSyncFinished'),
	'connections.limitExceeded': schemaEntry('connectionLimitExceeded'),
	'partitions.limitExceeded': schemaEntry('partitionLimitExceeded'),
} as const;
