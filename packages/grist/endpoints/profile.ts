import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest, resolveGristBaseUrl } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const get: GristEndpoints['profile.get'] = async (ctx, input) => {
	GristEndpointInputSchemas['profile.get'].parse(input);
	const response = await makeGristRequest('/profile/user', ctx.key, {
		method: 'GET',
		baseUrl: await resolveGristBaseUrl(ctx),
	});
	const parsed = GristEndpointOutputSchemas['profile.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.profile.get',
		{ userId: parsed.id },
		'completed',
	);
	return parsed;
};

export const updateName: GristEndpoints['profile.updateName'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['profile.updateName'].parse(input);
	const response = await makeGristRequest('/profile/user/name', ctx.key, {
		method: 'POST',
		body: { name: parsedInput.name },
		baseUrl: await resolveGristBaseUrl(ctx),
	});
	const parsed =
		GristEndpointOutputSchemas['profile.updateName'].parse(response);
	await logEventFromContext(ctx, 'grist.profile.updateName', {}, 'completed');
	return parsed;
};

export const updateLocale: GristEndpoints['profile.updateLocale'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['profile.updateLocale'].parse(input);
	const response = await makeGristRequest('/profile/user/locale', ctx.key, {
		method: 'POST',
		body: { locale: parsedInput.locale },
		baseUrl: await resolveGristBaseUrl(ctx),
	});
	const parsed =
		GristEndpointOutputSchemas['profile.updateLocale'].parse(response);
	await logEventFromContext(ctx, 'grist.profile.updateLocale', {}, 'completed');
	return parsed;
};
