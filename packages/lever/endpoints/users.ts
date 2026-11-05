import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withUserPath = (userId: string, suffix = ''): string =>
	leverPathParameter('/users/{userId}', 'userId', userId) + suffix;

export const listUsers: LeverEndpoints['listUsers'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listUsers']>(
		ctx,
		'/users',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'lever.users.list', input, 'completed');
	return response;
};

export const retrieveUser: LeverEndpoints['retrieveUser'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['retrieveUser']>(
		ctx,
		withUserPath(input.userId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.users.retrieve', input, 'completed');
	return response;
};

export const createUser: LeverEndpoints['createUser'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['createUser']>(
		ctx,
		'/users',
		{ method: 'POST', body: input },
	);
	await logEventFromContext(ctx, 'lever.users.create', input, 'completed');
	return response;
};

export const updateUser: LeverEndpoints['updateUser'] = async (ctx, input) => {
	const { userId, ...body } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['updateUser']>(
		ctx,
		withUserPath(userId),
		{ method: 'PUT', body },
	);
	await logEventFromContext(ctx, 'lever.users.update', input, 'completed');
	return response;
};

export const deactivateUser: LeverEndpoints['deactivateUser'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['deactivateUser']
	>(ctx, withUserPath(input.userId, '/deactivate'), {
		method: 'POST',
		body: undefined,
	});
	await logEventFromContext(ctx, 'lever.users.deactivate', input, 'completed');
	return response;
};

export const reactivateUser: LeverEndpoints['reactivateUser'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['reactivateUser']
	>(ctx, withUserPath(input.userId, '/reactivate'), {
		method: 'POST',
		body: undefined,
	});
	await logEventFromContext(ctx, 'lever.users.reactivate', input, 'completed');
	return response;
};
