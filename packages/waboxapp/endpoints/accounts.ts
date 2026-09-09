import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeWaboxappRequest } from '../client';
import type { WaboxappEndpoints } from '../index';
import type { WaboxappEndpointOutputs } from './types';

export const getStatus: WaboxappEndpoints['accountsGetStatus'] = async (
	ctx,
	input,
) => {
	const uid = input.uid ?? ctx.options.uid ?? (await ctx.keys.get_uid());
	if (!uid) {
		throw new AuthMissingError('waboxapp', 'api_key');
	}
	const response = await makeWaboxappRequest<
		WaboxappEndpointOutputs['accountsGetStatus']
	>(`status/${uid}`, {
		method: 'GET',
		fields: { token: ctx.key },
	});
	await logEventFromContext(
		ctx,
		'waboxapp.accounts.getStatus',
		{ uid },
		'completed',
	);
	return response;
};
