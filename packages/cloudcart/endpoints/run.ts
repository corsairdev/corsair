import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeCloudcartRequest } from '../client';
import type { CloudcartContext } from '../index';

const PATH_KEYS = [
	'id',
	'product_id',
	'customer_id',
	'property_id',
	'discount_id',
] as const;

type PathKey = (typeof PATH_KEYS)[number];

function isPathKey(key: string): key is PathKey {
	return (PATH_KEYS as readonly string[]).includes(key);
}

export function pathId(value: unknown): string {
	return encodeURIComponent(String(value));
}

export function safeEvent(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const key of PATH_KEYS) {
		const value = input[key];
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return out;
}

export function queryOf(
	input: Record<string, unknown>,
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(input)) {
		if (key === 'data' || isPathKey(key)) continue;
		if (value === undefined || value === null) continue;
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			out[key] = value;
		}
	}
	return out;
}

export function requestBody(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const data = input.data;
	if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
		return data as Record<string, unknown>;
	}
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (key === 'data' || isPathKey(key)) continue;
		out[key] = value;
	}
	return out;
}

export async function runCloudcart<TIn, TOut>(
	ctx: CloudcartContext,
	input: TIn,
	options: {
		event: string;
		inputSchema: z.ZodType<TIn>;
		outputSchema: z.ZodType<TOut>;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		path: string | ((parsed: TIn) => string);
		send?: 'query' | 'body' | 'none';
	},
): Promise<TOut> {
	const parsed = options.inputSchema.parse(input);
	const record = parsed as Record<string, unknown>;
	const path =
		typeof options.path === 'function' ? options.path(parsed) : options.path;
	const method = options.method ?? 'GET';
	const send =
		options.send ??
		(method === 'GET' ? 'query' : method === 'DELETE' ? 'none' : 'body');
	const result = await makeCloudcartRequest<unknown>(path, ctx.key, {
		method,
		query: send === 'query' ? queryOf(record) : undefined,
		body: send === 'body' ? requestBody(record) : undefined,
	});
	const output = options.outputSchema.parse(result ?? {});
	await logEventFromContext(ctx, options.event, safeEvent(record), 'completed');
	return output;
}
