import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	ProductsGetPricesInputSchema,
	ProductsGetPricesOutputSchema,
	ProductsListMediaTypesInputSchema,
	ProductsListMediaTypesOutputSchema,
	ProductsListProductTypesInputSchema,
	ProductsListProductTypesOutputSchema,
	ProductsListStyleTypesInputSchema,
	ProductsListStyleTypesOutputSchema,
} from './types';

/**
 * Pricing for a set of product SKUs and quantities.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-get_prices
 */
export const getPrices: FinerWorksEndpoint<'products.getPrices'> = async (
	ctx,
	input,
) => {
	const validated = ProductsGetPricesInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/get_prices',
		credentials,
		{
			method: 'POST',
			body: validated,
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.products.getPrices',
		{ count: validated.products.length },
		'completed',
	);
	return ProductsGetPricesOutputSchema.parse(res);
};

/**
 * The three catalog list routes answer with a bare JSON array, not the
 * `{ status, <key>: [...] }` envelope the other routes use. Wrap it so callers
 * get one shape. Checked live against v2.api.finerworks.com on 2026-11-05.
 */
// unknown: the raw body is checked by the endpoint's output schema right after.
function wrapList(res: unknown, key: string): unknown {
	return Array.isArray(res) ? { [key]: res } : res;
}

/**
 * Printing substrates — canvas, paper, vinyl — and their product information.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_media_types
 */
export const listMediaTypes: FinerWorksEndpoint<
	'products.listMediaTypes'
> = async (ctx, input = {}) => {
	const validated = ProductsListMediaTypesInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_media_types',
		credentials,
		{ method: 'POST', body: { ...validated, ids: validated.ids ?? [] } },
	);

	await logEventFromContext(
		ctx,
		'finerworks.products.listMediaTypes',
		{},
		'completed',
	);
	return ProductsListMediaTypesOutputSchema.parse(wrapList(res, 'media_types'));
};

/**
 * Printing categories such as Canvas Prints and Metal Prints.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_product_types
 */
export const listProductTypes: FinerWorksEndpoint<
	'products.listProductTypes'
> = async (ctx, input = {}) => {
	const validated = ProductsListProductTypesInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_product_types',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.products.listProductTypes',
		{},
		'completed',
	);
	return ProductsListProductTypesOutputSchema.parse(
		wrapList(res, 'product_types'),
	);
};

/**
 * Print formatting options including borders and canvas wraps.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_style_types
 */
export const listStyleTypes: FinerWorksEndpoint<
	'products.listStyleTypes'
> = async (ctx, input = {}) => {
	const validated = ProductsListStyleTypesInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_style_types',
		credentials,
		{ method: 'POST', body: { ...validated, ids: validated.ids ?? [] } },
	);

	await logEventFromContext(
		ctx,
		'finerworks.products.listStyleTypes',
		{},
		'completed',
	);
	return ProductsListStyleTypesOutputSchema.parse(wrapList(res, 'style_types'));
};

export const ProductsEndpoints = {
	getPrices,
	listMediaTypes,
	listProductTypes,
	listStyleTypes,
} as const;
