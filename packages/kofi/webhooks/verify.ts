import { timingSafeEqual } from 'node:crypto';

/**
 * Ko-fi's only developer surface is an outbound payment webhook. There is no
 * REST API: `api.ko-fi.com` does not resolve, and the help page says the API
 * "is currently limited to when a payment is made".
 * Reference: https://help.ko-fi.com/hc/en-us/articles/360004162298
 *
 * A delivery is `application/x-www-form-urlencoded` with a single `data` field
 * whose value is a JSON string. The `verification_token` inside that JSON is the
 * only way to tell a real delivery from a spoofed one, so it is compared in
 * constant time here.
 */

/** The four payment types Ko-fi documents. */
export const KOFI_PAYMENT_TYPES = [
	'Donation',
	'Subscription',
	'Shop Order',
	'Commission',
] as const;

export type KofiPaymentType = (typeof KOFI_PAYMENT_TYPES)[number];

/**
 * The body arrives either as the raw form string core passed through, or as an
 * object when a caller already parsed it. Both yield the payment JSON.
 */
// unknown: a delivery body is either a form-encoded string or an already parsed
// object, and its JSON has a shape per payment type.
export function readPayment(rawBody: unknown): Record<string, unknown> | null {
	if (
		rawBody !== null &&
		typeof rawBody === 'object' &&
		!Array.isArray(rawBody)
	) {
		const record = rawBody as Record<string, unknown>;
		// Already-parsed form bodies arrive as `{ data: '<json>' }`.
		const data = record.data;
		if (typeof data === 'string') return parseJsonObject(data);
		return record;
	}

	if (typeof rawBody !== 'string' || rawBody.length === 0) return null;

	// The documented transport: one `data` form field holding JSON.
	const form = new URLSearchParams(rawBody);
	const data = form.get('data');
	if (data !== null) return parseJsonObject(data);

	// A caller that posted the JSON directly still works.
	return parseJsonObject(rawBody);
}

// unknown: JSON.parse returns any shape; only a plain object is kept, and the
// payment's fields are checked one at a time by the callers.
function parseJsonObject(text: string): Record<string, unknown> | null {
	try {
		const parsed: unknown = JSON.parse(text);
		if (
			parsed === null ||
			typeof parsed !== 'object' ||
			Array.isArray(parsed)
		) {
			return null;
		}
		return parsed as Record<string, unknown>;
	} catch {
		return null;
	}
}

/** Reads the token a delivery claims, when it carries one. */
// unknown: the payment object's fields are checked one at a time.
export function tokenOf(payment: Record<string, unknown>): string | undefined {
	const token = payment.verification_token;
	return typeof token === 'string' && token.length > 0 ? token : undefined;
}

function safeEqual(left: string, right: string): boolean {
	// Compare bytes: two strings of equal length can differ in byte length, and
	// timingSafeEqual throws on buffers of different sizes.
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

export type KofiVerification =
	| { valid: true }
	| { valid: false; error: string; statusCode: number };

/**
 * Compares the delivery's token to the stored one.
 *
 * With no secret configured the delivery is refused rather than accepted: an
 * unverified payment notification is worse than a rejected one, because a
 * caller would otherwise act on whoever posted to the URL.
 */
// unknown: the payment is not schema-parsed yet; only its verification_token
// is read here, and the full schema runs after the token matches.
export function verifyKofiPayment(
	payment: Record<string, unknown> | null,
	secret: string | undefined,
): KofiVerification {
	if (!payment) {
		return {
			valid: false,
			error: 'Ko-fi delivery is not a form-encoded `data` field or JSON object',
			statusCode: 400,
		};
	}
	if (!secret) {
		return {
			valid: false,
			error:
				'No Ko-fi verification token is configured, so the delivery cannot be trusted',
			statusCode: 401,
		};
	}
	const token = tokenOf(payment);
	if (!token) {
		return {
			valid: false,
			error: 'Ko-fi delivery has no verification_token',
			statusCode: 401,
		};
	}
	if (!safeEqual(token, secret)) {
		return {
			valid: false,
			error: 'Ko-fi verification_token does not match',
			statusCode: 401,
		};
	}
	return { valid: true };
}

/** True when a body looks like a Ko-fi payment rather than another provider's. */
// unknown: the body is untyped until readPayment narrows it.
export function looksLikeKofiPayment(rawBody: unknown): boolean {
	const payment = readPayment(rawBody);
	if (!payment) return false;
	const type = payment.type;
	return (
		typeof type === 'string' &&
		(KOFI_PAYMENT_TYPES as readonly string[]).includes(type)
	);
}
