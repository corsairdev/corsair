import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { asRecord, getHeader } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const CoinbaseNotificationSchema = z
	.object({
		id: z.string().optional(),
		type: z.string(),
		data: z.record(z.string(), z.unknown()).optional(),
		user: z
			.object({
				id: z.string().optional(),
				resource: z.string().optional(),
				resource_path: z.string().optional(),
			})
			.loose()
			.optional(),
		account: z
			.object({
				id: z.string().optional(),
				resource: z.string().optional(),
				resource_path: z.string().optional(),
			})
			.loose()
			.optional(),
		delivery_attempts: z.number().optional(),
		created_at: z.string().optional(),
		resource: z.string().optional(),
		resource_path: z.string().optional(),
	})
	.loose();

export type CoinbaseNotification = z.infer<typeof CoinbaseNotificationSchema>;

export const PingEventSchema = CoinbaseNotificationSchema.extend({
	type: z.literal('ping'),
});
export type PingEvent = z.infer<typeof PingEventSchema>;

export const WalletAddressesNewPaymentEventSchema =
	CoinbaseNotificationSchema.extend({
		type: z.literal('wallet:addresses:new-payment'),
	});
export type WalletAddressesNewPaymentEvent = z.infer<
	typeof WalletAddressesNewPaymentEventSchema
>;

export type CoinbaseWebhookOutputs = {
	ping: PingEvent;
	newPayment: WalletAddressesNewPaymentEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return asRecord(parsed);
		} catch {
			return null;
		}
	}
	return asRecord(body);
}

export function createCoinbaseMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function coinbaseSignatureHeader(
	headers: Record<string, string | string[] | undefined>,
): string | undefined {
	return (
		getHeader(headers, 'cb-signature') ??
		getHeader(headers, 'x-cc-webhook-signature')
	);
}

export function verifyCoinbaseWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
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

	const signature = coinbaseSignatureHeader(request.headers);
	if (!signature) {
		return { valid: false, error: 'Missing CB-SIGNATURE header' };
	}

	if (!verifyHmacSignature(rawBody, secret, signature, 'sha256')) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
