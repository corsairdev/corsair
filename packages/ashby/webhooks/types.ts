import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Base Webhook Payload Schema
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyWebhookPayloadSchema = z.object({
	webhookActionId: z.string(),
	action: z.string(),
	data: z.record(z.string(), z.unknown()),
});
export type AshbyWebhookPayload = z.infer<typeof AshbyWebhookPayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Event Payload Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CandidateStageChangeEventSchema = AshbyWebhookPayloadSchema.extend(
	{
		action: z.literal('candidateStageChange'),
		data: z
			.object({
				candidateId: z.string().optional(),
				applicationId: z.string().optional(),
				jobId: z.string().optional(),
				previousInterviewStageId: z.string().nullable().optional(),
				currentInterviewStageId: z.string().optional(),
			})
			.loose(),
	},
);
export type CandidateStageChangeEvent = z.infer<
	typeof CandidateStageChangeEventSchema
>;

export const ApplicationSubmitEventSchema = AshbyWebhookPayloadSchema.extend({
	action: z.literal('applicationSubmit'),
	data: z
		.object({
			applicationId: z.string().optional(),
			candidateId: z.string().optional(),
			jobId: z.string().optional(),
		})
		.loose(),
});
export type ApplicationSubmitEvent = z.infer<
	typeof ApplicationSubmitEventSchema
>;

export const ApplicationUpdateEventSchema = AshbyWebhookPayloadSchema.extend({
	action: z.literal('applicationUpdate'),
	data: z
		.object({
			applicationId: z.string().optional(),
			candidateId: z.string().optional(),
			jobId: z.string().optional(),
			status: z.string().optional(),
		})
		.loose(),
});
export type ApplicationUpdateEvent = z.infer<
	typeof ApplicationUpdateEventSchema
>;

export const CandidateHireEventSchema = AshbyWebhookPayloadSchema.extend({
	action: z.literal('candidateHire'),
	data: z
		.object({
			candidateId: z.string().optional(),
			applicationId: z.string().optional(),
			offerId: z.string().optional(),
		})
		.loose(),
});
export type CandidateHireEvent = z.infer<typeof CandidateHireEventSchema>;

export const OfferCreateEventSchema = AshbyWebhookPayloadSchema.extend({
	action: z.literal('offerCreate'),
	data: z
		.object({
			offerId: z.string().optional(),
			applicationId: z.string().optional(),
		})
		.loose(),
});
export type OfferCreateEvent = z.infer<typeof OfferCreateEventSchema>;

export const OfferUpdateEventSchema = AshbyWebhookPayloadSchema.extend({
	action: z.literal('offerUpdate'),
	data: z
		.object({
			offerId: z.string().optional(),
			applicationId: z.string().optional(),
			status: z.string().optional(),
		})
		.loose(),
});
export type OfferUpdateEvent = z.infer<typeof OfferUpdateEventSchema>;

export const OfferDeleteEventSchema = AshbyWebhookPayloadSchema.extend({
	action: z.literal('offerDelete'),
	data: z
		.object({
			offerId: z.string().optional(),
			applicationId: z.string().optional(),
		})
		.loose(),
});
export type OfferDeleteEvent = z.infer<typeof OfferDeleteEventSchema>;

export const InterviewScheduleCreateEventSchema =
	AshbyWebhookPayloadSchema.extend({
		action: z.literal('interviewScheduleCreate'),
		data: z
			.object({
				interviewScheduleId: z.string().optional(),
				applicationId: z.string().optional(),
			})
			.loose(),
	});
export type InterviewScheduleCreateEvent = z.infer<
	typeof InterviewScheduleCreateEventSchema
>;

export const InterviewScheduleUpdateEventSchema =
	AshbyWebhookPayloadSchema.extend({
		action: z.literal('interviewScheduleUpdate'),
		data: z
			.object({
				interviewScheduleId: z.string().optional(),
				applicationId: z.string().optional(),
				status: z.string().optional(),
			})
			.loose(),
	});
export type InterviewScheduleUpdateEvent = z.infer<
	typeof InterviewScheduleUpdateEventSchema
>;

export const InterviewPlanTransitionEventSchema =
	AshbyWebhookPayloadSchema.extend({
		action: z.literal('interviewPlanTransition'),
		data: z
			.object({
				applicationId: z.string().optional(),
				interviewPlanId: z.string().optional(),
			})
			.loose(),
	});
export type InterviewPlanTransitionEvent = z.infer<
	typeof InterviewPlanTransitionEventSchema
>;

export type AshbyWebhookOutputs = {
	'candidate.stageChange': CandidateStageChangeEvent;
	'candidate.hire': CandidateHireEvent;
	'application.submit': ApplicationSubmitEvent;
	'application.update': ApplicationUpdateEvent;
	'offer.create': OfferCreateEvent;
	'offer.update': OfferUpdateEvent;
	'offer.delete': OfferDeleteEvent;
	'interview.scheduleCreate': InterviewScheduleCreateEvent;
	'interview.scheduleUpdate': InterviewScheduleUpdateEvent;
	'interview.planTransition': InterviewPlanTransitionEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers & Signature Verification
// ─────────────────────────────────────────────────────────────────────────────

export function parseBody(body: unknown): Record<string, unknown> | null {
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

export function createAshbyMatch(action: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		return (
			parsed !== null &&
			typeof parsed.action === 'string' &&
			parsed.action === action
		);
	};
}

export const createAshbyEventMatch = createAshbyMatch;

function asRawWebhookBytes(value: unknown): string | undefined {
	if (typeof value === 'string') return value;
	if (Buffer.isBuffer(value)) return value.toString('utf8');
	if (value instanceof Uint8Array) return Buffer.from(value).toString('utf8');
	return undefined;
}

/**
 * Verifies the Ashby webhook signature from the `Ashby-Signature` header.
 * Ashby generates an HMAC-SHA256 signature in the format `sha256=<hex_digest>`.
 */
export function verifyAshbyWebhookSignature(
	request: WebhookRequest<AshbyWebhookPayload> | RawWebhookRequest,
	secret: string,
): { valid: boolean; error?: string } {
	if ('hubVerified' in request && request.hubVerified) {
		return { valid: true };
	}

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const headers = request.headers;
	let signatureHeader: string | undefined;

	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === 'ashby-signature') {
			signatureHeader = Array.isArray(value) ? value[0] : value;
			break;
		}
	}

	if (!signatureHeader) {
		return { valid: false, error: 'Missing Ashby-Signature header' };
	}

	const rawBody =
		asRawWebhookBytes('rawBody' in request ? request.rawBody : undefined) ??
		asRawWebhookBytes('body' in request ? request.body : undefined);

	if (rawBody === undefined) {
		return {
			valid: false,
			error: 'Raw webhook body unavailable for signature verification',
		};
	}

	const computedHmac = createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');
	const expected = `sha256=${computedHmac}`;

	const providedBuf = Buffer.from(signatureHeader);
	const expectedBuf = Buffer.from(expected);

	if (providedBuf.length !== expectedBuf.length) {
		return { valid: false, error: 'Signature length mismatch' };
	}

	if (!timingSafeEqual(providedBuf, expectedBuf)) {
		return { valid: false, error: 'Signature mismatch' };
	}

	return { valid: true };
}
