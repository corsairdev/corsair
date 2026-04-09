import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook event types
// ─────────────────────────────────────────────────────────────────────────────

export type OuraEventType = 'create' | 'update' | 'delete';

export type OuraDataType =
	| 'daily_activity'
	| 'daily_readiness'
	| 'daily_sleep'
	| 'daily_spo2'
	| 'sleep'
	| 'session'
	| 'tag'
	| 'workout'
	| 'heartrate';

export interface OuraWebhookPayload {
	event_type: OuraEventType;
	data_type: OuraDataType;
	object_id: string;
	user_id: string;
	timestamp: string;
}

export interface DailyActivityWebhookEvent extends OuraWebhookPayload {
	data_type: 'daily_activity';
}

export interface DailyReadinessWebhookEvent extends OuraWebhookPayload {
	data_type: 'daily_readiness';
}

export interface DailySleepWebhookEvent extends OuraWebhookPayload {
	data_type: 'daily_sleep';
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook output map
// ─────────────────────────────────────────────────────────────────────────────

export type OuraWebhookOutputs = {
	dailyActivity: DailyActivityWebhookEvent;
	dailyReadiness: DailyReadinessWebhookEvent;
	dailySleep: DailySleepWebhookEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

// Body is unknown because it comes directly from the HTTP request payload
function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return {};
	}
}

export function createOuraMatch(dataType: OuraDataType): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any cast needed because body is unknown until parsed
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.data_type === dataType;
	};
}

export function verifyOuraWebhookSignature(
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
	const signature = Array.isArray(headers['x-oura-signature'])
		? headers['x-oura-signature'][0]
		: headers['x-oura-signature'];

	if (!signature) {
		return { valid: false, error: 'Missing x-oura-signature header' };
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}
		return { valid: true };
	} catch {
		return { valid: false, error: 'Invalid signature' };
	}
}
