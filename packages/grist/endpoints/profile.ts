import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const get: GristEndpoints['profile.get'] = async (ctx, input) => {
	GristEndpointInputSchemas['profile.get'].parse(input);
	const response = await makeGristRequest<unknown>('/profile/user', ctx.key, {
		method: 'GET',
		baseUrl: ctx.options?.baseUrl,
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
	const response = await makeGristRequest<unknown>(
		'/profile/user/name',
		ctx.key,
		{
			method: 'POST',
			body: { name: parsedInput.name },
			baseUrl: ctx.options?.baseUrl,
		},
	);
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
	const response = await makeGristRequest<unknown>(
		'/profile/user/locale',
		ctx.key,
		{
			method: 'POST',
			body: { locale: parsedInput.locale },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['profile.updateLocale'].parse(response);
	await logEventFromContext(ctx, 'grist.profile.updateLocale', {}, 'completed');
	return parsed;
};

export const getApiKey: GristEndpoints['profile.getApiKey'] = async (
	ctx,
	input,
) => {
	GristEndpointInputSchemas['profile.getApiKey'].parse(input);
	const response = await makeGristRequest<unknown>('/profile/apikey', ctx.key, {
		method: 'GET',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed =
		GristEndpointOutputSchemas['profile.getApiKey'].parse(response);
	// Never log or echo the retrieved API key
	await logEventFromContext(ctx, 'grist.profile.getApiKey', {}, 'completed');
	return parsed;
};

export const createApiKey: GristEndpoints['profile.createApiKey'] = async (
	ctx,
	input,
) => {
	GristEndpointInputSchemas['profile.createApiKey'].parse(input);
	const response = await makeGristRequest<unknown>('/profile/apikey', ctx.key, {
		method: 'POST',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed =
		GristEndpointOutputSchemas['profile.createApiKey'].parse(response);
	// Never log or echo the created API key
	await logEventFromContext(ctx, 'grist.profile.createApiKey', {}, 'completed');
	return parsed;
};

export const deleteApiKey: GristEndpoints['profile.deleteApiKey'] = async (
	ctx,
	input,
) => {
	GristEndpointInputSchemas['profile.deleteApiKey'].parse(input);
	const response = await makeGristRequest<unknown>('/profile/apikey', ctx.key, {
		method: 'DELETE',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed =
		GristEndpointOutputSchemas['profile.deleteApiKey'].parse(response);
	await logEventFromContext(ctx, 'grist.profile.deleteApiKey', {}, 'completed');
	return parsed;
};
