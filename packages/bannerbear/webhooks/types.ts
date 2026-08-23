import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

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

export const ImageCompletedEventSchema = z
	.object({
		uid: z.string(),
		status: z.literal('completed'),
		template: z.string().optional(),
		files: z.record(z.string(), z.string().nullable()).optional(),
		metadata: z.string().optional(),
		self: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().optional(),
	})
	.loose();

export type ImageCompletedEvent = z.infer<typeof ImageCompletedEventSchema>;

export const AnimationCompletedEventSchema = z
	.object({
		uid: z.string(),
		status: z.literal('completed'),
		template: z.string().optional(),
		files: z.record(z.string(), z.string().nullable()).optional(),
		progress: z.number().optional(),
		metadata: z.string().optional(),
		self: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().optional(),
	})
	.loose();

export type AnimationCompletedEvent = z.infer<
	typeof AnimationCompletedEventSchema
>;

export type BannerbearWebhookOutputs = {
	imageCompleted: ImageCompletedEvent;
	animationCompleted: AnimationCompletedEvent;
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

function fileKeys(files: unknown): string[] {
	if (files === null || typeof files !== 'object' || Array.isArray(files)) {
		return [];
	}
	return Object.keys(files);
}

function isAnimationFiles(files: unknown): boolean {
	const keys = fileKeys(files);
	return keys.includes('mp4') || keys.includes('mov');
}

export function createBannerbearImageCompletedMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return (
			parsedBody.status === 'completed' &&
			'files' in parsedBody &&
			!isAnimationFiles(parsedBody.files)
		);
	};
}

export function createBannerbearAnimationCompletedMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return (
			parsedBody.status === 'completed' && isAnimationFiles(parsedBody.files)
		);
	};
}

function headerValue(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = headers[name];
	if (Array.isArray(value)) return value[0];
	return value;
}

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

export function verifyBannerbearWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified) {
		return { valid: true };
	}

	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const authHeader = headerValue(request.headers, 'authorization');

	if (authHeader) {
		const token = authHeader.startsWith('Bearer ')
			? authHeader.slice(7).trim()
			: authHeader.trim();
		if (safeEqual(token, webhookSecret)) {
			return { valid: true };
		}
	}

	const signature =
		headerValue(request.headers, 'x-bannerbear-signature') ||
		headerValue(request.headers, 'x-webhook-signature') ||
		headerValue(request.headers, 'signature');

	if (signature && request.rawBody) {
		const isValid = verifyHmacSignature(
			request.rawBody,
			webhookSecret,
			signature,
			'sha256',
		);
		if (isValid) {
			return { valid: true };
		}
	}

	if (!authHeader && !signature) {
		return {
			valid: false,
			error: 'Missing Authorization or webhook signature header',
		};
	}

	return { valid: false, error: 'Invalid webhook credentials or signature' };
}

export function isBannerbearCompletionPayload(body: unknown): boolean {
	const parsed = parseBody(body);
	if (!parsed) return false;
	return (
		typeof parsed.uid === 'string' &&
		typeof parsed.status === 'string' &&
		'files' in parsed
	);
}
