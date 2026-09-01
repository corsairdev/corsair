import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const SendGridEventSchema = z.object({
	email: z.string(),
	event: z.string(),
	timestamp: z.number(),
	sg_event_id: z.string().optional(),
	sg_message_id: z.string().optional(),
	reason: z.string().optional(),
	status: z.string().optional(),
	response: z.string().optional(),
});

export type SendGridEvent = z.infer<typeof SendGridEventSchema>;

export const EmailEventWebhookSchema = z.object({
	events: z.array(SendGridEventSchema),
});

export type EmailEventWebhookOutput = z.infer<typeof EmailEventWebhookSchema>;

export type SendGridWebhookOutputs = {
	emailEvent: EmailEventWebhookOutput;
};

function parseBody(body: unknown): unknown {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body);
		} catch {
			return null;
		}
	}
	return body;
}

export function createSendGridMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		if (Array.isArray(parsed)) {
			return parsed.some(
				(item) =>
					typeof item === 'object' && item !== null && item.event === eventType,
			);
		}
		return false;
	};
}

export function verifySendGridWebhookSignature(
	_request: WebhookRequest<SendGridEvent>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
