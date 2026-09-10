import { timingSafeEqual } from 'node:crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

function isUnsafeBracketKey(key: string): boolean {
	return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

function assignBracketPath(
	target: Record<string, unknown>,
	rawKey: string,
	value: string,
): void {
	const firstBracket = rawKey.indexOf('[');
	if (firstBracket === -1) {
		if (isUnsafeBracketKey(rawKey)) return;
		target[rawKey] = value;
		return;
	}

	const segments = [rawKey.slice(0, firstBracket)];
	const bracketed = rawKey.slice(firstBracket);
	for (let i = 0; i < bracketed.length; ) {
		if (bracketed[i] !== '[') break;
		const end = bracketed.indexOf(']', i);
		if (end === -1) break;
		segments.push(bracketed.slice(i + 1, end));
		i = end + 1;
	}

	if (segments.some((s) => isUnsafeBracketKey(s))) return;

	let cursor: Record<string, unknown> = target;
	for (const key of segments.slice(0, -1)) {
		if (isUnsafeBracketKey(key)) return;
		const existing = cursor[key];
		if (existing === null || typeof existing !== 'object') {
			cursor[key] = {};
		}
		cursor = cursor[key] as Record<string, unknown>;
	}

	const lastKey = segments[segments.length - 1];
	if (lastKey !== undefined) {
		if (isUnsafeBracketKey(lastKey)) return;
		cursor[lastKey] = value;
	}
}

function nestBracketKeys(
	record: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(record)) {
		if (key.includes('[')) {
			assignBracketPath(result, key, String(value ?? ''));
		} else if (!isUnsafeBracketKey(key)) {
			result[key] = value;
		}
	}
	return result;
}

export function parseWaboxappWebhookBody(
	body: unknown,
): Record<string, unknown> | null {
	if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
		return nestBracketKeys(body as Record<string, unknown>);
	}
	if (typeof body !== 'string') {
		return null;
	}

	const trimmed = body.trim();
	if (!trimmed) return null;

	if (trimmed.startsWith('{')) {
		try {
			const parsed = JSON.parse(trimmed) as unknown;
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? nestBracketKeys(parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}

	const params = new URLSearchParams(trimmed);
	const result: Record<string, unknown> = {};
	let sawKey = false;
	for (const [key, value] of params) {
		sawKey = true;
		assignBracketPath(result, key, value);
	}
	return sawKey ? result : null;
}

const MessageBodySchema = z.record(z.string(), z.unknown()).optional();

export const WaboxappWebhookPayloadSchema = z.object({
	event: z.string(),
	token: z.string(),
	uid: z.string(),
	contact: z
		.object({
			uid: z.string(),
			name: z.string().optional(),
			type: z.string().optional(),
		})
		.optional(),
	message: z
		.object({
			dtm: z.string().optional(),
			uid: z.string().optional(),
			cuid: z.string().optional(),
			dir: z.string().optional(),
			type: z.string().optional(),
			body: MessageBodySchema,
			ack: z.string().optional(),
		})
		.optional(),
	muid: z.string().optional(),
	cuid: z.string().optional(),
	ack: z.string().optional(),
});

export type WaboxappWebhookPayload = z.infer<
	typeof WaboxappWebhookPayloadSchema
>;

export const MessageEventSchema = WaboxappWebhookPayloadSchema.extend({
	event: z.literal('message'),
});

export type MessageEvent = z.infer<typeof MessageEventSchema>;

export const AckEventSchema = WaboxappWebhookPayloadSchema.extend({
	event: z.literal('ack'),
});

export type AckEvent = z.infer<typeof AckEventSchema>;

export type WaboxappWebhookOutputs = {
	message: MessageEvent;
	ack: AckEvent;
};

export function createWaboxappMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseWaboxappWebhookBody(request.body);
		return body !== null && body.event === eventType;
	};
}

export function isWaboxappWebhookPayload(
	body: Record<string, unknown> | null,
): boolean {
	if (!body) return false;
	if (typeof body.token !== 'string' || typeof body.uid !== 'string') {
		return false;
	}
	return body.event === 'message' || body.event === 'ack';
}

export function verifyWaboxappWebhookToken(
	request: { payload: { token?: unknown } },
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}
	const provided = request.payload.token;
	if (typeof provided !== 'string') {
		return { valid: false, error: 'Invalid webhook token' };
	}
	const providedBuf = Buffer.from(provided);
	const secretBuf = Buffer.from(secret);
	if (providedBuf.length !== secretBuf.length) {
		return { valid: false, error: 'Invalid webhook token' };
	}
	const valid = timingSafeEqual(providedBuf, secretBuf);
	return valid
		? { valid: true }
		: { valid: false, error: 'Invalid webhook token' };
}
