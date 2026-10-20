import { createHmac, timingSafeEqual } from 'node:crypto';

const TOLERANCE_SECONDS = 300;

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string {
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) return value[0] ?? '';
	return value ?? '';
}

export function verifyOrbitSignature(
	secret: string,
	headers: Record<string, string | string[] | undefined>,
	rawBody: string,
): boolean {
	const timestamp = headerValue(headers, 'x-orbit-webhook-timestamp');
	const signature = headerValue(headers, 'x-orbit-webhook-signature');
	const age = Math.abs(Date.now() / 1000 - Number(timestamp));
	if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;
	const expected = `sha256=${createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')}`;
	const left = Buffer.from(expected);
	const right = Buffer.from(signature);
	return left.length === right.length && timingSafeEqual(left, right);
}
