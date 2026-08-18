import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['incidentCommentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentCommentsCreate']
	>(
		buildPath('/api/v2/incidents/{incident_id}/comments', {
			incident_id: input.incident_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				user_email: input.user_email,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidentComments.create',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['incidentCommentsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentCommentsGet']
	>(
		buildPath('/api/v2/incidents/{incident_id}/comments/{comment_id}', {
			incident_id: input.incident_id,
			comment_id: input.comment_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidentComments.get',
		auditPayload(input, ['incident_id', 'comment_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['incidentCommentsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentCommentsList']
	>(
		buildPath('/api/v2/incidents/{incident_id}/comments', {
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
		'betterstack.incidentComments.list',
		auditPayload(input, ['incident_id']),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['incidentCommentsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentCommentsUpdate']
	>(
		buildPath('/api/v2/incidents/{incident_id}/comments/{comment_id}', {
			incident_id: input.incident_id,
			comment_id: input.comment_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				content: input.content,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidentComments.update',
		auditPayload(input, ['incident_id', 'comment_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['incidentCommentsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['incidentCommentsRemove']
	>(
		buildPath('/api/v2/incidents/{incident_id}/comments/{comment_id}', {
			incident_id: input.incident_id,
			comment_id: input.comment_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.incidentComments.remove',
		auditPayload(input, ['incident_id', 'comment_id']),
		'completed',
	);
	return result;
};
