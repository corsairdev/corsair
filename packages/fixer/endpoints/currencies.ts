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
		await makeFixerRequest<unknown>('symbols', ctx.key, {
			method: 'GET',
		}),
	);

	await logEventFromContext(ctx, 'fixer.currencies.getAll', {}, 'completed');

	return response;
};
