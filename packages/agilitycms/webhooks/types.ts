import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const AgilityCmsWebhookPayloadSchema = z
	.object({
		state: z.string(),
		instanceGuid: z.string(),
		languageCode: z.string(),
		changeDateUTC: z.string(),

		referenceName: z.string().optional(),

		contentID: z.number().optional(),
		contentVersionID: z.number().optional(),

		pageID: z.number().optional(),
		pageVersionID: z.number().optional(),
	})
	.refine(
		(value) => value.contentID !== undefined || value.pageID !== undefined,
		{
			message: 'Agility CMS webhook must contain contentID or pageID',
		},
	);

export type AgilityCmsWebhookPayload = z.infer<
	typeof AgilityCmsWebhookPayloadSchema
>;

export type ContentChangedEvent = AgilityCmsWebhookPayload;

export type AgilityCmsWebhookOutputs = {
	contentChanged: ContentChangedEvent;
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

export function createAgilityCmsMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseBody(request.body);

		return (
			body !== null &&
			typeof body.instanceGuid === 'string' &&
			typeof body.state === 'string'
		);
	};
}

export function verifyAgilityCmsWebhookSignature(
	request: WebhookRequest<AgilityCmsWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const provided = request.headers['x-agility-security-key'];

	if (!secret) {
		return {
			valid: false,
			error: 'Webhook security key is not configured',
		};
	}

	if (!provided) {
		return {
			valid: false,
			error: 'Missing x-agility-security-key header',
		};
	}

	if (provided !== secret) {
		return {
			valid: false,
			error: 'Invalid Agility CMS security key',
		};
	}

	return { valid: true };
}
