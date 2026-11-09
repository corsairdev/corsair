import { logEventFromContext } from 'corsair/core';
import type { GongContext, GongUserEndpoints } from '..';
import { gongRequest } from '../client';
import { gongCredentials } from './family-context';
import type { GongUsersOutputs } from './users-types';

async function call<T>(
	ctx: GongContext,
	method: 'GET' | 'POST',
	path: string,
	input: Record<string, unknown>,
	query?: Record<string, unknown>,
	body?: unknown,
): Promise<T> {
	const baseUrl = ctx.options.baseUrl;
	if (!baseUrl)
		throw new Error(
			'Gong baseUrl is required; use the workspace API URL from Gong',
		);
	new URL(baseUrl);
	const credentials = gongCredentials(ctx);
	const result = await gongRequest<T>({
		baseUrl,
		credentials,
		method,
		path,
		query,
		body,
	});
	await logEventFromContext(
		ctx,
		`gong.users.${path.replaceAll('/', '.')}`,
		{ input },
		'completed',
	);
	return result;
}

export const listUsers: GongUserEndpoints['listUsers'] = (ctx, input) =>
	call<GongUsersOutputs['listUsers']>(ctx, 'GET', '/v2/users', input, input);
export const listMultipleUsers: GongUserEndpoints['listMultipleUsers'] = (
	ctx,
	input,
) =>
	call<GongUsersOutputs['listMultipleUsers']>(
		ctx,
		'POST',
		'/v2/users/extensive',
		input,
		undefined,
		input,
	);
function safeUserId(id: string): string {
	if (!/^[0-9]{1,20}$/.test(id)) throw new Error('Unsafe Gong user id');
	return encodeURIComponent(id);
}

export const getUser: GongUserEndpoints['getUser'] = (ctx, input) =>
	call<GongUsersOutputs['getUser']>(
		ctx,
		'GET',
		`/v2/users/${safeUserId(input.id)}`,
		input,
	);
export const getUserHistory: GongUserEndpoints['getUserHistory'] = (
	ctx,
	input,
) =>
	call<GongUsersOutputs['getUserHistory']>(
		ctx,
		'GET',
		`/v2/users/${safeUserId(input.id)}/settings-history`,
		input,
	);
