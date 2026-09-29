import { logEventFromContext } from 'corsair/core';
import { makeFilevineIdentityRequest } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import { GetAccessTokenResponseSchema } from './types';

export const getAccessToken: FilevineEndpoints['getAccessToken'] = async (
	ctx,
	input,
) => {
	const body: Record<string, string> = {
		grant_type: 'personal_access_token',
		token: input.token,
		scope:
			input.scope ??
			'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
	};
	if (input.client_id) body.client_id = input.client_id;
	if (input.client_secret) body.client_secret = input.client_secret;

	const result = await makeFilevineIdentityRequest<
		FilevineEndpointOutputs['getAccessToken']
	>('/connect/token', body);
	const parsed = GetAccessTokenResponseSchema.parse(result);
	await logEventFromContext(
		ctx,
		'filevine.identity.getAccessToken',
		{ scope: parsed.scope },
		'completed',
	);
	return parsed;
};

export const getUserOrgsWithToken: FilevineEndpoints['getUserOrgsWithToken'] =
	async (ctx, _input) => {
		const { makeFilevineRequest } = await import('../client');
		const result = await makeFilevineRequest<
			FilevineEndpointOutputs['getUserOrgsWithToken']
		>('/fv-app/v2/utils/GetUserOrgsWithToken', ctx.key, { method: 'POST' });
		const { GetUserOrgsWithTokenResponseSchema } = await import('./types');
		const parsed = GetUserOrgsWithTokenResponseSchema.parse(result);
		await logEventFromContext(
			ctx,
			'filevine.identity.getUserOrgsWithToken',
			{},
			'completed',
		);
		return parsed;
	};
