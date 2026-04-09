import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

// unknown: body may be a raw JSON string or an already-parsed object depending on the request source
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export interface FigmaWebhookPayload {
	event_type: string;
	timestamp: string;
	webhook_id: string;
	passcode?: string;
}

export interface FigmaFileCommentEvent extends FigmaWebhookPayload {
	event_type: 'FILE_COMMENT';
	file_key: string;
	file_name: string;
	comment: {
		id: string;
		message?: string;
		created_at?: string;
		// any: comment user can be undefined in some webhook payloads
		user?: { id: string; handle?: string; img_url?: string };
	};
}

export interface FigmaFileUpdateEvent extends FigmaWebhookPayload {
	event_type: 'FILE_UPDATE';
	file_key: string;
	file_name: string;
	passedAt?: string;
}

export interface FigmaFileDeleteEvent extends FigmaWebhookPayload {
	event_type: 'FILE_DELETE';
	file_key: string;
	file_name: string;
}

export interface FigmaFileVersionUpdateEvent extends FigmaWebhookPayload {
	event_type: 'FILE_VERSION_UPDATE';
	file_key: string;
	file_name: string;
	version_id: string;
	label?: string;
	description?: string;
	created_components?: string[];
	modified_components?: string[];
	created_styles?: string[];
	modified_styles?: string[];
}

export interface FigmaLibraryPublishEvent extends FigmaWebhookPayload {
	event_type: 'LIBRARY_PUBLISH';
	file_key: string;
	file_name: string;
	description?: string;
}

export interface FigmaPingEvent extends FigmaWebhookPayload {
	event_type: 'PING';
	file_key?: string;
}

export type FigmaWebhookOutputs = {
	fileComment: FigmaFileCommentEvent;
	fileUpdate: FigmaFileUpdateEvent;
	fileDelete: FigmaFileDeleteEvent;
	fileVersionUpdate: FigmaFileVersionUpdateEvent;
	libraryPublish: FigmaLibraryPublishEvent;
	ping: FigmaPingEvent;
};

export function createFigmaEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// type assertion: parsed body shape is unknown at runtime; narrowed to Record to access event_type
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.event_type === eventType;
	};
}

export function verifyFigmaWebhookPasscode(
	// unknown: webhook payload type is not known at parse time; callers narrow to specific event types after verification
	request: WebhookRequest<unknown>,
	passcode: string,
): { valid: boolean; error?: string } {
	// type assertion: parsed payload shape is unknown at runtime; narrowed to Record to access passcode field
	const parsedBody = parseBody(request.payload) as Record<string, unknown>;
	const payloadPasscode = parsedBody.passcode;

	if (!payloadPasscode || typeof payloadPasscode !== 'string') {
		return { valid: false, error: 'Missing passcode in payload' };
	}

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(payloadPasscode),
			Buffer.from(passcode),
		);
		return { valid: isValid, error: isValid ? undefined : 'Invalid passcode' };
	} catch {
		return { valid: false, error: 'Invalid passcode' };
	}
}

export const FigmaFileCommentPayloadSchema = z.object({
	event_type: z.literal('FILE_COMMENT'),
	timestamp: z.string(),
	webhook_id: z.string(),
	passcode: z.string().optional(),
	file_key: z.string(),
	file_name: z.string(),
	comment: z.object({
		id: z.string(),
		message: z.string().optional(),
		created_at: z.string().optional(),
		user: z
			.object({
				id: z.string(),
				handle: z.string().optional(),
				img_url: z.string().optional(),
			})
			.optional(),
	}),
});

export const FigmaFileUpdatePayloadSchema = z.object({
	event_type: z.literal('FILE_UPDATE'),
	timestamp: z.string(),
	webhook_id: z.string(),
	passcode: z.string().optional(),
	file_key: z.string(),
	file_name: z.string(),
});

export const FigmaFileDeletePayloadSchema = z.object({
	event_type: z.literal('FILE_DELETE'),
	timestamp: z.string(),
	webhook_id: z.string(),
	passcode: z.string().optional(),
	file_key: z.string(),
	file_name: z.string(),
});

export const FigmaFileVersionUpdatePayloadSchema = z.object({
	event_type: z.literal('FILE_VERSION_UPDATE'),
	timestamp: z.string(),
	webhook_id: z.string(),
	passcode: z.string().optional(),
	file_key: z.string(),
	file_name: z.string(),
	version_id: z.string(),
	label: z.string().optional(),
	description: z.string().optional(),
	created_components: z.array(z.string()).optional(),
	modified_components: z.array(z.string()).optional(),
	created_styles: z.array(z.string()).optional(),
	modified_styles: z.array(z.string()).optional(),
});

export const FigmaLibraryPublishPayloadSchema = z.object({
	event_type: z.literal('LIBRARY_PUBLISH'),
	timestamp: z.string(),
	webhook_id: z.string(),
	passcode: z.string().optional(),
	file_key: z.string(),
	file_name: z.string(),
	description: z.string().optional(),
});

export const FigmaPingPayloadSchema = z.object({
	event_type: z.literal('PING'),
	timestamp: z.string(),
	webhook_id: z.string(),
	passcode: z.string().optional(),
	file_key: z.string().optional(),
});

export const FigmaFileCommentEventSchema = FigmaFileCommentPayloadSchema;
export const FigmaFileUpdateEventSchema = FigmaFileUpdatePayloadSchema;
export const FigmaFileDeleteEventSchema = FigmaFileDeletePayloadSchema;
export const FigmaFileVersionUpdateEventSchema =
	FigmaFileVersionUpdatePayloadSchema;
export const FigmaLibraryPublishEventSchema = FigmaLibraryPublishPayloadSchema;
export const FigmaPingEventSchema = FigmaPingPayloadSchema;
