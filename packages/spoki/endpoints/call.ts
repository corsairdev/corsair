import type { z } from 'zod';
import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';

export function omitKeys(obj: object, keys: string[]): Record<string, unknown> {
	const skip = new Set(keys);
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (!skip.has(key) && value !== undefined) out[key] = value;
	}
	return out;
}

export function queryString(obj: object): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(obj)) {
		if (value === undefined) continue;
		params.set(key, String(value));
	}
	const encoded = params.toString();
	return encoded ? `?${encoded}` : '';
}

export async function spokiCall<TIn, TOut>(
	ctx: SpokiContext & { key: string },
	input: unknown,
	spec: {
		input: z.ZodType<TIn>;
		output: z.ZodType<TOut>;
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		path: (parsed: TIn) => string;
		body?: (parsed: TIn) => unknown;
	},
): Promise<TOut> {
	const parsed = spec.input.parse(input ?? {});
	const client = new SpokiClient({ apiKey: ctx.key });
	const path = spec.path(parsed);
	let result: unknown;
	switch (spec.method) {
		case 'GET':
			result = await client.get(path);
			break;
		case 'DELETE':
			result = await client.delete(path);
			break;
		case 'POST':
			result = await client.post(path, spec.body ? spec.body(parsed) : parsed);
			break;
		case 'PUT':
			result = await client.put(path, spec.body ? spec.body(parsed) : parsed);
			break;
		case 'PATCH':
			result = await client.patch(path, spec.body ? spec.body(parsed) : parsed);
			break;
	}
	return spec.output.parse(result ?? {});
}
