import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['incidentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsCreate']
	>('/api/v3/incidents', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			requester_email: input.requester_email,
			name: input.name,
			summary: input.summary,
			description: input.description,
			call: input.call ?? false,
			sms: input.sms ?? false,
			email: input.email ?? false,
			push: input.push ?? false,
			critical_alert: input.critical_alert ?? false,
			team_wait: input.team_wait,
			policy_id: input.policy_id,
			metadata: input.metadata,
		},
		idempotent: false,
	});

	await logEventFromContext(
		ctx,
		'betterstack.incidents.create',
		auditPayload(input, ['policy_id']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['incidentsGet'] = async (ctx, input) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsGet']
	>(
		buildPath('/api/v3/incidents/{incident_id}', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidents.get',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['incidentsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsList']
	>('/api/v3/incidents', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
			from: input.from,
			to: input.to,
			monitor_id: input.monitor_id,
			heartbeat_id: input.heartbeat_id,
			resolved: input.resolved,
			acknowledged: input.acknowledged,
			metadata: input.metadata,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.incidents.list',
		auditPayload(input, ['monitor_id', 'heartbeat_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['incidentsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsRemove']
	>(
		buildPath('/api/v3/incidents/{incident_id}', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidents.remove',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};

export const acknowledge: BetterstackEndpoints['incidentsAcknowledge'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsAcknowledge']
	>(
		buildPath('/api/v3/incidents/{incident_id}/acknowledge', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				acknowledged_by: input.acknowledged_by,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidents.acknowledge',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};

export const resolve: BetterstackEndpoints['incidentsResolve'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsResolve']
	>(
		buildPath('/api/v3/incidents/{incident_id}/resolve', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				resolved_by: input.resolved_by,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidents.resolve',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};

export const escalate: BetterstackEndpoints['incidentsEscalate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsEscalate']
	>(
		buildPath('/api/v3/incidents/{incident_id}/escalate', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				escalation_type: input.escalation_type,
				user_email: input.user_email,
				user_id: input.user_id,
				team_name: input.team_name,
				team_id: input.team_id,
				schedule_id: input.schedule_id,
				policy_id: input.policy_id,
				call: input.call,
				sms: input.sms,
				email: input.email,
				push: input.push,
				critical_alert: input.critical_alert,
				metadata: input.metadata,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidents.escalate',
		auditPayload(input, ['incident_id', 'schedule_id', 'policy_id']),
		'completed',
	);
	return result;
};

export const timeline: BetterstackEndpoints['incidentsTimeline'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentsTimeline']
	>(
		buildPath('/api/v3/incidents/{incident_id}/timeline', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'GET',
			query: withPagination(input),
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidents.timeline',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};
