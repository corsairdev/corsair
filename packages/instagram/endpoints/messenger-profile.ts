import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const getProfile: InstagramEndpoints['GetMessengerProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetMessengerProfile']
	>(`/${input.ig_id}/messenger_profile`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields?.join(','),
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.messenger.getProfile',
		{ ...input },
		'completed',
	);

	return result;
};

export const updateProfile: InstagramEndpoints['UpdateMessengerProfile'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['UpdateMessengerProfile']
		>(`/${input.ig_id}/messenger_profile`, ctx, {
			method: 'POST',
			body: {
				persistent_menu: input.persistent_menu,
				ice_breakers: input.ice_breakers,
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.messenger.updateProfile',
			{ ...input },
			'completed',
		);

		return result;
	};

export const deleteProfile: InstagramEndpoints['DeleteMessengerProfile'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['DeleteMessengerProfile']
		>(`/${input.ig_id}/messenger_profile`, ctx, {
			method: 'DELETE',
			body: {
				fields: input.fields,
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.messenger.deleteProfile',
			{ ...input },
			'completed',
		);

		return result;
	};
