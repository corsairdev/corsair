import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import { makeFolkRequest } from '../client';
import type {
	GroupMembersAddResponse,
	GroupMembersListResponse,
	GroupMembersRemoveResponse,
	GroupMembersUpdateResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['groupMembersList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.groupMembersList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupMembersListResponse>(
		`/groups/${encodeURIComponent(parsedInput.groupId)}/members`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupMembersList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groupMembers.list',
		{ groupId: parsedInput.groupId, count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const add: FolkEndpoints['groupMembersAdd'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.groupMembersAdd.parse(input);
	const { groupId, idempotencyKey, id, role } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupMembersAddResponse>(
		`/groups/${encodeURIComponent(groupId)}/members`,
		ctx.key,
		{
			method: 'POST',
			body: { id, role },
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupMembersAdd.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groupMembers.add',
		{ groupId, userId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: FolkEndpoints['groupMembersUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.groupMembersUpdate.parse(input);
	const { groupId, userId, role, idempotencyKey } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupMembersUpdateResponse>(
		`/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { role },
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupMembersUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groupMembers.update',
		{ groupId, userId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const remove: FolkEndpoints['groupMembersRemove'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.groupMembersRemove.parse(input);
	const { groupId, userId, idempotencyKey } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupMembersRemoveResponse>(
		`/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`,
		ctx.key,
		{
			method: 'DELETE',
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupMembersRemove.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groupMembers.remove',
		{ groupId, userId: parsed.data.id },
		'completed',
	);

	return parsed;
};
