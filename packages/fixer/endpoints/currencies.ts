import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import {
	CurrenciesGetAllInputSchema,
	CurrenciesGetAllOutputSchema,
} from './types';

export const getAll: FixerEndpoints['currenciesGetAll'] = async (
	ctx,
	rawInput,
) => {
	CurrenciesGetAllInputSchema.parse(rawInput);
	const response = CurrenciesGetAllOutputSchema.parse(
		await makeFixerRequest('symbols', ctx.key),
	);

	if (ctx.db.currencies) {
		try {
			for (const [code, name] of Object.entries(response.symbols)) {
				await ctx.db.currencies.upsertByEntityId(code, { code, name });
			}
		} catch (error) {
			console.warn('Failed to save currencies to database:', error);
		}
	}

	await logEventFromContext(ctx, 'fixer.currencies.getAll', {}, 'completed');

	return response;
};
