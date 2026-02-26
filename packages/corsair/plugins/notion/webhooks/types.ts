import crypto from 'crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

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

export interface PageAddedToDatabaseEvent extends NotionWebhookPayload {
	type: 'page.added_to_database';
	data: {
		page_id: string;
		database_id: string;
		// NOTE: Additional fields may be present depending on Notion API version and event details.
		// Using index signature to allow for future API changes without breaking type safety.
		[key: string]: unknown;
	};
}

export interface PageUpdatedInDatabaseEvent extends NotionWebhookPayload {
	type: 'page.updated_in_database';
	data: {
		page_id: string;
		database_id: string;
		// NOTE: Additional fields may be present depending on Notion API version and event details.
		// Using index signature to allow for future API changes without breaking type safety.
		[key: string]: unknown;
	};
}

export type NotionWebhookOutputs = {
	pageAddedToDatabase: PageAddedToDatabaseEvent;
	pageUpdatedInDatabase: PageUpdatedInDatabaseEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createNotionMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
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

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');

	const isValid = crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature),
	);

	return {
		valid: isValid,
		error: isValid ? undefined : 'Invalid signature',
	};
}
