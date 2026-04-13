import crypto from 'crypto';
import type { TavilyContext } from '..';
import type { TavilyEndpointOutputs } from './types';

export type TavilyRunEndpoint = keyof TavilyEndpointOutputs;

function stableStringify(value: unknown): string {
	if (value === null || typeof value !== 'object') {
		return JSON.stringify(value) ?? 'null';
	}
	if (Array.isArray(value)) {
		return `[${value.map(stableStringify).join(',')}]`;
	}
	const entries = Object.keys(value as Record<string, unknown>)
		.sort()
		.map(
			(k) =>
				`${JSON.stringify(k)}:${stableStringify(
					(value as Record<string, unknown>)[k],
				)}`,
		);
	return `{${entries.join(',')}}`;
}

export function computeCacheKey(
	endpoint: TavilyRunEndpoint,
	body: unknown,
): string {
	const digest = crypto
		.createHash('sha256')
		.update(`${endpoint}:${stableStringify(body)}`)
		.digest('hex');
	return `${endpoint}:${digest}`;
}

export async function readCachedRun<E extends TavilyRunEndpoint>(
	ctx: TavilyContext,
	endpoint: E,
	body: unknown,
): Promise<TavilyEndpointOutputs[E] | null> {
	if (!ctx.db.runs) return null;
	try {
		const key = computeCacheKey(endpoint, body);
		const existing = await ctx.db.runs.findByEntityId(key);
		const cached = existing?.data?.response;
		if (!cached) return null;
		return cached as TavilyEndpointOutputs[E];
	} catch (error) {
		console.warn(`[tavily] Failed to read ${endpoint} cache:`, error);
		return null;
	}
}

export async function writeCachedRun<E extends TavilyRunEndpoint>(
	ctx: TavilyContext,
	endpoint: E,
	body: unknown,
	response: TavilyEndpointOutputs[E],
): Promise<void> {
	if (!ctx.db.runs) return;
	try {
		const key = computeCacheKey(endpoint, body);
		await ctx.db.runs.upsertByEntityId(key, {
			endpoint,
			request: body as Record<string, unknown>,
			response: response as unknown as Record<string, unknown>,
			cachedAt: new Date(),
		});
	} catch (error) {
		console.warn(`[tavily] Failed to write ${endpoint} cache:`, error);
	}
}
