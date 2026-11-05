import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';

export const CrowterminalWebhookEventNameSchema = z.enum([
	'skill.updated',
	'skill.version_created',
	'data.ingested',
	'validation.blocked',
	'posting.completed',
	'posting.failed',
]);

export const CrowterminalWebhookPayloadSchema = z.object({
	event: CrowterminalWebhookEventNameSchema,
	timestamp: z.string(),
	webhookId: z.string(),
	agentId: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type CrowterminalWebhookPayload = z.infer<
	typeof CrowterminalWebhookPayloadSchema
>;

export const SkillUpdatedEventSchema = CrowterminalWebhookPayloadSchema.extend({
	event: z.literal('skill.updated'),
});
export const SkillVersionCreatedEventSchema =
	CrowterminalWebhookPayloadSchema.extend({
		event: z.literal('skill.version_created'),
	});
export const DataIngestedEventSchema = CrowterminalWebhookPayloadSchema.extend({
	event: z.literal('data.ingested'),
});
export const ValidationBlockedEventSchema =
	CrowterminalWebhookPayloadSchema.extend({
		event: z.literal('validation.blocked'),
	});
export const PostingCompletedEventSchema =
	CrowterminalWebhookPayloadSchema.extend({
		event: z.literal('posting.completed'),
	});
export const PostingFailedEventSchema = CrowterminalWebhookPayloadSchema.extend(
	{
		event: z.literal('posting.failed'),
	},
);

export type SkillUpdatedEvent = z.infer<typeof SkillUpdatedEventSchema>;
export type SkillVersionCreatedEvent = z.infer<
	typeof SkillVersionCreatedEventSchema
>;
export type DataIngestedEvent = z.infer<typeof DataIngestedEventSchema>;
export type ValidationBlockedEvent = z.infer<
	typeof ValidationBlockedEventSchema
>;
export type PostingCompletedEvent = z.infer<typeof PostingCompletedEventSchema>;
export type PostingFailedEvent = z.infer<typeof PostingFailedEventSchema>;

export type CrowterminalWebhookOutputs = {
	skillUpdated: SkillUpdatedEvent;
	skillVersionCreated: SkillVersionCreatedEvent;
	dataIngested: DataIngestedEvent;
	validationBlocked: ValidationBlockedEvent;
	postingCompleted: PostingCompletedEvent;
	postingFailed: PostingFailedEvent;
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

export function createCrowterminalMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.event === eventType;
	};
}

function signatureHeader(
	headers: Record<string, string | string[] | undefined>,
): string | undefined {
	for (const [name, value] of Object.entries(headers)) {
		if (name.toLowerCase() !== 'x-crowterminal-signature') continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

export function hasCrowterminalWebhookSignature(
	request: RawWebhookRequest,
): boolean {
	return signatureHeader(request.headers) !== undefined;
}

export function verifyCrowterminalWebhookSignature(
	request: WebhookRequest<CrowterminalWebhookPayload>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}
	if (!request.rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const signature = signatureHeader(request.headers);
	if (!signature) {
		return {
			valid: false,
			error: 'Missing X-CrowTerminal-Signature header',
		};
	}

	if (
		!verifyHmacSignatureWithPrefix(
			request.rawBody,
			secret,
			signature,
			'sha256=',
		)
	) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
