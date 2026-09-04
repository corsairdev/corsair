import type { BubbleRequestOptions } from '../client';
import { makeBubbleRequest } from '../client';
import type { BubbleContext } from '../index';

/**
 * Resolves the `appName` account-level field the same way bigml resolves its
 * `username` account field: a value supplied per-connection (via plugin
 * options) wins, otherwise the account-level stored field.
 */
async function resolveAppName(ctx: BubbleContext): Promise<string> {
	return ctx.options.appName ?? (await ctx.keys.get_appName()) ?? '';
}

/** Issues a request against this app's Bubble Data/Workflow API. */
export async function bubbleCall<T>(
	ctx: BubbleContext,
	path: string,
	options?: BubbleRequestOptions,
): Promise<T> {
	const appName = await resolveAppName(ctx);
	return makeBubbleRequest<T>(path, appName, ctx.key, {
		...options,
		baseUrl: ctx.options.baseUrl ?? options?.baseUrl,
	});
}

/**
 * Drops `undefined` values from a request query object - a undefined query
 * key would otherwise be serialized into the URL by the shared transport.
 */
export function compact<T extends Record<string, unknown>>(obj: T): T {
	const result = Object.create(null) as T;
	for (const key of Object.keys(obj) as (keyof T)[]) {
		const value = obj[key];
		if (value !== undefined) result[key] = value as T[keyof T];
	}
	return result;
}

/** Encodes the `obj/{typename}` path segment for the Data API. */
export function objPath(typeName: string): string {
	return `obj/${encodeURIComponent(typeName)}`;
}

/** Encodes the `obj/{typename}/{thingId}` path segment for the Data API. */
export function thingPath(typeName: string, thingId: string): string {
	return `obj/${encodeURIComponent(typeName)}/${encodeURIComponent(thingId)}`;
}
