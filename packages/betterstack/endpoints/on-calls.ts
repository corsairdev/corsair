import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	cacheOnCallSchedules,
	cacheOnCallSchedulesList,
	evictOnCallSchedules,
} from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['onCallsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['onCallsCreate']
	>('/api/v2/on-calls', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			team_name: input.team_name,
		},
		idempotent: false,
	});

	await cacheOnCallSchedules(ctx.db.onCallSchedules, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.onCalls.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['onCallsGet'] = async (ctx, input) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['onCallsGet']
	>(
		buildPath('/api/v2/on-calls/{schedule_id}', {
			schedule_id: input.schedule_id,
		}),
		ctx.key,
		{
			method: 'GET',
			query: {
				date: input.date,
			},
		},
	);

	await cacheOnCallSchedules(ctx.db.onCallSchedules, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.onCalls.get',
		auditPayload(input, ['schedule_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['onCallsList'] = async (ctx, input) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['onCallsList']
	>('/api/v2/on-calls', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await cacheOnCallSchedulesList(ctx.db.onCallSchedules, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.onCalls.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['onCallsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['onCallsUpdate']
	>(
		buildPath('/api/v2/on-calls/{schedule_id}', {
			schedule_id: input.schedule_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
			},
		},
	);

	await cacheOnCallSchedules(ctx.db.onCallSchedules, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.onCalls.update',
		auditPayload(input, ['schedule_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['onCallsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['onCallsRemove']
	>(
		buildPath('/api/v2/on-calls/{schedule_id}', {
			schedule_id: input.schedule_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictOnCallSchedules(ctx.db.onCallSchedules, input.schedule_id);

	await logEventFromContext(
		ctx,
		'betterstack.onCalls.remove',
		auditPayload(input, ['schedule_id']),
		'completed',
	);
	return result;
};

export const events: BetterstackEndpoints['onCallsEvents'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['onCallsEvents']
	>(
		buildPath('/api/v2/on-calls/{schedule_id}/events', {
			schedule_id: input.schedule_id,
		}),
		ctx.key,
		{
			method: 'GET',
			query: withPagination(input),
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.onCalls.events',
		auditPayload(input, ['schedule_id']),
		'completed',
	);
	return result;
};
