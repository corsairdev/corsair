import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserPassword: TurbotPipesEndpoints['createUserPassword'] =
	async (ctx, input) => {
		const { user_handle, expires_in_minutes } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserPassword']
		>(`user/${pathSegment(user_handle)}/password`, ctx.key, {
			method: 'POST',
			body: { expires_in_minutes },
		});
		// Log only the identifier; the response carries a database password.
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
	>(`user/${pathSegment(input.user_handle)}/password`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.get_user_password',
		eventIdentifiers(input),
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
	>(
		`user/${pathSegment(input.user_handle)}/token/${pathSegment(input.token_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.get_user_token',
		eventIdentifiers(input),
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
	>(
		`user/${pathSegment(input.user_handle)}/token/${pathSegment(input.token_id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.delete_user_token',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const updateUserToken: TurbotPipesEndpoints['updateUserToken'] = async (
	ctx,
	input,
) => {
	const { user_handle, token_id, status, title, description } = input;
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['updateUserToken']
	>(
		`user/${pathSegment(user_handle)}/token/${pathSegment(token_id)}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { status, title, description },
		},
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.update_user_token',
		eventIdentifiers(input),
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
	// Log only a presence flag; email addresses are PII and must not persist.
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.create_signup',
		{ has_email: Boolean(input.email) },
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
	// Log only a presence flag; email addresses are PII and must not persist.
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.initiate_login',
		{ has_email: Boolean(input.email) },
		'completed',
	);
	return response;
};

export const createLoginTokenEmail: TurbotPipesEndpoints['createLoginTokenEmail'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createLoginTokenEmail']
		>('login/token', ctx.key, { method: 'POST', body: input });
		// Log only a presence flag; email addresses are PII and must not persist.
		await logEventFromContext(
			ctx,
			'turbotpipes.auth.create_login_token_email',
			{ has_email: Boolean(input.email) },
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
	>(`auth/${pathSegment(input.provider)}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.auth.get_auth_provider',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};
