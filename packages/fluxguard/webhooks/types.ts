import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ── Verification ──────────────────────────────────────────────────────────
//
// Fluxguard signs every delivery with the webhook's secret key:
// `fluxguard-signature: t=<unix seconds>,v1=<hex HMAC-SHA256>` over the string
// `<t>.<raw body>`. See
// https://www.fluxguard.com/how-to-guides/use-webhooks-to-integrate-web-change-notifications
//
// The secret is per webhook URL, shown in Account Settings next to it. It is
// the plugin's `webhookSecret` option, or the one stored with
// keys.set_webhook_signature.

/** Header carrying the timestamp and signature. */
export const FLUXGUARD_SIGNATURE_HEADER = 'fluxguard-signature';

/**
 * Fluxguard's sample verifier rejects a timestamp more than a minute off. Five
 * minutes leaves room for a receiving server whose clock has drifted.
 */
export const FLUXGUARD_SIGNATURE_TOLERANCE_SECONDS = 60 * 5;

function headerValue(
	// Header values are string | string[] | undefined depending on the adapter.
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

function safeEqualHex(left: string, right: string): boolean {
	// timingSafeEqual throws on unequal lengths, and a hex digest is ASCII.
	const a = Buffer.from(left, 'utf8');
	const b = Buffer.from(right, 'utf8');
	return a.length === b.length && timingSafeEqual(a, b);
}

/** Splits `t=123,v1=abc` into its parts. Unknown parts are ignored. */
export function parseSignatureHeader(header: string | undefined): {
	timestamp?: string;
	signature?: string;
} {
	if (!header) return {};
	const parts: Record<string, string> = {};
	for (const pair of header.split(',')) {
		const index = pair.indexOf('=');
		if (index === -1) continue;
		parts[pair.slice(0, index).trim()] = pair.slice(index + 1).trim();
	}
	return { timestamp: parts.t, signature: parts.v1 };
}

/**
 * The exact bytes Fluxguard signed. `rawBody` is the untouched request text;
 * re-serialising `request.payload` would change key order and whitespace and
 * every signature would fail.
 */
export function signedPayload(
	timestamp: string,
	// unknown: the body arrives as text, or already parsed when a framework
	// mounted a JSON parser before the webhook route.
	body: unknown,
): string | undefined {
	const raw = typeof body === 'string' ? body : undefined;
	return raw === undefined ? undefined : `${timestamp}.${raw}`;
}

export function verifyFluxguardSignature(
	// unknown: this reads headers and the raw body only.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	now: number = Date.now(),
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };

	const expected = secret?.trim();
	if (!expected) {
		return {
			valid: false,
			error:
				'No Fluxguard webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}

	const { timestamp, signature } = parseSignatureHeader(
		headerValue(request.headers, FLUXGUARD_SIGNATURE_HEADER),
	);
	if (!timestamp || !signature) {
		return {
			valid: false,
			error: `Missing or malformed ${FLUXGUARD_SIGNATURE_HEADER} header`,
		};
	}

	const sentAt = Number(timestamp);
	if (!Number.isFinite(sentAt)) {
		return {
			valid: false,
			error: `${FLUXGUARD_SIGNATURE_HEADER} has a non-numeric timestamp`,
		};
	}
	if (Math.abs(now / 1000 - sentAt) > FLUXGUARD_SIGNATURE_TOLERANCE_SECONDS) {
		return {
			valid: false,
			error: `${FLUXGUARD_SIGNATURE_HEADER} timestamp is outside the replay window`,
		};
	}

	const body = signedPayload(timestamp, request.rawBody);
	if (body === undefined) {
		return {
			valid: false,
			error:
				'The raw webhook body is required to verify the signature; mount the webhook route without a JSON parser',
		};
	}

	const computed = createHmac('sha256', expected).update(body).digest('hex');
	if (!safeEqualHex(computed, signature)) {
		return { valid: false, error: 'Invalid webhook signature' };
	}
	return { valid: true };
}

// ── Payload ───────────────────────────────────────────────────────────────

const categoryNames = z
	.array(z.string())
	.describe('Category names, e.g. ["News"]');

/**
 * One detected change. Fluxguard sends exactly this shape whether it was
 * triggered by a crawl, a schedule or a manual run; there is no event-type
 * field to branch on, so one handler covers every delivery.
 */
export const FluxguardChangeEventSchema = z
	.object({
		url: z.string().nullish().describe('URL where the change was detected'),
		finalUrl: z.string().nullish().describe('URL after redirects'),
		capturedAt: z.string().nullish().describe('When the version was captured'),
		comparisonType: z
			.string()
			.nullish()
			.describe('HTML, visual, text or network'),
		orgId: z.string().nullish(),
		orgName: z.string().nullish(),
		title: z.string().nullish().describe('Title of the page'),
		statusCode: z.number().nullish(),
		aiFlagged: z
			.string()
			.nullish()
			.describe('warning for a significant change, serenity otherwise'),
		summary: z
			.string()
			.nullish()
			.describe('AI summary of the captured version'),
		diffSummary: z
			.string()
			.nullish()
			.describe('AI summary of what changed since the previous version'),
		diffUrl: z.string().nullish().describe('Console URL for this version'),
		fileBaseUrl: z
			.string()
			.nullish()
			.describe('Prefix to append every filename under files to'),
		site: z
			.object({
				id: z.string().nullish(),
				origin: z.string().nullish(),
				nickname: z.string().nullish(),
			})
			.loose()
			.nullish(),
		session: z
			.object({
				id: z.string().nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		page: z
			.object({
				id: z.string().nullish(),
				path: z.string().nullish(),
			})
			.loose()
			.nullish(),
		siteCategories: categoryNames.nullish(),
		pageCategories: categoryNames.nullish(),
		// unknown: the file map is provider-defined. `files.captures` holds
		// filenames and `files.diffs` mixes filenames with a boolean `net` flag.
		files: z.record(z.string(), z.unknown()).nullish(),
		// unknown: alarms are account-defined and carry arbitrary values.
		alarms: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type FluxguardChangeEvent = z.infer<typeof FluxguardChangeEventSchema>;

export type FluxguardWebhookOutputs = {
	changeDetected: FluxguardChangeEvent;
};

// ── Matching ──────────────────────────────────────────────────────────────

/**
 * Fluxguard posts a bare change object, so there is no type discriminator: a
 * delivery is ours when it carries the signature header, or when it has the
 * two fields every change event has.
 */
export const matchFluxguardWebhook: CorsairWebhookMatcher = (request) => {
	if (headerValue(request.headers, FLUXGUARD_SIGNATURE_HEADER) !== undefined) {
		return true;
	}
	const body = bodyRecord(request.body);
	return body !== null && 'url' in body && 'capturedAt' in body;
};

/**
 * `readBodyRecord` only accepts an already-parsed object, and a matcher runs
 * before the route parses the payload, so a raw body has to be parsed here.
 */
function bodyRecord(
	// unknown: the body arrives as text or as an object parsed by the framework.
	body: unknown,
): Record<string, unknown> | null {
	const parsed =
		typeof body === 'string'
			? (() => {
					try {
						return JSON.parse(body) as unknown;
					} catch {
						return undefined;
					}
				})()
			: body;
	return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
		? (parsed as Record<string, unknown>)
		: null;
}
