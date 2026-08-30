import { logEventFromContext } from 'corsair/core';
import type { DreamstudioEndpoints } from '..';
import { makeDreamstudioRequest } from '../client';
import { DreamstudioEngine } from '../schema';
import {
	ListEnginesOutputSchema,
	UserAccountOutputSchema,
	UserBalanceOutputSchema,
} from './types';

export const userBalance: DreamstudioEndpoints['userBalance'] = async (ctx) => {
	const raw = await makeDreamstudioRequest('/user/balance', ctx.key);
	const response = UserBalanceOutputSchema.parse(raw);
	await logEventFromContext(ctx, 'dreamstudio.user.balance', {}, 'completed');
	return response;
};

export const userAccount: DreamstudioEndpoints['userAccount'] = async (ctx) => {
	const raw = await makeDreamstudioRequest('/user/account', ctx.key);
	const response = UserAccountOutputSchema.parse(raw);
	await logEventFromContext(ctx, 'dreamstudio.user.account', {}, 'completed');
	return response;
};

export const listEngines: DreamstudioEndpoints['listEngines'] = async (ctx) => {
	const raw = await makeDreamstudioRequest('/engines/list', ctx.key);
	const response = ListEnginesOutputSchema.parse({
		engines: DreamstudioEngine.array().parse(raw),
	});
	await logEventFromContext(ctx, 'dreamstudio.engines.list', {}, 'completed');
	return response;
};
