import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';
import { DocumentCardSchema } from '../endpoints/types';

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return isRecord(parsed) ? parsed : null;
		} catch {
			return null;
		}
	}
	return isRecord(body) ? body : null;
}

function getHeader(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== lower) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

function extractSvixSignatures(signatureHeader: string): string[] {
	return signatureHeader
		.split(' ')
		.map((part) => part.trim())
		.filter(Boolean)
		.flatMap((part) => {
			const [version, signature] = part.split(',', 2);
			return version === 'v1' && signature ? [signature] : [];
		});
}

export const DocumentGenerationSuccessEventSchema = z.object({
	type: z.literal('documents.generation.success').optional(),
	document: DocumentCardSchema.extend({
		status: z.literal('success'),
	}),
});

export type DocumentGenerationSuccessEvent = z.infer<
	typeof DocumentGenerationSuccessEventSchema
>;

export const DocumentGenerationFailureEventSchema = z.object({
	type: z.literal('documents.generation.failure').optional(),
	document: DocumentCardSchema.extend({
		status: z.literal('failure'),
	}),
});

export type DocumentGenerationFailureEvent = z.infer<
	typeof DocumentGenerationFailureEventSchema
>;

export type PDFMonkeyWebhookOutputs = {
	generationSuccess: DocumentGenerationSuccessEvent;
	generationFailure: DocumentGenerationFailureEvent;
};

export function createPDFMonkeyMatch(
	status: 'success' | 'failure',
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!getHeader(request.headers, 'svix-signature')) return false;
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		const document = parsedBody.document;
		return isRecord(document) && document.status === status;
	};
}

export function matchPDFMonkeyPluginWebhook(
	request: RawWebhookRequest,
): boolean {
	if (!getHeader(request.headers, 'svix-signature')) return false;
	if (!getHeader(request.headers, 'svix-id')) return false;
	if (!getHeader(request.headers, 'svix-timestamp')) return false;
	const parsedBody = parseBody(request.body);
	if (!parsedBody) return false;
	const document = parsedBody.document;
	return (
		isRecord(document) &&
		typeof document.id === 'string' &&
		typeof document.status === 'string'
	);
}

export function verifyPDFMonkeyWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
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

	const svixId = getHeader(request.headers, 'svix-id');
	const svixTimestamp = getHeader(request.headers, 'svix-timestamp');
	const svixSignature = getHeader(request.headers, 'svix-signature');

	if (!svixId) {
		return { valid: false, error: 'Missing svix-id header' };
	}
	if (!svixTimestamp) {
		return { valid: false, error: 'Missing svix-timestamp header' };
	}
	if (!svixSignature) {
		return { valid: false, error: 'Missing svix-signature header' };
	}

	const timestampMs = Number.parseInt(svixTimestamp, 10) * 1000;
	if (
		Number.isNaN(timestampMs) ||
		Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000
	) {
		return { valid: false, error: 'Webhook timestamp is too old or invalid' };
	}

	if (!secret.startsWith('whsec_')) {
		return { valid: false, error: 'Malformed webhook secret' };
	}
	const secretBase64 = secret.slice('whsec_'.length);
	if (!secretBase64) {
		return { valid: false, error: 'Malformed webhook secret' };
	}

	const signatures = extractSvixSignatures(svixSignature);
	if (signatures.length === 0) {
		return { valid: false, error: 'Malformed svix-signature header' };
	}

	const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
	const expected = createHmac('sha256', Buffer.from(secretBase64, 'base64'))
		.update(signedContent)
		.digest();

	const isValid = signatures.some((signature) => {
		const received = Buffer.from(signature, 'base64');
		return (
			received.length === expected.length && timingSafeEqual(received, expected)
		);
	});

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
