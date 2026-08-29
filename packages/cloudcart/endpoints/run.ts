import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeCloudcartRequest } from '../client';
import type { CloudcartContext } from '../index';

const LOG_KEYS = [
	'id',
	'product_id',
	'customer_id',
	'property_id',
	'discount_id',
	'variant_id',
	'parameter_id',
] as const;

export function pathId(value: unknown): string {
	return encodeURIComponent(String(value));
}

export function safeEvent(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const key of LOG_KEYS) {
		const value = input[key];
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return out;
}

export function queryOf(
	input: Record<string, unknown>,
	omit: ReadonlySet<string> = new Set(),
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(input)) {
		if (key === 'data' || omit.has(key)) continue;
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
	omit: ReadonlySet<string> = new Set(),
): Record<string, unknown> {
	const data = input.data;
	if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
		return data as Record<string, unknown>;
	}
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (key === 'data' || omit.has(key)) continue;
		out[key] = value;
	}
	return out;
}

function resolvePath<T extends object>(
	parsed: T,
	path: string | ((value: T) => string),
): { path: string; omit: Set<string> } {
	if (typeof path !== 'function') {
		return { path, omit: new Set() };
	}
	const omit = new Set<string>();
	const tracked = new Proxy(parsed, {
		get(target, prop, receiver) {
			if (typeof prop === 'string') {
				omit.add(prop);
			}
			return Reflect.get(target, prop, receiver);
		},
	});
	return { path: path(tracked), omit };
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
	const resolved = resolvePath(parsed as TIn & object, options.path);
	const method = options.method ?? 'GET';
	const send =
		options.send ??
		(method === 'GET' ? 'query' : method === 'DELETE' ? 'none' : 'body');
	if (send === 'query' && method !== 'GET') {
		throw new Error(
			`CloudCart query send is only valid for GET, got ${method}`,
		);
	}
	const result = await makeCloudcartRequest<unknown>(resolved.path, ctx.key, {
		method,
		query: send === 'query' ? queryOf(record, resolved.omit) : undefined,
		body: send === 'body' ? requestBody(record, resolved.omit) : undefined,
	});
	const output = options.outputSchema.parse(result ?? {});
	await logEventFromContext(ctx, options.event, safeEvent(record), 'completed');
	return output;
}
