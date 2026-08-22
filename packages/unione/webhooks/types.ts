import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/** The event names UniOne sends, per the callback-format docs. */
export const UNIONE_EVENT_NAMES = [
	'transactional_email_status',
	'transactional_spam_block',
] as const;

export const UnioneWebhookEventSchema = z
	.object({
		event_name: z.string(),
		event_data: z
			.object({
				job_id: z.string().optional(),
				email: z.string().optional(),
				status: z.string().optional(),
				event_time: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type UnioneWebhookEvent = z.infer<typeof UnioneWebhookEventSchema>;

export const UnioneWebhookPayloadSchema = z
	.object({
		auth: z.string().optional(),
		events_by_user: z
			.array(
				z
					.object({
						user_id: z.union([z.string(), z.number()]).optional(),
						project_id: z.string().optional(),
						project_name: z.string().optional(),
						events: z.array(UnioneWebhookEventSchema).optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export type UnioneWebhookPayload = z.infer<typeof UnioneWebhookPayloadSchema>;

export type UnioneWebhookOutputs = {
	emailStatus: UnioneWebhookPayload;
	spamBlock: UnioneWebhookPayload;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

function payloadHasEvent(
	payload: Record<string, unknown>,
	eventName: string,
): boolean {
	const users = payload.events_by_user;
	if (!Array.isArray(users)) return false;
	return users.some((user) => {
		if (user === null || typeof user !== 'object') return false;
		const events = (user as { events?: unknown }).events;
		if (!Array.isArray(events)) return false;
		return events.some(
			(event) =>
				event !== null &&
				typeof event === 'object' &&
				(event as { event_name?: unknown }).event_name === eventName,
		);
	});
}

export function createUnioneMatch(eventName: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && payloadHasEvent(parsedBody, eventName);
	};
}

export function verifyUnioneWebhookAuth(
	request: WebhookRequest<UnioneWebhookPayload>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	// The Hub already checked the provider signature on this delivery and
	// deliberately builds no plugin key for it, so `secret` is undefined by
	// design here - re-checking would reject an authenticated request.
	if (request.hubVerified === true) {
		return { valid: true };
	}
	// Otherwise fail closed. With no secret there is nothing to check
	// `payload.auth` against, and an accepted event persists caller-controlled
	// job status to the mirror. Set `webhookSecret`, or store a signature key.
	if (!secret) {
		return {
			valid: false,
			error:
				'No UniOne webhook secret configured; refusing unauthenticated payload',
		};
	}
	const provided = request.payload.auth;
	if (!provided) {
		return { valid: false, error: 'Missing webhook auth field' };
	}
	if (provided !== secret) {
		return { valid: false, error: 'Invalid webhook auth' };
	}
	return { valid: true };
}
