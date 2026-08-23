import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// Bannerbear webhook payloads are the completed resource objects themselves.
// When an image/video/collection completes, Bannerbear POSTs the final object
// to the webhook_url that was provided at creation time.

export const BannerbearWebhookPayloadSchema = z
	.object({
		uid: z.string(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().optional(),
	})
	.loose();

export type BannerbearWebhookPayload = z.infer<
	typeof BannerbearWebhookPayloadSchema
>;

// ─── Image Completed Event ───────────────────────────────────
export const ImageCompletedEventSchema = z
	.object({
		uid: z.string(),
		status: z.literal('completed'),
		template: z.string().optional(),
		files: z
			.object({
				png: z.string().optional(),
				jpg: z.string().optional(),
				pdf: z.string().optional(),
			})
			.optional(),
		metadata: z.string().optional(),
		self: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().optional(),
	})
	.loose();

export type ImageCompletedEvent = z.infer<typeof ImageCompletedEventSchema>;

// ─── Video Completed Event ───────────────────────────────────
export const VideoCompletedEventSchema = z
	.object({
		uid: z.string(),
		status: z.literal('completed'),
		video_url: z.string().optional(),
		preview_url: z.string().optional(),
		percent_rendered: z.number().optional(),
		self: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().optional(),
	})
	.loose();

export type VideoCompletedEvent = z.infer<typeof VideoCompletedEventSchema>;

// ─── Aggregate types ─────────────────────────────────────────
export type BannerbearWebhookOutputs = {
	imageCompleted: ImageCompletedEvent;
	videoCompleted: VideoCompletedEvent;
};

// ─── Matchers & Verification ─────────────────────────────────
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

export function createBannerbearImageCompletedMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		// Image completed: has status=completed and files field (images have files, videos have video_url)
		return parsedBody.status === 'completed' && 'files' in parsedBody;
	};
}

export function createBannerbearVideoCompletedMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		// Video completed: has status=completed and video_url field
		return parsedBody.status === 'completed' && 'video_url' in parsedBody;
	};
}

export function verifyBannerbearWebhookSignature(
	_request: WebhookRequest<BannerbearWebhookPayload>,
	_secret: string,
): { valid: boolean; error?: string } {
	// Bannerbear does not use webhook signature verification.
	// Webhooks are secured by keeping the webhook URL secret.
	return { valid: true };
}
