import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import { makeFolkRequest } from '../client';
import type {
	GroupsCreateResponse,
	GroupsListResponse,
	GroupsUpdateResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['groupsList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.groupsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupsListResponse>(
		'/groups',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupsList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groups.list',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const create: FolkEndpoints['groupsCreate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.groupsCreate.parse(input);
	const { idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupsCreateResponse>(
		'/groups',
		ctx.key,
		{
			method: 'POST',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groups.create',
		{ groupId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: FolkEndpoints['groupsUpdate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.groupsUpdate.parse(input);
	const { groupId, idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<GroupsUpdateResponse>(
		`/groups/${encodeURIComponent(groupId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.groupsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.groups.update',
		{ groupId: parsed.data.id },
		'completed',
	);

	return parsed;
};
