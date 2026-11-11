import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const usersGetMe: MixmaxEndpoints['usersGetMe'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['usersGetMe']>(
		ctx,
		'/v1/users/me',
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'mixmax.users.getMe',
		{ ...input },
		'completed',
	);
	return result;
};

export const userPreferencesGet: MixmaxEndpoints['userPreferencesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['userPreferencesGet']
	>(ctx, '/v1/userpreferences/me', {
		method: 'GET',
		query: {
			fields: input.fields,
			includeFinalDefaultCalendarUrl: input.includeFinalDefaultCalendarUrl,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.userPreferences.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const userPreferencesUpdate: MixmaxEndpoints['userPreferencesUpdate'] =
	async (ctx, input) => {
		// The whole preferences document is patchable and the provider schema
		// is explicitly extensible, so the validated input is forwarded as the
		// body minus nothing.
		const { ...preferences } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['userPreferencesUpdate']
		>(ctx, '/v1/userpreferences/me', {
			method: 'PATCH',
			body: preferences,
		});

		await logEventFromContext(
			ctx,
			'mixmax.userPreferences.update',
			// Preference values can hold signatures and addresses; log which
			// preferences changed, not their values.
			{ fields: Object.keys(input) },
			'completed',
		);
		return result;
	};

export const userPreferencesAutoBccList: MixmaxEndpoints['userPreferencesAutoBccList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['userPreferencesAutoBccList']
		>(ctx, '/v1/userpreferences/me/autoBccExcludedEmails', {
			method: 'GET',
			query: { email: input.email },
		});

		await logEventFromContext(
			ctx,
			'mixmax.userPreferences.autoBccExcludedEmails.list',
			// The address being checked is private; log the count only.
			{ addresses: 1 },
			'completed',
		);
		return result;
	};

export const userPreferencesAutoBccAdd: MixmaxEndpoints['userPreferencesAutoBccAdd'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['userPreferencesAutoBccAdd']
		>(ctx, '/v1/userpreferences/me/autoBccExcludedEmails', {
			method: 'POST',
			body: {
				email: input.email,
				emails: input.emails,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.userPreferences.autoBccExcludedEmails.add',
			// The addresses are private; log how many were sent.
			{
				addresses:
					(input.email !== undefined ? 1 : 0) + (input.emails?.length ?? 0),
			},
			'completed',
		);
		return result;
	};

export const userPreferencesAutoBccExists: MixmaxEndpoints['userPreferencesAutoBccExists'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['userPreferencesAutoBccExists']
		>(ctx, '/v1/userpreferences/me/autoBccExcludedEmails/exists', {
			method: 'POST',
			body: {
				emails: input.emails,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.userPreferences.autoBccExcludedEmails.exists',
			// The addresses are private; log how many were checked.
			{ addresses: input.emails.length },
			'completed',
		);
		return result;
	};
