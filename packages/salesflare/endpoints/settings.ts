import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import type { SalesflareEndpointOutputs } from './types';

export const retrieveAiSettings: SalesflareEndpoints['retrieveAiSettings'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['retrieveAiSettings']
		>(ctx, '/settings/ai', { method: 'GET' });
		await logEventFromContext(
			ctx,
			'salesflare.settings.retrieveAiSettings',
			input,
			'completed',
		);
		return response;
	};

export const updateAiSettings: SalesflareEndpoints['updateAiSettings'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateAiSettings']
	>(ctx, '/settings/ai', { method: 'PUT', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.settings.updateAiSettings',
		input,
		'completed',
	);
	return response;
};
