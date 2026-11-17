import type { SplitwiseEndpoints } from '..';
import { call } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

// Both routes are documented with `security: []` and answer without a key, but
// core resolves the account key before the endpoint runs, so a caller still
// needs one on the account.

export const listCurrencies: SplitwiseEndpoints['currenciesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'currencies.list',
			input: SplitwiseEndpointInputSchemas.listCurrencies,
			output: SplitwiseEndpointOutputSchemas.listCurrencies,
		},
		input,
		() => ({ method: 'GET', path: 'get_currencies' }),
		{ log: (_parsed, result) => ({ currencies: result.currencies.length }) },
	);

export const listCategories: SplitwiseEndpoints['categoriesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: SplitwiseEndpointInputSchemas.listCategories,
			output: SplitwiseEndpointOutputSchemas.listCategories,
		},
		input,
		() => ({ method: 'GET', path: 'get_categories' }),
		{ log: (_parsed, result) => ({ categories: result.categories.length }) },
	);
