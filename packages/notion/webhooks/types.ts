import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────────────────────

const NotionUserReferenceSchema = z.object({
	id: z.string(),
	object: z.string(),
	type: z.string().optional(),
	name: z.string().optional(),
	avatar_url: z.string().optional(),
});

export const NotionWebhookPayloadSchema = z.object({
	id: z.string(),
	timestamp: z.string(),
	workspace_id: z.string(),
	subscription_id: z.string(),
	integration_id: z.string(),
	type: z.string(),
	authors: z.array(NotionUserReferenceSchema),
	accessible_by: z.array(NotionUserReferenceSchema),
	entity: z.object({ id: z.string(), object: z.string() }).passthrough(),
	data: z.record(z.unknown()),
});

export const NotionVerificationPayloadSchema = z.object({
	verification_token: z.string(),
});

export const VerificationEventSchema = z.object({
	type: z.literal('url_verification'),
	verification_token: z.string(),
});

export const PageCreatedEventSchema = NotionWebhookPayloadSchema.extend({
	type: z.literal('page.created'),
	data: z
		.object({
			page_id: z.string(),
			database_id: z.string(),
		})
		.passthrough(),
});

export const PageUpdatedEventSchema = NotionWebhookPayloadSchema.extend({
	type: z.literal('page.updated'),
	data: z
		.object({
			page_id: z.string(),
			database_id: z.string(),
		})
		.passthrough(),
});

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface NotionWebhookPayload {
	id: string;
	timestamp: string;
	workspace_id: string;
	subscription_id: string;
	integration_id: string;
	type: string;
	authors: Array<{
		id: string;
		object: string;
		type?: string;
		name?: string;
		avatar_url?: string;
	}>;
	accessible_by: Array<{
		id: string;
		object: string;
		type?: string;
		name?: string;
		avatar_url?: string;
	}>;
	// NOTE: Entity structure varies by event type and object type (page, database, block, etc.).
	// Each entity type has different properties, so we can't strictly type it without
	// creating separate interfaces for each entity type, which would be overly complex.
	entity: {
		id: string;
		object: string;
		[key: string]: unknown;
	};
	// NOTE: Data structure is event-specific and varies significantly between event types.
	// For example, page.added_to_database has page_id and database_id, while other events
	// may have different fields. The structure is documented per event type in Notion's API.
	data: {
		[key: string]: unknown;
	};
}

export type VerificationEvent = {
	type: 'url_verification';
	verification_token: string;
};

export interface PageCreatedEvent extends NotionWebhookPayload {
	type: 'page.created';
	data: {
		page_id: string;
		database_id: string;
		// NOTE: Additional fields may be present depending on Notion API version and event details.
		// Using index signature to allow for future API changes without breaking type safety.
		[key: string]: unknown;
	};
}

export interface PageUpdatedEvent extends NotionWebhookPayload {
	type: 'page.updated';
	data: {
		page_id: string;
		database_id: string;
		// NOTE: Additional fields may be present depending on Notion API version and event details.
		// Using index signature to allow for future API changes without breaking type safety.
		[key: string]: unknown;
	};
}

export type NotionWebhookOutputs = {
	verification: VerificationEvent;
	pageCreated: PageCreatedEvent;
	pageUpdated: PageUpdatedEvent;
};

function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

export function createNotionMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (eventType === 'url_verification') {
			// Asserting as VerificationEvent because parseBody returns unknown and the
			// verification token check is the sole purpose of this matcher path.
			const parsedBody = parseBody(request.body) as VerificationEvent;
			return !!parsedBody.verification_token;
		}
		// Asserting as NotionWebhookPayload because parseBody returns unknown and we
		// only need to read the top-level `type` field for routing purposes here.
		const parsedBody = parseBody(request.body) as NotionWebhookPayload;
		return parsedBody.type === eventType;
	};
}

export function verifyNotionWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-notion-signature'])
		? headers['x-notion-signature'][0]
		: headers['x-notion-signature'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-notion-signature header',
		};
	}

	let bodyString: string;
	try {
		bodyString =
			typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
	} catch (error) {
		return {
			valid: false,
			error: `Failed to parse body: ${error instanceof Error ? error.message : 'unknown error'}`,
		};
	}

	const calculatedSignature = `sha256=${crypto
		.createHmac('sha256', secret)
		.update(bodyString)
		.digest('hex')}`;

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(calculatedSignature),
			Buffer.from(signature),
		);

		return {
			valid: isValid,
			error: isValid ? undefined : 'Invalid signature',
		};
	} catch (error) {
		return {
			valid: false,
			error: `Signature verification failed: ${error instanceof Error ? error.message : 'unknown error'}`,
		};
	}
}
