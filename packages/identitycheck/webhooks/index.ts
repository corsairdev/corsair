import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { IdentityCheckContext } from '..';

// Nested screening details are open objects in StackGo's published OpenAPI.
export const VerificationDecisionSchema = z
	.object({
		type: z.literal('verification.decision'),
		id: z.string(),
		result: z.string(),
		adverse_media_results: z.record(z.string(), z.unknown()).optional(),
		sanctions_results: z.record(z.string(), z.unknown()).optional(),
		result_info: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type VerificationDecision = z.infer<typeof VerificationDecisionSchema>;

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}
export function matchIdentityCheckWebhook(request: RawWebhookRequest): boolean {
	let body = request.body;
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		} catch {
			return false;
		}
	}
	return (
		!!header(request.headers, 'svix-signature') &&
		VerificationDecisionSchema.safeParse(body).success
	);
}
export function verifyIdentityCheckSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): boolean {
	const id = header(request.headers, 'svix-id');
	const timestamp = header(request.headers, 'svix-timestamp');
	const signatures = header(request.headers, 'svix-signature');
	if (
		!id ||
		!timestamp ||
		!signatures ||
		!request.rawBody ||
		!secret.startsWith('whsec_')
	)
		return false;
	if (
		!/^\d+$/.test(timestamp) ||
		Math.abs(Date.now() - Number(timestamp) * 1000) > 300000
	)
		return false;
	const encoded = secret.slice(6);
	if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return false;
	const key = Buffer.from(encoded, 'base64');
	if (!key.length) return false;
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${request.rawBody}`)
		.digest();
	return signatures.split(/\s+/).some((entry) => {
		const [version, signature] = entry.split(',');
		if (version !== 'v1' || !signature) return false;
		const candidate = Buffer.from(signature, 'base64');
		return (
			candidate.length === expected.length &&
			timingSafeEqual(candidate, expected)
		);
	});
}
export const decision: CorsairWebhook<
	IdentityCheckContext,
	VerificationDecision,
	VerificationDecision
> = {
	match: matchIdentityCheckWebhook,
	handler: async (ctx, request) => {
		if (
			request.hubVerified !== true &&
			!verifyIdentityCheckSignature(request, ctx.key)
		)
			return {
				success: false,
				statusCode: 401,
				error: 'Invalid webhook signature',
			};
		// Parse the verified bytes, not a potentially unrelated parsed payload.
		try {
			if (!request.rawBody) throw new Error('Missing raw body');
			return {
				success: true,
				data: VerificationDecisionSchema.parse(JSON.parse(request.rawBody)),
			};
		} catch {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid webhook payload',
			};
		}
	},
};
