import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	cacheHeartbeats,
	cacheHeartbeatsList,
	evictHeartbeats,
} from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['heartbeatsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatsCreate']
	>('/api/v2/heartbeats', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			name: input.name,
			period: input.period,
			grace: input.grace,
			call: input.call ?? false,
			sms: input.sms ?? false,
			email: input.email ?? false,
			push: input.push ?? false,
			critical_alert: input.critical_alert ?? false,
			team_wait: input.team_wait,
			heartbeat_group_id: input.heartbeat_group_id,
			sort_index: input.sort_index,
			paused: input.paused,
			server_timezone: input.server_timezone,
			maintenance_days: input.maintenance_days,
			maintenance_from: input.maintenance_from,
			maintenance_to: input.maintenance_to,
			maintenance_timezone: input.maintenance_timezone,
			policy_id: input.policy_id,
		},
		idempotent: false,
	});

	await cacheHeartbeats(ctx.db.heartbeats, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeats.create',
		auditPayload(input, ['heartbeat_group_id', 'sort_index', 'policy_id']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['heartbeatsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatsGet']
	>(
		buildPath('/api/v2/heartbeats/{heartbeat_id}', {
			heartbeat_id: input.heartbeat_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheHeartbeats(ctx.db.heartbeats, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeats.get',
		auditPayload(input, ['heartbeat_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['heartbeatsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatsList']
	>('/api/v2/heartbeats', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await cacheHeartbeatsList(ctx.db.heartbeats, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeats.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['heartbeatsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatsUpdate']
	>(
		buildPath('/api/v2/heartbeats/{heartbeat_id}', {
			heartbeat_id: input.heartbeat_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				period: input.period,
				grace: input.grace,
				// Partial update: an omitted channel must stay omitted, or editing
				// the grace period would silently disable the heartbeat's alerts.
				call: input.call,
				sms: input.sms,
				email: input.email,
				push: input.push,
				critical_alert: input.critical_alert,
				team_wait: input.team_wait,
				heartbeat_group_id: input.heartbeat_group_id,
				sort_index: input.sort_index,
				maintenance_days: input.maintenance_days,
				maintenance_from: input.maintenance_from,
				maintenance_to: input.maintenance_to,
				maintenance_timezone: input.maintenance_timezone,
				paused: input.paused,
				server_timezone: input.server_timezone,
				policy_id: input.policy_id,
			},
		},
	);

	await cacheHeartbeats(ctx.db.heartbeats, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeats.update',
		auditPayload(input, [
			'heartbeat_id',
			'heartbeat_group_id',
			'sort_index',
			'policy_id',
		]),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['heartbeatsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatsRemove']
	>(
		buildPath('/api/v2/heartbeats/{heartbeat_id}', {
			heartbeat_id: input.heartbeat_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictHeartbeats(ctx.db.heartbeats, input.heartbeat_id);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeats.remove',
		auditPayload(input, ['heartbeat_id']),
		'completed',
	);
	return result;
};

export const availability: BetterstackEndpoints['heartbeatsAvailability'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['heartbeatsAvailability']
		>(
			buildPath('/api/v2/heartbeats/{heartbeat_id}/availability', {
				heartbeat_id: input.heartbeat_id,
			}),
			ctx.key,
			{
				method: 'GET',
				query: {
					from: input.from,
					to: input.to,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'betterstack.heartbeats.availability',
			auditPayload(input, ['heartbeat_id']),
			'completed',
		);
		return result;
	};
