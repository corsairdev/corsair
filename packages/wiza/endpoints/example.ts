import { logEventFromContext } from 'corsair/core';
import type { WizaEndpoints } from '..';
import { makeWizaRequest } from '../client';
import type { WizaEndpointOutputs } from './types';

export const get: WizaEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeWizaRequest<WizaEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'wiza.example.get', { ...input }, 'completed');
	return response;
};
