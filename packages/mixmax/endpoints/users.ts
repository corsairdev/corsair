import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const usersGetMe: MixmaxEndpoints['usersGetMe'] = async (ctx, _input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['usersGetMe']
	>('/v1/users/me', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.users.getMe',
		{},
		'completed',
	);
	return result;
};

export const usersGet: MixmaxEndpoints['usersGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['usersGet']
	>(`/v1/users/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.users.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const usersUpdatePassword: MixmaxEndpoints['usersUpdatePassword'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['usersUpdatePassword']
	>(`/v1/users/${input.id}/password`, ctx.key, {
		method: 'PATCH',
		body: {
			password: input.password,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.users.updatePassword',
		{ ...input },
		'completed',
	);
	return result;
};

export const usersUpdateSubscription: MixmaxEndpoints['usersUpdateSubscription'] =
	async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['usersUpdateSubscription']
	>(`/v1/users/${input.id}/subscription`, ctx.key, {
		method: 'PATCH',
		body: {
			plan: input.plan,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.users.updateSubscription',
		{ ...input },
		'completed',
	);
	return result;
};

export const userPreferencesGet: MixmaxEndpoints['userPreferencesGet'] = async (
	ctx,
	_input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['userPreferencesGet']
	>('/v1/userpreferences/me', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.userPreferences.get',
		{},
		'completed',
	);
	return result;
};

export const userPreferencesUpdate: MixmaxEndpoints['userPreferencesUpdate'] =
	async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['userPreferencesUpdate']
	>('/v1/userpreferences/me', ctx.key, {
		method: 'PATCH',
		body: {
			autoBcc: input.autoBcc,
			autoBccExcludedEmails: input.autoBccExcludedEmails,
			signature: input.signature,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.userPreferences.update',
		{ ...input },
		'completed',
	);
	return result;
};