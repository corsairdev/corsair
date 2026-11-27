import type { KeyObject } from 'node:crypto';
import { createVerify, X509Certificate } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import {
	getPaypalWebhookPayloadSchema,
	paypalWebhookFor,
} from '../endpoints/openapi-schema';
import type { PaypalWebhookPayloads } from '../endpoints/operation-types';
import type { PaypalContext } from '../index';

/**
 * PayPal signs every delivery with its own certificate. The signed message is
 *
 *   <PAYPAL-TRANSMISSION-ID>|<PAYPAL-TRANSMISSION-TIME>|<webhook id>|<CRC32 of the raw body, decimal>
 *
 * signed SHA256withRSA (PAYPAL-AUTH-ALGO), base64 in PAYPAL-TRANSMISSION-SIG,
 * with the certificate at PAYPAL-CERT-URL. The webhook id (from
 * webhooks.create or the developer dashboard) is the secret this plugin is
 * given: a delivery for another webhook fails the check. The certificate URL
 * must be an https URL on a paypal.com host, and the certificate must be
 * issued to PayPal and within its dates.
 * https://developer.paypal.com/api/rest/webhooks/rest/#link-verifysignature
 */
const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

/** CRC-32 (IEEE) of the body's UTF-8 bytes, as PayPal computes it. */
export function crc32(text: string): number {
	let crc = 0xffffffff;
	for (const byte of Buffer.from(text, 'utf8')) {
		crc = (CRC_TABLE[(crc ^ byte) & 0xff] as number) ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

/** Whether PayPal's certificate URL is one this plugin will fetch. */
export function isPaypalCertUrl(raw: string): boolean {
	try {
		const url = new URL(raw);
		const host = url.hostname.toLowerCase();
		return (
			url.protocol === 'https:' &&
			!url.username &&
			!url.password &&
			(host === 'paypal.com' || host.endsWith('.paypal.com'))
		);
	} catch {
		return false;
	}
}

/** What verification needs from PayPal's certificate. */
export type PaypalCert = {
	publicKey: KeyObject;
	subject: string;
	validFrom: Date;
	validTo: Date;
};

const certCache = new Map<string, Promise<PaypalCert>>();

/** PayPal's certificate by URL, fetched once per process. */
export function fetchPaypalCert(url: string): Promise<PaypalCert> {
	let cert = certCache.get(url);
	if (!cert) {
		cert = fetch(url, { redirect: 'error' }).then(async (response) => {
			if (!response.ok) {
				throw new Error(`PayPal certificate fetch answered ${response.status}`);
			}
			const x509 = new X509Certificate(await response.text());
			return {
				publicKey: x509.publicKey,
				subject: x509.subject,
				validFrom: new Date(x509.validFrom),
				validTo: new Date(x509.validTo),
			};
		});
		cert.catch(() => certCache.delete(url));
		certCache.set(url, cert);
	}
	return cert;
}

export type PaypalWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export async function verifyPaypalWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	webhookId: string | undefined,
	loadCert: (url: string) => Promise<PaypalCert> = fetchPaypalCert,
	now: Date = new Date(),
): Promise<PaypalWebhookVerification> {
	if (request.hubVerified) return { valid: true };
	if (!webhookId) {
		return {
			valid: false,
			error:
				'No PayPal webhook id is set (plugin option webhookId or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const transmissionId = getHeader(request.headers, 'paypal-transmission-id');
	const transmissionTime = getHeader(
		request.headers,
		'paypal-transmission-time',
	);
	const signature = getHeader(request.headers, 'paypal-transmission-sig');
	const certUrl = getHeader(request.headers, 'paypal-cert-url');
	const algo = getHeader(request.headers, 'paypal-auth-algo') ?? '';
	if (!transmissionId || !transmissionTime || !signature || !certUrl) {
		return { valid: false, error: 'Missing PayPal transmission headers' };
	}
	if (!/^SHA256withRSA$/i.test(algo)) {
		return { valid: false, error: 'Unsupported PayPal auth algorithm' };
	}
	if (!isPaypalCertUrl(certUrl)) {
		return {
			valid: false,
			error: 'PayPal certificate URL is not on paypal.com',
		};
	}
	let certificate: PaypalCert;
	try {
		certificate = await loadCert(certUrl);
	} catch {
		return { valid: false, error: 'Could not load the PayPal certificate' };
	}
	if (
		now < certificate.validFrom ||
		now > certificate.validTo ||
		!/paypal/i.test(certificate.subject)
	) {
		return { valid: false, error: 'PayPal certificate is not valid' };
	}
	const message = `${transmissionId}|${transmissionTime}|${webhookId}|${crc32(request.rawBody)}`;
	const ok = createVerify('RSA-SHA256')
		.update(message)
		.verify(certificate.publicKey, signature, 'base64');
	return ok
		? { valid: true }
		: { valid: false, error: 'Invalid PayPal webhook signature' };
}

export type PaypalWebhookId = keyof PaypalWebhookPayloads;

const WEBHOOK_IDS = [
	'catalogProduct',
	'checkoutOrder',
	'dispute',
	'invoice',
	'other',
	'paymentAuthorization',
	'paymentCapture',
	'payout',
	'plan',
	'sale',
	'subscription',
	'vault',
] as const satisfies readonly PaypalWebhookId[];

/** The event_type of a delivery (`PAYMENT.CAPTURE.COMPLETED`), from its body. */
export function paypalEventTypeOf(
	request: Pick<RawWebhookRequest, 'body'>,
): string | undefined {
	let body = request.body;
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		} catch {
			return undefined;
		}
	}
	const eventType =
		typeof body === 'object' && body !== null && 'event_type' in body
			? (body as { event_type?: unknown }).event_type
			: undefined;
	return typeof eventType === 'string' ? eventType : undefined;
}

/** Which webhook handles an event type: the longest matching prefix, else `other`. */
export function webhookIdFor(eventType: string): PaypalWebhookId {
	let best: PaypalWebhookId = 'other';
	let bestLength = -1;
	for (const id of WEBHOOK_IDS) {
		for (const pattern of paypalWebhookFor(id).eventTypes) {
			const prefix = pattern.replace(/\*$/, '');
			if (
				prefix &&
				eventType.startsWith(prefix) &&
				prefix.length > bestLength
			) {
				best = id;
				bestLength = prefix.length;
			}
		}
	}
	return best;
}

/** A PayPal delivery: it carries the transmission headers and an event_type. */
export function isPaypalDelivery(request: RawWebhookRequest): boolean {
	return (
		getHeader(request.headers, 'paypal-transmission-id') !== undefined &&
		paypalEventTypeOf(request) !== undefined
	);
}

export type PaypalWebhook<Id extends PaypalWebhookId> = CorsairWebhook<
	PaypalContext,
	PaypalWebhookPayloads[Id],
	PaypalWebhookPayloads[Id]
>;

/**
 * One webhook per PayPal product. It matches its event types, checks the
 * signature against PayPal's certificate and the webhook id, and returns the
 * event parsed leniently. PayPal resends an event with the same `id`: use it
 * to skip one already handled.
 */
function paypalWebhook<Id extends PaypalWebhookId>(id: Id): PaypalWebhook<Id> {
	return {
		match: (request) => {
			if (!isPaypalDelivery(request)) return false;
			const eventType = paypalEventTypeOf(request);
			return eventType !== undefined && webhookIdFor(eventType) === id;
		},
		handler: async (ctx, request) => {
			const verification = await verifyPaypalWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = getPaypalWebhookPayloadSchema(id).safeParse(
				request.payload,
			);
			if (!parsed.success) {
				// Paths only: the payload holds payers' names, emails and amounts.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `PayPal ${id} payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as PaypalWebhookPayloads[Id];
			await logEventFromContext(
				ctx,
				`paypal.webhook.${id}`,
				// The event type and id only: the resource holds payer details.
				{
					eventType: paypalEventTypeOf({ body: request.payload }),
					transmissionId: getHeader(request.headers, 'paypal-transmission-id'),
				},
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const paypalWebhooksNested = {
	catalogProduct: paypalWebhook('catalogProduct'),
	checkoutOrder: paypalWebhook('checkoutOrder'),
	dispute: paypalWebhook('dispute'),
	invoice: paypalWebhook('invoice'),
	other: paypalWebhook('other'),
	paymentAuthorization: paypalWebhook('paymentAuthorization'),
	paymentCapture: paypalWebhook('paymentCapture'),
	payout: paypalWebhook('payout'),
	plan: paypalWebhook('plan'),
	sale: paypalWebhook('sale'),
	subscription: paypalWebhook('subscription'),
	vault: paypalWebhook('vault'),
} as const;

function describe(id: PaypalWebhookId): string {
	const webhook = paypalWebhookFor(id);
	return `${webhook.summary} (event_type ${webhook.eventTypes.join(', ')})`;
}

/** Schemas are getters, so a payload schema is built only when something reads it. */
function webhookSchemaEntry(id: PaypalWebhookId) {
	return {
		description: describe(id),
		get payload() {
			return getPaypalWebhookPayloadSchema(id);
		},
		get response() {
			return getPaypalWebhookPayloadSchema(id);
		},
	};
}

export const paypalWebhookSchemas = Object.fromEntries(
	WEBHOOK_IDS.map((id) => [id, webhookSchemaEntry(id)]),
) as { [Id in PaypalWebhookId]: ReturnType<typeof webhookSchemaEntry> };
