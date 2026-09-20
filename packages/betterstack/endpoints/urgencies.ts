import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheUrgencies, cacheUrgenciesList, evictUrgencies } from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['urgenciesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgenciesCreate']
	>('/api/v2/urgencies', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			name: input.name,
			sms: input.sms,
			call: input.call,
			email: input.email,
			push: input.push,
			critical_alert: input.critical_alert,
		},
		idempotent: false,
	});

	await cacheUrgencies(ctx.db.urgencies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.urgencies.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['urgenciesGet'] = async (ctx, input) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgenciesGet']
	>(
		buildPath('/api/v2/urgencies/{urgency_id}', {
			urgency_id: input.urgency_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheUrgencies(ctx.db.urgencies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.urgencies.get',
		auditPayload(input, ['urgency_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['urgenciesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgenciesList']
	>('/api/v2/urgencies', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await cacheUrgenciesList(ctx.db.urgencies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.urgencies.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['urgenciesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgenciesUpdate']
	>(
		buildPath('/api/v2/urgencies/{urgency_id}', {
			urgency_id: input.urgency_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				sms: input.sms,
				call: input.call,
				email: input.email,
				push: input.push,
				critical_alert: input.critical_alert,
			},
		},
	);

	await cacheUrgencies(ctx.db.urgencies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.urgencies.update',
		auditPayload(input, ['urgency_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['urgenciesRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgenciesRemove']
	>(
		buildPath('/api/v2/urgencies/{urgency_id}', {
			urgency_id: input.urgency_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictUrgencies(ctx.db.urgencies, input.urgency_id);

	await logEventFromContext(
		ctx,
		'betterstack.urgencies.remove',
		auditPayload(input, ['urgency_id']),
		'completed',
	);
	return result;
};
