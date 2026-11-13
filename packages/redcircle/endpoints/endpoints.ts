import { asRecord } from 'corsair/core';
import type { RedcircleEndpoints } from '..';
import { call, queryOf } from './call';
import { envelopeShape } from './shape';
import {
	RedcircleEndpointInputSchemas as Inputs,
	RedcircleEndpointOutputSchemas as Outputs,
} from './types';

export const productsGet: RedcircleEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/request',
			// A product read costs a credit per page and never writes.
			replayable: true,
			query: queryOf({
				type: 'product',
				tcin: parsed.tcin,
				dpci: parsed.dpci,
				gtin: parsed.gtin,
				url: parsed.url,
			}),
		}),
		{
			shape: envelopeShape('product'),
			log: (_, result) => ({ tcin: result.product.tcin ?? '' }),
		},
	);

export const searchProducts: RedcircleEndpoints['searchProducts'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'search.products',
			input: Inputs.searchProducts,
			output: Outputs.searchProducts,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/request',
			replayable: true,
			query: queryOf({
				type: 'search',
				search_term: parsed.search_term,
				category_id: parsed.category_id,
				sort_by: parsed.sort_by,
				delivery_type: parsed.delivery_type,
				customer_zipcode: parsed.customer_zipcode,
				url: parsed.url,
				page: parsed.page,
				max_page: parsed.max_page,
			}),
		}),
		{
			shape: envelopeShape('search_results'),
			log: (_, result) => ({
				count: result.search_results.length,
				totalResults: result.total_results ?? 0,
			}),
		},
	);

export const reviewsList: RedcircleEndpoints['reviewsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reviews.list',
			input: Inputs.reviewsList,
			output: Outputs.reviewsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/request',
			replayable: true,
			query: queryOf({
				type: 'reviews',
				tcin: parsed.tcin,
				dpci: parsed.dpci,
				gtin: parsed.gtin,
				url: parsed.url,
				sort_by: parsed.sort_by,
				page: parsed.page,
				max_page: parsed.max_page,
			}),
		}),
		{
			shape: envelopeShape('reviews'),
			log: (_, result) => ({
				count: result.reviews.length,
				totalResults: result.total_results ?? 0,
			}),
		},
	);

export const categoriesList: RedcircleEndpoints['categoriesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: Inputs.categoriesList,
			output: Outputs.categoriesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/categories',
			replayable: true,
			query: queryOf({
				parent_id: parsed.parent_id,
				search_term: parsed.search_term,
			}),
		}),
		{
			// This route has no pagination and names its rows `categories`, or
			// `category` when an id was requested.
			shape: (raw) => {
				const record = asRecord(raw);
				return {
					categories: record?.categories,
					category: record?.category,
					current_category: record?.current_category,
					parent_category: record?.parent_category,
					request_info: record?.request_info,
				};
			},
			log: (_, result) => ({
				count: result.categories?.length ?? 0,
				hasCategory: result.category !== null && result.category !== undefined,
			}),
		},
	);

export const accountGet: RedcircleEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account', replayable: true }),
		{
			shape: (raw) => {
				const record = asRecord(raw);
				const info = asRecord(record?.account_info);
				if (!info) {
					return { account: undefined, request_info: record?.request_info };
				}
				// RedCircle echoes the api_key back here. It is destructured away
				// before the parse, so it cannot reach a caller or a log.
				const { api_key: _apiKey, ...account } = info;
				return { account, request_info: record?.request_info };
			},
			log: (_, result) => ({
				plan: result.account.plan ?? '',
				creditsRemaining: result.account.credits_remaining ?? 0,
			}),
		},
	);
