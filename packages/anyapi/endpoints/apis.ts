import type { AnyApiEndpoints } from '..';
import { call, runPath, splitControls } from './call';

export const search: AnyApiEndpoints['apisSearch'] = (ctx, input) =>
	call(ctx, 'apisSearch', 'apis.search', input, (parsed) => ({
		method: 'GET',
		path: '/catalog/search',
		query: {
			q: parsed.query,
			category: parsed.category,
			platform: parsed.platform,
			limit: parsed.limit,
		},
	}));

export const list: AnyApiEndpoints['apisList'] = (ctx, input) =>
	call(ctx, 'apisList', 'apis.list', input, (parsed) => ({
		method: 'GET',
		path: '/v1/apis',
		query: { category: parsed.category },
	}));

export const get: AnyApiEndpoints['apisGet'] = (ctx, input) =>
	call(ctx, 'apisGet', 'apis.get', input, (parsed) => ({
		method: 'GET',
		path: `/v1/apis/${encodeURIComponent(parsed.sku)}`,
	}));

// Free: prices the exact input and validates it without running anything.
export const quote: AnyApiEndpoints['apisQuote'] = (ctx, input) =>
	call(ctx, 'apisQuote', 'apis.quote', input, (parsed) => ({
		method: 'POST',
		path: `/v1/apis/${encodeURIComponent(parsed.sku)}/quote`,
		body: parsed.input,
	}));

export const run: AnyApiEndpoints['apisRun'] = (ctx, input) => {
	// The SKU is logged once the input is parsed, so read it the same way.
	const sku =
		typeof (input as { sku?: unknown } | undefined)?.sku === 'string'
			? (input as { sku: string }).sku
			: undefined;
	return call(
		ctx,
		'apisRun',
		'apis.run',
		input,
		(parsed) => {
			const { rest, query, headers } = splitControls(parsed);
			return {
				method: 'POST',
				path: runPath(rest.sku),
				query,
				body: rest.input,
				headers,
			};
		},
		{ sku },
	);
};
