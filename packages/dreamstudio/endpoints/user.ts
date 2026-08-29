import { logEventFromContext } from 'corsair/core';
import type { DreamStudioEndpoints } from '..';
import { makeDreamStudioRequest } from '../client';
import type { DreamStudioEndpointOutputs } from './types';

export const getBalance: DreamStudioEndpoints['getBalance'] = async (ctx) => {
	const response = await makeDreamStudioRequest<
		DreamStudioEndpointOutputs['getBalance']
	>('v1/user/balance', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'dreamstudio.user.balance', {}, 'completed');

	return response;
};

export const getAccount: DreamStudioEndpoints['getAccount'] = async (ctx) => {
	const response = await makeDreamStudioRequest<
		DreamStudioEndpointOutputs['getAccount']
	>('v1/user/account', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'dreamstudio.user.account', {}, 'completed');

	return response;
};

export const listEngines: DreamStudioEndpoints['listEngines'] = async (ctx) => {
	const response = await makeDreamStudioRequest<
		DreamStudioEndpointOutputs['listEngines']
	>('v1/engines/list', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'dreamstudio.engines.list', {}, 'completed');

	return response;
};
