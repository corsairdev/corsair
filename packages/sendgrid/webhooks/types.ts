import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import { SendGridEmailEvent } from '../schema/database';

export const SendGridEventSchema = SendGridEmailEvent;

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

export function createSendGridMatch(eventType?: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		if (Array.isArray(parsed) && parsed.length > 0) {
			if (!eventType) return true;
			return parsed.some(
				(item) =>
					typeof item === 'object' &&
					item !== null &&
					(item as Record<string, unknown>).event === eventType,
			);
		}
		if (typeof parsed === 'object' && parsed !== null) {
			if (!eventType) return true;
			return (parsed as Record<string, unknown>).event === eventType;
		}
		return false;
	};
}

export const SENDGRID_WEBHOOK_MAX_AGE_SECONDS = 300;

export function verifySendGridWebhookSignature(
	request: WebhookRequest<SendGridEvent>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return {
			valid: false,
			error: 'SendGrid webhook verification key is missing',
		};
	}

	const headers = request.headers;
	const signature =
		(headers['x-twilio-email-event-webhook-signature'] as string | undefined) ||
		(headers['X-Twilio-Email-Event-Webhook-Signature'] as string | undefined);
	const timestamp =
		(headers['x-twilio-email-event-webhook-timestamp'] as string | undefined) ||
		(headers['X-Twilio-Email-Event-Webhook-Timestamp'] as string | undefined);

	if (!signature || !timestamp) {
		return {
			valid: false,
			error: 'Missing SendGrid signature or timestamp header',
		};
	}

	const timestampSeconds = Number(timestamp);
	if (!Number.isFinite(timestampSeconds)) {
		return { valid: false, error: 'Invalid SendGrid webhook timestamp' };
	}

	const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
	if (ageSeconds > SENDGRID_WEBHOOK_MAX_AGE_SECONDS) {
		return {
			valid: false,
			error: 'SendGrid webhook timestamp is stale',
		};
	}

	try {
		const rawBody =
			typeof request.rawBody === 'string'
				? request.rawBody
				: JSON.stringify(request.payload);
		const payloadToVerify = timestamp + rawBody;

		const verifier = crypto.createVerify('SHA256');
		verifier.update(payloadToVerify);

		const formattedKey = secret.startsWith('-----BEGIN')
			? secret
			: `-----BEGIN PUBLIC KEY-----\n${secret}\n-----END PUBLIC KEY-----`;

		const isValid = verifier.verify(formattedKey, signature, 'base64');
		if (!isValid) {
			return { valid: false, error: 'Invalid SendGrid webhook signature' };
		}

		return { valid: true };
	} catch (err) {
		return {
			valid: false,
			error:
				err instanceof Error ? err.message : 'Signature verification failed',
		};
	}
}
