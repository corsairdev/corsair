import { createHmac, timingSafeEqual } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';

const TIMESTAMP_TOLERANCE_SEC = 5 * 60;

export type SignatureResult =
	| { valid: true; timestamp: string }
	| { valid: false; error: string };

function headerValue(
	headers: WebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		if (Array.isArray(value)) return value[0];
		return value;
	}
	return undefined;
}

export function verifySaperlySignature(
	request: Pick<WebhookRequest, 'headers' | 'rawBody'>,
	secret: string | undefined,
	nowSec = Math.floor(Date.now() / 1000),
): SignatureResult {
	if (!secret) {
		return { valid: false, error: 'Webhook signing secret is not configured' };
	}
	const timestamp = headerValue(request.headers, 'x-saperly-timestamp');
	const signature = headerValue(request.headers, 'x-saperly-signature');
	if (!timestamp || !signature) {
		return { valid: false, error: 'Missing Saperly signature headers' };
	}
	const timestampSec = Number(timestamp);
	if (!Number.isInteger(timestampSec)) {
		return { valid: false, error: 'Saperly timestamp is not unix seconds' };
	}
	if (Math.abs(nowSec - timestampSec) > TIMESTAMP_TOLERANCE_SEC) {
		return {
			valid: false,
			error: 'Saperly timestamp is outside the 5 minute window',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Raw webhook body unavailable' };
	}
	const provided = signature.startsWith('v1=') ? signature.slice(3) : '';
	if (!/^[0-9a-f]+$/i.test(provided)) {
		return { valid: false, error: 'Saperly signature is not v1 hex' };
	}
	const expected = createHmac('sha256', secret)
		.update(`${timestamp}.${request.rawBody}`)
		.digest('hex');
	const providedBuf = Buffer.from(provided, 'hex');
	const expectedBuf = Buffer.from(expected, 'hex');
	if (providedBuf.length !== expectedBuf.length) {
		return { valid: false, error: 'Saperly signature mismatch' };
	}
	if (!timingSafeEqual(providedBuf, expectedBuf)) {
		return { valid: false, error: 'Saperly signature mismatch' };
	}
	return { valid: true, timestamp };
}
