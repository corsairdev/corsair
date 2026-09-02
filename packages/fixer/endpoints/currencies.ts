import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import type { FixerEndpointOutputs } from './types';

export const getAll: FixerEndpoints['currenciesGetAll'] = async (
	ctx,
	_input,
) => {
	const response = await makeFixerRequest<
		FixerEndpointOutputs['currenciesGetAll']
	>('symbols', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'fixer.currencies.getAll', {}, 'completed');

	return response;
};
