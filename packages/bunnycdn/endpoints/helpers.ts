import type { BunnycdnApiBase } from '../client';
import { makeBunnycdnRequest } from '../client';
import type { BunnycdnContext } from '../index';
import type { Success } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type QueryValue = string | number | boolean | string[] | undefined;

export async function api<T>(
	ctx: BunnycdnContext,
	base: BunnycdnApiBase,
	method: HttpMethod,
	path: string,
	opts: {
		query?: Record<string, QueryValue>;
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	// The explicitly configured key wins over the stored account key so an
	// endpoint call can never run against the wrong BunnyCDN account.
	const key = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? '';
	return makeBunnycdnRequest<T>(path, key, {
		method,
		query: opts.query,
		body: opts.body,
		base,
	});
}

export async function apiVoid(
	ctx: BunnycdnContext,
	base: BunnycdnApiBase,
	method: HttpMethod,
	path: string,
	opts: {
		query?: Record<string, QueryValue>;
		body?: Record<string, unknown>;
	} = {},
): Promise<Success> {
	await api<unknown>(ctx, base, method, path, opts);
	return { success: true };
}
