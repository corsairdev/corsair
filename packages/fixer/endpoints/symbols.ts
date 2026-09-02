import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import { FixerEndpointOutputSchemas } from './types';

export const list: FixerEndpoints['symbolsList'] = async (ctx, input) => {
	const response = await makeFixerRequest('symbols', ctx.key, {
		method: 'GET',
		schema: FixerEndpointOutputSchemas.symbolsList,
	});

	await logEventFromContext(
		ctx,
		'fixer.symbols.list',
		{ ...input },
		'completed',
	);
	return response;
};
