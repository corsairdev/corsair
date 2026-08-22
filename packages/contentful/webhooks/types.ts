import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';

export const ContentfulWebhookPayloadSchema = z
	.object({
		sys: z
			.object({
				type: z.string(),
				id: z.string(),
				space: z
					.object({
						sys: z.object({ id: z.string() }).passthrough(),
					})
					.passthrough()
					.optional(),
				environment: z
					.object({
						sys: z.object({ id: z.string() }).passthrough(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type ContentfulWebhookPayload = z.infer<
	typeof ContentfulWebhookPayloadSchema
>;

export type ContentfulWebhookOutputs = {
	entryPublish: ContentfulWebhookPayload;
	entryUnpublish: ContentfulWebhookPayload;
	assetPublish: ContentfulWebhookPayload;
	assetUnpublish: ContentfulWebhookPayload;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

/** Creates a webhook matcher that filters incoming requests by the specified Contentful topic. */
export function createContentfulMatch(topic: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headerTopic = request.headers['x-contentful-topic'];
		if (headerTopic && typeof headerTopic === 'string') {
			return headerTopic === topic;
		}
		return false;
	};
}

/** Verifies the authenticity of an incoming Contentful webhook using the HMAC-SHA256 canonical signature. */
export function verifyContentfulWebhookSignature(
	request: WebhookRequest<ContentfulWebhookPayload>,
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

	const header = request.headers['x-contentful-signature'];
	const signatureHeader = Array.isArray(header) ? header[0] : header;

	if (!signatureHeader || typeof signatureHeader !== 'string') {
		return { valid: false, error: 'Missing x-contentful-signature header' };
	}

	const timestampHeader = request.headers['x-contentful-timestamp'];
	const signedHeadersHeader = request.headers['x-contentful-signed-headers'];

	const timestamp = Array.isArray(timestampHeader)
		? timestampHeader[0]
		: timestampHeader;
	const signedHeadersStr = Array.isArray(signedHeadersHeader)
		? signedHeadersHeader[0]
		: signedHeadersHeader;

	if (!timestamp || !signedHeadersStr) {
		return {
			valid: false,
			error: 'Missing timestamp or signed-headers header',
		};
	}

	let method: string | undefined;
	for (const key of [
		'x-forwarded-method',
		'x-http-method',
		'x-original-method',
	]) {
		const val = request.headers[key];
		const str = Array.isArray(val) ? val[0] : val;
		if (str) {
			method = str;
			break;
		}
	}

	let path: string | undefined;
	for (const key of [
		'x-original-url',
		'x-rewrite-url',
		'x-envoy-original-path',
		'x-forwarded-uri',
		'x-original-uri',
	]) {
		const val = request.headers[key];
		const str = Array.isArray(val) ? val[0] : val;
		if (str) {
			path = str;
			break;
		}
	}

	if (!method || !path) {
		return {
			valid: false,
			error:
				'Direct Contentful webhooks require HTTP method and path for signature verification, which are not currently available in Corsair WebhookRequest unless proxy headers (e.g. x-envoy-original-path, x-forwarded-method) are present.',
		};
	}

	try {
		const signedHeadersList = signedHeadersStr.split(',');

		const headersToSign: Record<string, string> = {};
		for (const h of signedHeadersList) {
			const key = h.trim();
			if (!key) continue;

			let val = request.headers[key];
			if (Array.isArray(val)) val = val[0];

			if (val !== undefined) {
				headersToSign[key] = val;
			}
		}

		const sortedKeys = Object.keys(headersToSign).sort();
		const stringifiedHeaders = sortedKeys
			.map((key) => `${key}:${headersToSign[key]}`)
			.join(';');

		const stringifiedRequest = [method, path, stringifiedHeaders, rawBody].join(
			'\n',
		);

		const hmac = createHmac('sha256', secret);
		hmac.update(stringifiedRequest);
		const expectedSignature = hmac.digest('hex');

		// The Node.js crypto timingSafeEqual requires buffers of the same length
		const signatureBuffer = Buffer.from(signatureHeader, 'utf8');
		const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

		if (
			signatureBuffer.length === expectedBuffer.length &&
			timingSafeEqual(signatureBuffer, expectedBuffer)
		) {
			return { valid: true };
		}

		// Also check base64 just in case it is encoded that way
		const expectedSignatureBase64 = createHmac('sha256', secret)
			.update(stringifiedRequest)
			.digest('base64');
		const expectedBufferBase64 = Buffer.from(expectedSignatureBase64, 'utf8');
		if (
			signatureBuffer.length === expectedBufferBase64.length &&
			timingSafeEqual(signatureBuffer, expectedBufferBase64)
		) {
			return { valid: true };
		}

		return { valid: false, error: 'Invalid webhook signature' };
	} catch (e) {
		return { valid: false, error: 'Error computing signature' };
	}
}
