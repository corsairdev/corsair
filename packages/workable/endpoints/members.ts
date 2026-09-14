import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableMember } from '../schema/database';
import { persistRow, persistRows } from './persist';
import { compactBody, compactQuery, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['membersList'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['membersList']
	>('/members', ctx.key, account, {
		query: compactQuery({
			limit: input.limit,
			since_id: input.since_id,
			max_id: input.max_id,
			role: input.role,
			shortcode: input.shortcode,
			email: input.email,
			name: input.name,
			status: input.status,
		}),
	});
	await persistRows(ctx.db.members, WorkableMember, response.members, 'member');
	await logEventFromContext(ctx, 'workable.members.list', {}, 'completed');
	return response;
};

export const invite: WorkableEndpoints['membersInvite'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['membersInvite']
	>('/members/invite', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			email: input.email,
			roles: input.roles,
			member_id: input.member_id,
			collaboration_rules: input.collaboration_rules,
		}),
	});
	await persistRow(ctx.db.members, WorkableMember, response, 'member');
	await logEventFromContext(
		ctx,
		'workable.members.invite',
		{ email: input.email },
		'completed',
	);
	return response;
};

export const update: WorkableEndpoints['membersUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['membersUpdate']
	>('/members', ctx.key, account, {
		method: 'PUT',
		body: compactBody({
			id: input.id,
			roles: input.roles,
			collaboration_rules: input.collaboration_rules,
		}),
	});
	await persistRow(ctx.db.members, WorkableMember, response, 'member');
	await logEventFromContext(
		ctx,
		'workable.members.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const enable: WorkableEndpoints['membersEnable'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['membersEnable']
	>(`/members/${encodeURIComponent(input.id)}/enable`, ctx.key, account, {
		method: 'POST',
	});
	await logEventFromContext(
		ctx,
		'workable.members.enable',
		{ id: input.id },
		'completed',
	);
	return response ?? {};
};
