import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { safeLog } from './shared';
import type { FinmeiCurrency } from './types';
import {
	FinmeiListCurrenciesInputSchema,
	FinmeiListCurrenciesOutputSchema,
} from './types';

export const list: FinmeiEndpoints['currenciesList'] = async (ctx, input) => {
	FinmeiListCurrenciesInputSchema.parse(input ?? {});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiCurrency[];
	}>('/currencies', ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiListCurrenciesOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'currencies.list', {
		count: parsed.data.length,
	});
	return parsed;
};

export const Currencies = {
	list,
};
