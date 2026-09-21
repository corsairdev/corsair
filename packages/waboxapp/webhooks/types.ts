import { timingSafeEqual } from 'node:crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

function isUnsafeBracketKey(key: string): boolean {
	return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

// unknown justified: schema validating untyped dictionary reference without cloning.
const RecordSchema = z.custom<Record<string, unknown>>(
	(val) => typeof val === 'object' && val !== null && !Array.isArray(val),
);

function assignBracketPath(
	// unknown justified: target dictionary receiving bracket-expanded properties.
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

	// unknown justified: cursor pointer navigating nested dynamic dictionary.
	let cursor: Record<string, unknown> = target;
	for (const key of segments.slice(0, -1)) {
		if (isUnsafeBracketKey(key)) return;
		// unknown justified: property access on dynamic dictionary yields untyped value.
		const existing: unknown = cursor[key];
		const parsedExisting = RecordSchema.safeParse(existing);
		if (parsedExisting.success) {
			cursor = parsedExisting.data;
		} else {
			// unknown justified: intermediate dictionary container for nested bracket path.
			const next: Record<string, unknown> = {};
			cursor[key] = next;
			cursor = next;
		}
	}

	const lastKey = segments[segments.length - 1];
	if (lastKey !== undefined) {
		if (isUnsafeBracketKey(lastKey)) return;
		cursor[lastKey] = value;
	}
}

function nestBracketKeys(
	// unknown justified: dictionary containing untyped key-value pairs before bracket expansion.
	record: Record<string, unknown>,
	// unknown justified: dictionary containing nested structure after bracket expansion.
): Record<string, unknown> {
	// unknown justified: output dictionary containing transformed entries.
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
	// unknown justified: webhook boundary accepts raw strings, parsed objects, or untyped HTTP bodies.
	body: unknown,
	// unknown justified: returns nested dictionary of payload attributes or null on invalid format.
): Record<string, unknown> | null {
	const recordResult = RecordSchema.safeParse(body);
	if (recordResult.success) {
		return nestBracketKeys(recordResult.data);
	}

	const stringResult = z.string().safeParse(body);
	if (!stringResult.success) {
		return null;
	}

	const trimmed = stringResult.data.trim();
	if (!trimmed) return null;

	if (trimmed.startsWith('{')) {
		try {
			// unknown justified: parsed JSON payload is untyped before schema validation.
			const parsed: unknown = JSON.parse(trimmed);
			const parsedRecord = RecordSchema.safeParse(parsed);
			return parsedRecord.success ? nestBracketKeys(parsedRecord.data) : null;
		} catch {
			return null;
		}
	}

	const params = new URLSearchParams(trimmed);
	// unknown justified: dictionary collecting parsed query parameters from form body.
	const result: Record<string, unknown> = {};
	let sawKey = false;
	for (const [key, value] of params) {
		sawKey = true;
		assignBracketPath(result, key, value);
	}
	return sawKey ? result : null;
}

// unknown justified: message body dictionary allows arbitrary WhatsApp payload fields.
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
	// unknown justified: webhook body dictionary containing untyped fields before verification.
	body: Record<string, unknown> | null,
): boolean {
	if (!body) return false;
	const tokenResult = z.string().safeParse(body.token);
	const uidResult = z.string().safeParse(body.uid);
	if (!tokenResult.success || !uidResult.success) {
		return false;
	}
	return body.event === 'message' || body.event === 'ack';
}

export function verifyWaboxappWebhookToken(
	request: {
		payload: {
			// unknown justified: webhook token field is untyped before string schema validation.
			token?: unknown;
		};
	},
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}
	const tokenResult = z.string().safeParse(request.payload.token);
	if (!tokenResult.success) {
		return { valid: false, error: 'Invalid webhook token' };
	}
	const providedBuf = Buffer.from(tokenResult.data);
	const secretBuf = Buffer.from(secret);
	if (providedBuf.length !== secretBuf.length) {
		return { valid: false, error: 'Invalid webhook token' };
	}
	const valid = timingSafeEqual(providedBuf, secretBuf);
	return valid
		? { valid: true }
		: { valid: false, error: 'Invalid webhook token' };
}
