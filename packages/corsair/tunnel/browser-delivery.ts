import { createHmac, timingSafeEqual } from 'node:crypto';

export type BrowserDeliveryPayload = {
	jti: string;
	connectJti: string;
	projectId: string;
	code: string;
	state: string;
	redirectUri: string;
	plugin: string;
	tenantId: string;
	hubSuccessUrl: string;
	exp: number;
	iat: number;
};

function signPayload(payloadBase64: string, signingSecret: string): string {
	return createHmac('sha256', signingSecret)
		.update(payloadBase64)
		.digest('base64url');
}

export function verifyBrowserDeliveryToken(
	token: string,
	signingSecret: string,
): BrowserDeliveryPayload | null {
	if (!signingSecret.trim()) return null;

	const parts = token.split('.');
	if (parts.length !== 2) return null;

	const [payloadBase64, signature] = parts;
	if (!payloadBase64 || !signature) return null;

	const expected = signPayload(payloadBase64, signingSecret);
	try {
		if (
			!timingSafeEqual(
				Buffer.from(signature, 'utf8'),
				Buffer.from(expected, 'utf8'),
			)
		) {
			return null;
		}
	} catch {
		return null;
	}

	let payload: BrowserDeliveryPayload;
	try {
		payload = JSON.parse(
			Buffer.from(payloadBase64, 'base64url').toString('utf8'),
		) as BrowserDeliveryPayload;
	} catch {
		return null;
	}

	if (payload.exp * 1000 < Date.now()) return null;
	return payload;
}
