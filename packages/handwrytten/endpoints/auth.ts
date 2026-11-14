import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	AuthCheckAuthResponse,
	AuthGetUserResponse,
	AuthLogoutResponse,
	AuthSetTestModeResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const getUser: HandwryttenEndpoints['auth.getUser'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['auth.getUser'].parse(input);
	const response = await makeHandwryttenRequest<AuthGetUserResponse>(
		'/auth/getUser',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['auth.getUser'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.auth.getUser',
		{ userId: parsed.id },
		'completed',
	);
	return parsed;
};

export const checkAuth: HandwryttenEndpoints['auth.checkAuth'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['auth.checkAuth'].parse(input);
	const response = await makeHandwryttenRequest<AuthCheckAuthResponse>(
		'/checkauth/auth',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['auth.checkAuth'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.auth.checkAuth',
		{ testMode: parsed.test_mode },
		'completed',
	);
	return parsed;
};

export const setTestMode: HandwryttenEndpoints['auth.setTestMode'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['auth.setTestMode'].parse(input);
	const response = await makeHandwryttenRequest<AuthSetTestModeResponse>(
		'/auth/setTestMode',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['auth.setTestMode'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.auth.setTestMode',
		{ testMode: parsed.test_mode },
		'completed',
	);
	return parsed;
};

export const logout: HandwryttenEndpoints['auth.logout'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['auth.logout'].parse(input);
	const response = await makeHandwryttenRequest<AuthLogoutResponse>(
		'/auth/logout',
		ctx.key,
		{
			method: 'POST',
			body: {},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['auth.logout'].parse(response);
	await logEventFromContext(ctx, 'handwrytten.auth.logout', {}, 'completed');
	return parsed;
};
