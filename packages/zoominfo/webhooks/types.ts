import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/**
 * ZoomInfo's Monitoring API sends the webhook's verification token in the
 * x-zoominfo-token header. It is a shared secret rather than a signature over
 * the body, so verification is an equality check on the token itself.
 */
export const ZOOMINFO_TOKEN_HEADER = 'x-zoominfo-token';

/** Contact and Company are the only object types; Update is the only event. */
export const ZoominfoWebhookDetailsSchema = z.looseObject({
	id: z.string(),
	title: z.string().optional(),
	objectType: z.string(),
	eventType: z.string(),
});

export const ZoominfoWebhookPayloadSchema = z.looseObject({
	webhookDetails: ZoominfoWebhookDetailsSchema,
	/** At most 25 profiles per delivery. */
	data: z.array(z.looseObject({ id: z.union([z.string(), z.number()]) })),
});

export type ZoominfoWebhookPayload = z.infer<
	typeof ZoominfoWebhookPayloadSchema
>;

const objectTypeIs = (expected: string) => (value: unknown) =>
	typeof value === 'string' && value.toLowerCase() === expected;

export const ContactUpdateEventSchema = ZoominfoWebhookPayloadSchema.extend({
	webhookDetails: ZoominfoWebhookDetailsSchema.extend({
		// The docs spell this "Contact" for contacts but "company" for companies,
		// so casing is not something to rely on.
		objectType: z.string().refine(objectTypeIs('contact')),
	}),
	data: z.array(
		z.looseObject({
			id: z.union([z.string(), z.number()]),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			email: z.string().optional(),
			/** Fields that changed; absent on a full-payload subscription. */
			changedAttributes: z.array(z.string()).optional(),
		}),
	),
});

export const CompanyUpdateEventSchema = ZoominfoWebhookPayloadSchema.extend({
	webhookDetails: ZoominfoWebhookDetailsSchema.extend({
		objectType: z.string().refine(objectTypeIs('company')),
	}),
	data: z.array(
		z.looseObject({
			id: z.union([z.string(), z.number()]),
			name: z.string().optional(),
			website: z.string().optional(),
			changedAttributes: z.array(z.string()).optional(),
		}),
	),
});

export type ContactUpdateEvent = z.infer<typeof ContactUpdateEventSchema>;
export type CompanyUpdateEvent = z.infer<typeof CompanyUpdateEventSchema>;

export type ZoominfoWebhookOutputs = {
	contactUpdate: ContactUpdateEvent;
	companyUpdate: CompanyUpdateEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
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

/** Routes a delivery by its objectType, which is the only discriminator. */
export function createZoominfoMatch(
	objectType: 'contact' | 'company',
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseBody(request.body);
		const details = body?.webhookDetails;
		if (typeof details !== 'object' || details === null) return false;
		return objectTypeIs(objectType)(
			(details as Record<string, unknown>).objectType,
		);
	};
}

function headerValue(
	headers: Record<string, unknown> | undefined,
	name: string,
): string | undefined {
	if (!headers) return undefined;
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		if (typeof value === 'string') return value;
		if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
	}
	return undefined;
}

/**
 * Fails closed: without a configured token there is nothing to check against,
 * so the delivery is rejected rather than trusted.
 */
export function verifyZoominfoWebhookSignature(
	request: WebhookRequest<ZoominfoWebhookPayload>,
	secret?: string,
): { valid: boolean; error?: string } {
	// The hub verifies the delivery before forwarding it, and bind.ts then skips
	// keyBuilder entirely, so there is no token here to compare against.
	if (request.hubVerified === true) {
		return { valid: true };
	}

	if (!secret) {
		return { valid: false, error: 'No ZoomInfo verification token configured' };
	}

	const provided = headerValue(
		request.headers as Record<string, unknown> | undefined,
		ZOOMINFO_TOKEN_HEADER,
	);
	if (!provided) {
		return { valid: false, error: `Missing ${ZOOMINFO_TOKEN_HEADER} header` };
	}

	const actual = Buffer.from(provided);
	const expected = Buffer.from(secret);
	if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
		return { valid: false, error: 'Verification token mismatch' };
	}

	return { valid: true };
}

// ── Monitoring API ──────────────────────────────────────────────────────────
// Shapes returned by the webhook-management endpoints that `subscribe` drives:
// POST /webhooks, GET /webhooks and POST /webhooks/{id}/token.

export const ZoominfoWebhookSubscriptionSchema = z.looseObject({
	subscriptionId: z.string().optional(),
	eventType: z.string().optional(),
	objectType: z.string().optional(),
	fullPayload: z.boolean().optional(),
});

export const ZoominfoWebhookRecordSchema = z.looseObject({
	id: z.string(),
	/** Absent on webhooks created before a title was required. */
	title: z.string().optional(),
	enabled: z.boolean().optional(),
	targetUrl: z.string(),
	createdDate: z.string().optional(),
	/** Returned only by create; generating a new one revokes the previous. */
	verificationToken: z.string().optional(),
	subscriptions: z.array(ZoominfoWebhookSubscriptionSchema).optional(),
});

export type ZoominfoWebhookRecord = z.infer<typeof ZoominfoWebhookRecordSchema>;

export const ZoominfoWebhookListSchema = z.looseObject({
	webhooks: z.array(ZoominfoWebhookRecordSchema),
});

export const ZoominfoWebhookTokenSchema = z.looseObject({
	verificationToken: z.string(),
});
