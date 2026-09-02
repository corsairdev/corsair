import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import type { FixerEndpointOutputs } from './types';

export const list: FixerEndpoints['symbolsList'] = async (ctx, input) => {
	const response = await makeFixerRequest<FixerEndpointOutputs['symbolsList']>(
		'symbols',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'fixer.symbols.list',
		{ ...input },
		'completed',
	);
	return response;
};
