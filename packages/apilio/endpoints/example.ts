import { logEventFromContext } from 'corsair/core';
import type { ApilioEndpoints } from '..';
import { makeApilioRequest } from '../client';
import type { ApilioEndpointOutputs } from './types';

export const get: ApilioEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeApilioRequest<ApilioEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'apilio.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
