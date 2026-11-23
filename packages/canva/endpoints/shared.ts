import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext } from '../index';

/** An id placed in a URL path; encoded so a stray `/` or `?` can't reach another route. */
export function seg(value: string): string {
	return encodeURIComponent(value);
}

type RequestOptions = Parameters<typeof makeCanvaRequest>[2];

/** One Canva call plus its event log, for endpoints with nothing else to do. */
export async function callCanva<T>(
	ctx: CanvaContext,
	event: string,
	logged: Record<string, unknown>,
	path: string,
	options: RequestOptions = { method: 'GET' },
): Promise<T> {
	const result = await makeCanvaRequest<T>(path, ctx.key, options);
	await logEventFromContext(ctx, `canva.${event}`, logged, 'completed');
	return result;
}

/** Drops keys whose value is undefined, for a query or body. */
export function defined<T extends Record<string, unknown>>(value: T) {
	return Object.fromEntries(
		Object.entries(value).filter(([, v]) => v !== undefined),
	) as { [K in keyof T]: Exclude<T[K], undefined> };
}
