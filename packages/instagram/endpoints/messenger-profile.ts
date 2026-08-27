import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { FacebookPageSchema } from '../schema/database';
import { GetFacebookPages } from './meta-data-endpoints';
import type { InstagramEndpointOutputs } from './types';

export const getProfile: InstagramEndpoints['GetMessengerProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetMessengerProfile']
	>(
		`/me/messenger_profile`,
		ctx,
		{
			method: 'GET',
			query: {
				platform: 'instagram',
				fields: input.fields?.join(','),
			},
		},
		async (userToken) => {
			const key = userToken ?? ctx.key;
			const res: FacebookPageSchema = await GetFacebookPages(
				key,
				'access_token',
				input.page_id,
			);
			if (!res.access_token) {
				throw new Error(`No page access token found for page`);
			}
			return res.access_token;
		},
	);

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
		>(
			`/me/messenger_profile`,
			ctx,
			{
				method: 'POST',
				query: {
					platform: 'instagram',
				},
				body: {
					greeting: input.greeting,
					persistent_menu: input.persistent_menu,
					ice_breakers: input.ice_breakers,
				},
			},
			async (userToken) => {
				const key = userToken ?? ctx.key;
				const res: FacebookPageSchema = await GetFacebookPages(
					key,
					'access_token',
					input.page_id,
				);
				if (!res.access_token) {
					throw new Error(`No page access token found for page`);
				}
				return res.access_token;
			},
		);

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
		>(
			`/me/messenger_profile`,
			ctx,
			{
				method: 'DELETE',
				query: {
					platform: 'instagram',
				},
				body: {
					fields: input.fields,
				},
			},
			async (userToken) => {
				const key = userToken ?? ctx.key;
				const res: FacebookPageSchema = await GetFacebookPages(
					key,
					'access_token',
					input.page_id,
				);
				if (!res.access_token) {
					throw new Error(`No page access token found for page`);
				}
				return res.access_token;
			},
		);

		await logEventFromContext(
			ctx,
			'instagram.messenger.deleteProfile',
			{ ...input },
			'completed',
		);

		return result;
	};
