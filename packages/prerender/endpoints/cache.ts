import { ApiError } from 'corsair/http';
import type { PrerenderEndpoints } from '..';
import { readReason, segment } from '../client';
import { asConfirmation, call } from './call';
import {
	PrerenderEndpointInputSchemas as Inputs,
	PrerenderEndpointOutputSchemas as Outputs,
} from './types';

export const recache: PrerenderEndpoints['cacheRecache'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'recache', input: Inputs.recache, output: Outputs.recache },
		input,
		({ url, urls, adaptiveType }) => ({
			method: 'POST',
			path: '/recache',
			body: { url, urls, adaptiveType },
		}),
		{
			// The route answers a short confirmation rather than a resource.
			shape: asConfirmation,
			log: (parsed) => ({ count: parsed.urls?.length ?? 1 }),
		},
	);

export const search: PrerenderEndpoints['cacheSearch'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'search', input: Inputs.search, output: Outputs.search },
		input,
		({ query, exactMatch, start, adaptiveType }) => ({
			method: 'POST',
			path: '/search',
			body: { query, exactMatch, start, adaptiveType },
		}),
		{
			// The route answers a bare array of cached URLs.
			shape: (raw) => (Array.isArray(raw) ? { urls: raw } : raw),
			log: (_, result) => ({ count: result.urls.length }),
		},
	);

export const sitemap: PrerenderEndpoints['cacheSitemap'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'sitemap', input: Inputs.sitemap, output: Outputs.sitemap },
		input,
		({ url, adaptiveType }) => ({
			method: 'POST',
			path: '/sitemap',
			body: { url, adaptiveType },
		}),
		{ shape: asConfirmation },
	);

export const cacheClear: PrerenderEndpoints['cacheClear'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cacheClear',
			input: Inputs.cacheClear,
			output: Outputs.cacheClear,
		},
		input,
		({ query }) => ({
			method: 'POST',
			path: '/cache-clear',
			body: { query },
		}),
		{
			shape: asConfirmation,
			// The pattern is the caller's own URL tree, which is safe to count but
			// not worth logging verbatim alongside a success flag.
			log: () => ({}),
		},
	);

/**
 * The status route takes the token in the path rather than a header or body,
 * and the request carries no body. It answers 200 `not queued` when no job is
 * waiting and 403 while one runs; both become `inProgress`.
 */
export const cacheClearStatus: PrerenderEndpoints['cacheClearStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'cacheClearStatus',
			input: Inputs.cacheClearStatus,
			output: Outputs.cacheClearStatus,
		},
		input,
		() => ({ method: 'GET', path: `/cache-clear-status/${segment(ctx.key)}` }),
		{
			shape: (raw) => ({
				...(asConfirmation(raw) as object),
				inProgress: false,
			}),
			recover: (error) =>
				error instanceof ApiError && error.status === 403
					? {
							message: readReason(error.body) ?? 'in progress',
							inProgress: true,
						}
					: undefined,
			log: (_, result) => ({ inProgress: result.inProgress }),
		},
	);

export const changeSpeed: PrerenderEndpoints['queueChangeSpeed'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'changeSpeed',
			input: Inputs.changeSpeed,
			output: Outputs.changeSpeed,
		},
		input,
		({ urlsPerHour }) => ({
			method: 'POST',
			path: '/change-recache-speed',
			body: { urlsPerHour },
		}),
		{
			log: (parsed, result) => ({
				urlsPerHour: parsed.urlsPerHour,
				isAutomaticDelay: result.isAutomaticDelay,
			}),
		},
	);
