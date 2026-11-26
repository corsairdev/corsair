import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
	WebhookResponse,
} from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';
import type { LushaContext } from '..';

// Lusha webhook deliveries, per the Webhooks section of
// docs.lusha.com/openapi.json: signal events for subscriptions made with
// subscriptions.create, and contact opt-outs for subscriptions.createOptOut.
// Both are signed the same way (X-Lusha-Signature, X-Lusha-Timestamp).

const SIGNATURE_HEADER = 'x-lusha-signature';
const TIMESTAMP_HEADER = 'x-lusha-timestamp';

/** A signal for a subscribed contact or company (promotion, news, hiring...). */
export const LushaSignalEventSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		entityType: z.string(),
		entityId: z.union([z.string(), z.number()]),
		subscriptionId: z.string().nullish(),
		// unknown: the data object differs per signal type (promotion,
		// companyChange, news, hiring...); it passes through as Lusha sends it.
		data: z.record(z.string(), z.unknown()).nullish(),
		timestamp: z.string().nullish(),
		billing: z
			.object({ creditsCharged: z.number().nullish() })
			.loose()
			.nullish(),
	})
	.loose();
export type LushaSignalEvent = z.infer<typeof LushaSignalEventSchema>;

/** A contact asked Lusha to remove their data; remove the listed data points. */
export const LushaOptOutEventSchema = z
	.object({
		contactId: z.union([z.string(), z.number()]),
		fullName: z.string().nullish(),
		companyName: z.string().nullish(),
		jobTitle: z.string().nullish(),
		linkedinUrl: z.string().nullish(),
		contactOptOutDate: z.string().nullish(),
		contactExposureDate: z.string().nullish(),
		datapoints: z.array(
			z
				.object({
					datapointId: z.string().nullish(),
					datapointType: z.string().nullish(),
				})
				.loose(),
		),
		partnerClientId: z.string().nullish(),
	})
	.loose();
export type LushaOptOutEvent = z.infer<typeof LushaOptOutEventSchema>;

export type LushaWebhookOutputs = {
	signalReceived: LushaSignalEvent;
	optOutReceived: LushaOptOutEvent;
};

// unknown: the transport may deliver a JSON string or a parsed object.
function parseBody(body: unknown): Record<string, unknown> | null {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return null;
		}
	}
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function getHeader(
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

function isSignal(body: Record<string, unknown>): boolean {
	return (
		typeof body.id === 'string' &&
		typeof body.type === 'string' &&
		typeof body.entityType === 'string' &&
		'entityId' in body
	);
}

function isOptOut(body: Record<string, unknown>): boolean {
	return 'contactId' in body && Array.isArray(body.datapoints);
}

/** Lusha signs every delivery; nothing without its header is claimed. */
export function matchLushaWebhook(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, SIGNATURE_HEADER)) return false;
	const body = parseBody(request.body);
	return body !== null && (isSignal(body) || isOptOut(body));
}

function safeEqualHex(a: string, b: string): boolean {
	const left = Buffer.from(a, 'utf8');
	const right = Buffer.from(b, 'utf8');
	return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/**
 * Lusha's documented check: HMAC-SHA256 with the account webhook secret over
 * `${X-Lusha-Timestamp}.${JSON.stringify(payload)}`, hex, compared with
 * X-Lusha-Signature. The raw body is tried first (it is what was sent), then
 * the re-serialised payload, which is the docs' own formula.
 *
 * The docs give no timestamp format or tolerance, so no replay window is
 * enforced; a live delivery should settle that.
 */
export function verifyLushaSignature(
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: true } | { valid: false; error: string } {
	if (request.hubVerified === true) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Lusha webhook secret is configured (set options.webhookSecret or the webhook_signature key)',
		};
	}
	const signature = getHeader(request.headers, SIGNATURE_HEADER)?.trim();
	const timestamp = getHeader(request.headers, TIMESTAMP_HEADER)?.trim();
	if (!signature || !timestamp) {
		return {
			valid: false,
			error: 'Missing X-Lusha-Signature or X-Lusha-Timestamp header',
		};
	}
	const candidates: string[] = [];
	if (request.rawBody) candidates.push(request.rawBody);
	const parsed = parseBody(request.payload ?? request.rawBody);
	if (parsed) candidates.push(JSON.stringify(parsed));
	for (const body of candidates) {
		const expected = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${body}`)
			.digest('hex');
		if (safeEqualHex(signature.toLowerCase(), expected)) {
			return { valid: true };
		}
	}
	return { valid: false, error: 'Invalid Lusha webhook signature' };
}

/**
 * Lusha wants `{received: true, timestamp, webhookId}` back within 10 seconds,
 * or it retries and finally disables the subscription.
 */
function acknowledgement(webhookId: string | undefined) {
	const ack = {
		received: true,
		timestamp: new Date().toISOString(),
		...(webhookId ? { webhookId } : {}),
	};
	// Core types returnToSender as string values; Lusha documents `received`
	// as a JSON boolean, and core sends the object as JSON unchanged.
	return ack as unknown as Record<string, string>;
}

function rejected(error: string, statusCode = 401): WebhookResponse<never> {
	return { success: false, statusCode, error };
}

export const signalReceived: CorsairWebhook<
	LushaContext,
	LushaSignalEvent,
	LushaSignalEvent
> = {
	match: (request) => {
		if (!getHeader(request.headers, SIGNATURE_HEADER)) return false;
		const body = parseBody(request.body);
		return body !== null && isSignal(body);
	},
	handler: async (ctx, request) => {
		const check = verifyLushaSignature(request, ctx.key);
		if (!check.valid) return rejected(check.error);
		const parsed = LushaSignalEventSchema.safeParse(
			parseBody(request.payload ?? request.rawBody),
		);
		if (!parsed.success) {
			return rejected('Malformed Lusha signal payload', 400);
		}
		const event = parsed.data;
		// Ids and type only: the data object names people and companies.
		await logEventFromContext(
			ctx,
			'lusha.webhook.signalReceived',
			{
				signalId: event.id,
				type: event.type,
				entityType: event.entityType,
				subscriptionId: event.subscriptionId ?? undefined,
				creditsCharged: event.billing?.creditsCharged ?? undefined,
			},
			'completed',
		);
		return {
			success: true,
			statusCode: 201,
			returnToSender: acknowledgement(event.id),
			data: event,
		};
	},
};

export const optOutReceived: CorsairWebhook<
	LushaContext,
	LushaOptOutEvent,
	LushaOptOutEvent
> = {
	match: (request) => {
		if (!getHeader(request.headers, SIGNATURE_HEADER)) return false;
		const body = parseBody(request.body);
		return body !== null && isOptOut(body);
	},
	handler: async (ctx, request) => {
		const check = verifyLushaSignature(request, ctx.key);
		if (!check.valid) return rejected(check.error);
		const parsed = LushaOptOutEventSchema.safeParse(
			parseBody(request.payload ?? request.rawBody),
		);
		if (!parsed.success) {
			return rejected('Malformed Lusha opt-out payload', 400);
		}
		const event = parsed.data;
		// No name, email or phone in the log: this person asked to be removed.
		await logEventFromContext(
			ctx,
			'lusha.webhook.optOutReceived',
			{
				contactId: String(event.contactId),
				datapoints: event.datapoints.length,
			},
			'completed',
		);
		return {
			success: true,
			statusCode: 201,
			returnToSender: acknowledgement(undefined),
			data: event,
		};
	},
};
