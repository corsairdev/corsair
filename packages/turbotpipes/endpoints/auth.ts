import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserPassword: TurbotPipesEndpoints['createUserPassword'] =
	async (ctx, input) => {
		const { user_handle, password } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserPassword']
		>(`user/${user_handle}/password`, ctx.key, {
			method: 'POST',
			body: { password },
		});
		// Log only the identifier; the password must never persist in event storage.
		await logEventFromContext(
			ctx,
			'turbotpipes.auth.create_user_password',
			{ user_handle },
			'completed',
		);
		return response;
	};

export const getUserPassword: TurbotPipesEndpoints['getUserPassword'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUserPassword']
	>(`user/${input.user_handle}/password`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.get_user_password',
		{ ...input },
		'completed',
	);
	return response;
};

export const getUserToken: TurbotPipesEndpoints['getUserToken'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUserToken']
	>(`user/${input.user_handle}/token/${input.token_id}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.get_user_token',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteUserToken: TurbotPipesEndpoints['deleteUserToken'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['deleteUserToken']
	>(`user/${input.user_handle}/token/${input.token_id}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.delete_user_token',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateUserToken: TurbotPipesEndpoints['updateUserToken'] = async (
	ctx,
	input,
) => {
	const { user_handle, token_id, status } = input;
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['updateUserToken']
	>(`user/${user_handle}/token/${token_id}`, ctx.key, {
		method: 'PATCH',
		body: { status },
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.update_user_token',
		{ ...input },
		'completed',
	);
	return response;
};

export const createSignup: TurbotPipesEndpoints['createSignup'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['createSignup']
	>('signup', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.create_signup',
		{ ...input },
		'completed',
	);
	return response;
};

export const initiateLogin: TurbotPipesEndpoints['initiateLogin'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['initiateLogin']
	>('login', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.initiate_login',
		{ ...input },
		'completed',
	);
	return response;
};

export const createLoginTokenEmail: TurbotPipesEndpoints['createLoginTokenEmail'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createLoginTokenEmail']
		>('login/token', ctx.key, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'turbotpipes.auth.create_login_token_email',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAuthProvider: TurbotPipesEndpoints['getAuthProvider'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getAuthProvider']
	>(`auth/${input.provider}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.get_auth_provider',
		{ ...input },
		'completed',
	);
	return response;
};
