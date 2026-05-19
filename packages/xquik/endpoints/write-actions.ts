import { logEventFromContext } from 'corsair/core';
import { makeXquikRequest } from '../client';
import type { XquikEndpoints } from '../index';
import { baseUrlFromOptions } from './helpers';
import type { XquikEndpointOutputs } from './types';

export const get: XquikEndpoints['writeActionsGet'] = async (ctx, input) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['writeActionsGet']
	>(`/x/write-actions/${input.id}`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
	});

	await logEventFromContext(
		ctx,
		'xquik.writeActions.get',
		{ id: input.id },
		'completed',
	);

	return response;
};
