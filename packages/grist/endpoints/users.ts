import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const disable: GristEndpoints['users.disable'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['users.disable'].parse(input);
	const userIdStr = encodeURIComponent(String(parsedInput.userId));
	const response = await makeGristRequest<unknown>(
		`/users/${userIdStr}/disable`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['users.disable'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.users.disable',
		{ userId: parsedInput.userId },
		'completed',
	);
	return parsed;
};

export const enable: GristEndpoints['users.enable'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['users.enable'].parse(input);
	const userIdStr = encodeURIComponent(String(parsedInput.userId));
	const response = await makeGristRequest<unknown>(
		`/users/${userIdStr}/enable`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['users.enable'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.users.enable',
		{ userId: parsedInput.userId },
		'completed',
	);
	return parsed;
};

export const deleteUser: GristEndpoints['users.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['users.delete'].parse(input);
	const userIdStr = encodeURIComponent(String(parsedInput.userId));
	const response = await makeGristRequest<unknown>(
		`/users/${userIdStr}`,
		ctx.key,
		{
			method: 'DELETE',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['users.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.users.delete',
		{ userId: parsedInput.userId },
		'completed',
	);
	return parsed;
};
