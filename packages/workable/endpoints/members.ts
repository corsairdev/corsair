import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableMember } from '../schema/database';
import { evictRow, persistRow, persistRows } from './persist';
import {
	compactBody,
	compactQuery,
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

export const list: WorkableEndpoints['membersList'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.membersList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<WorkableEndpointOutputs['membersList']>(
		'/members',
		ctx.key,
		account,
		{
			query: compactQuery({
				limit: valid.limit,
				since_id: valid.since_id,
				max_id: valid.max_id,
				role: valid.role,
				shortcode: valid.shortcode,
				email: valid.email,
				name: valid.name,
				status: valid.status,
			}),
		},
	);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.membersList,
		raw,
	);
	await persistRows(ctx.db.members, WorkableMember, response.members, 'member');
	await logEventFromContext(ctx, 'workable.members.list', {}, 'completed');
	return response;
};

export const invite: WorkableEndpoints['membersInvite'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.membersInvite,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['membersInvite']
	>('/members/invite', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			email: valid.email,
			roles: valid.roles,
			member_id: valid.member_id,
			collaboration_rules: valid.collaboration_rules,
		}),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.membersInvite,
		raw,
	);
	await persistRow(ctx.db.members, WorkableMember, response, 'member');
	// The invitee email is intentionally not logged — operational logs must
	// not carry PII; the member id is persisted to the local cache instead.
	await logEventFromContext(ctx, 'workable.members.invite', {}, 'completed');
	return response;
};

export const update: WorkableEndpoints['membersUpdate'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.membersUpdate,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['membersUpdate']
	>('/members', ctx.key, account, {
		method: 'PUT',
		body: compactBody({
			id: valid.id,
			roles: valid.roles,
			collaboration_rules: valid.collaboration_rules,
		}),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.membersUpdate,
		raw,
	);
	await persistRow(ctx.db.members, WorkableMember, response, 'member');
	await logEventFromContext(
		ctx,
		'workable.members.update',
		{ id: valid.id },
		'completed',
	);
	return response;
};

export const enable: WorkableEndpoints['membersEnable'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.membersEnable,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['membersEnable']
	>(`/members/${encodeURIComponent(valid.id)}/enable`, ctx.key, account, {
		method: 'POST',
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.membersEnable,
		// 204 No Content carries no body — validate the empty object instead.
		raw ?? {},
	);
	// Enable returns 204 with no body, so there is nothing to persist — evict
	// the cached row instead so reads stop reporting the member as inactive.
	await evictRow(ctx.db.members, valid.id, 'member');
	await logEventFromContext(
		ctx,
		'workable.members.enable',
		{ id: valid.id },
		'completed',
	);
	return response;
};
