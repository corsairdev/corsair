import type { WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const WisepopsWebhookContactSchema = z.object({
	collected_at: z.string(),
	wisepop_id: z.number(),
	ip: z.string().optional(),
	country_code: z.string().optional(),
	form_session: z.string().optional(),
	fields: z.record(z.string(), z.unknown()).optional(),
});
export type WisepopsWebhookContact = z.infer<
	typeof WisepopsWebhookContactSchema
>;

export const WisepopsWebhookPayloadSchema = z.array(
	WisepopsWebhookContactSchema,
);
export type WisepopsWebhookPayload = z.infer<
	typeof WisepopsWebhookPayloadSchema
>;

function getHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === lower) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

export function verifyWisepopsWebhookSignature(
	request:
		| WebhookRequest<unknown>
		| {
				rawBody?: string | Buffer;
				headers: Record<string, string | string[] | undefined>;
		  },
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (rawBody === undefined || rawBody === null || rawBody === '') {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const sigHeader = getHeader(request.headers, 'x-wisepops-signature');
	if (!sigHeader) {
		return { valid: false, error: 'Missing x-wisepops-signature header' };
	}

	// Wisepops signs using HMAC-SHA256 hex digest (64 hex characters)
	if (!/^[0-9a-fA-F]{64}$/.test(sigHeader.trim())) {
		return { valid: false, error: 'Malformed signature header' };
	}

	const isValid = verifyHmacSignature(
		rawBody,
		secret,
		sigHeader.trim(),
		'sha256',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
