import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

export const HookdeckWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	// `z.unknown()` because webhook `data` carries provider-defined arbitrary
	// JSON; the envelope (type/created_at) is validated and consumers narrow
	// `data` per event type instead of assuming a shape here.
	data: z.record(z.string(), z.unknown()),
});

export type HookdeckWebhookPayload = z.infer<
	typeof HookdeckWebhookPayloadSchema
>;

export const ExampleEventSchema = HookdeckWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type HookdeckWebhookOutputs = {
	example: ExampleEvent;
};

// `body: unknown` because raw webhook bodies arrive as untyped transport
// data (string or parsed JSON); callers must pass through this runtime
// narrowing before reading any property. The `Record<string, unknown>`
// return values are justified the same way: arbitrary provider JSON that is
// only read after the non-null, non-array object guards below.
function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			// Justification: JSON.parse returns `any` by definition; typing
			// it as `unknown` forces the runtime narrowing below.
			const parsed: unknown = JSON.parse(body);
			// Narrow assertion: safe because the guard above confirms a
			// non-null, non-array object; no better type is practical for
			// arbitrary provider JSON.
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	// Narrow assertion: safe because the guard confirms a non-null, non-array
	// object; no better type is practical for arbitrary provider JSON.
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createHookdeckMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyHookdeckWebhookSignature(
	request: WebhookRequest<HookdeckWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}

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

	const signature = Array.isArray(request.headers['x-hookdeck-signature'])
		? request.headers['x-hookdeck-signature'][0]
		: request.headers['x-hookdeck-signature'];
	const fallbackSignature = Array.isArray(
		request.headers['x-hookdeck-signature-2'],
	)
		? request.headers['x-hookdeck-signature-2'][0]
		: request.headers['x-hookdeck-signature-2'];

	if (!signature && !fallbackSignature) {
		return {
			valid: false,
			error: 'Missing x-hookdeck-signature or x-hookdeck-signature-2 header',
		};
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('base64');

	const isValidHeader = (value: string | undefined): boolean => {
		if (!value) return false;
		const received = Buffer.from(value);
		const expected = Buffer.from(expectedSignature);
		if (received.length !== expected.length) return false;
		return crypto.timingSafeEqual(received, expected);
	};

	const isPrimaryValid = isValidHeader(
		typeof signature === 'string' ? signature : undefined,
	);
	if (isPrimaryValid) {
		return { valid: true };
	}

	const isFallbackValid = isValidHeader(
		typeof fallbackSignature === 'string' ? fallbackSignature : undefined,
	);
	if (isFallbackValid) {
		return { valid: true };
	}

	return { valid: false, error: 'Invalid signature' };
}
