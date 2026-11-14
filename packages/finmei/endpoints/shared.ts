import { logEventFromContext } from 'corsair/core';
import type { FinmeiContext } from '../index';

export function seg(param: string | number): string {
	return encodeURIComponent(String(param));
}

// `unknown` because query values can be string, number, boolean, or undefined before compaction.
export function compactQuery(
	params: Record<string, unknown>,
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, val] of Object.entries(params)) {
		if (val !== undefined && val !== null) {
			if (
				typeof val === 'string' ||
				typeof val === 'number' ||
				typeof val === 'boolean'
			) {
				out[key] = val;
			}
		}
	}
	return out;
}

/**
 * Safely logs an event using allowed metadata only (never sensitive credentials or raw inputs).
 */
export async function safeLog(
	ctx: FinmeiContext,
	event: string,
	// `unknown` because log metadata values vary across operations (counts, ids, currencies) and cannot be statically constrained.
	metadata: Record<string, unknown>,
): Promise<void> {
	await logEventFromContext(ctx, `finmei.${event}`, metadata, 'completed');
}
