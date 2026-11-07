import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import type { SalesflareEndpointOutputs } from './types';

export const retrieveCurrentUser: SalesflareEndpoints['retrieveCurrentUser'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['retrieveCurrentUser']
		>(ctx, '/me', { method: 'GET' });
		await logEventFromContext(
			ctx,
			'salesflare.me.retrieveCurrentUser',
			input,
			'completed',
		);
		return response;
	};

export const listMyContacts: SalesflareEndpoints['listMyContacts'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listMyContacts']
	>(ctx, '/me/contacts', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.me.listMyContacts',
		input,
		'completed',
	);
	return response;
};
