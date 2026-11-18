import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import type { FolkQueryValue } from '../client';
import { flattenFilter, makeFolkRequest } from '../client';
import type {
	PeopleCreateResponse,
	PeopleDeleteResponse,
	PeopleGetResponse,
	PeopleListResponse,
	PeopleUpdateResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['peopleList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.peopleList.parse(input);
	const query: Record<string, FolkQueryValue | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;
	if (parsedInput.combinator !== undefined)
		query.combinator = parsedInput.combinator;
	if (parsedInput.filter) {
		Object.assign(query, flattenFilter(parsedInput.filter));
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<PeopleListResponse>(
		'/people',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.peopleList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.people.list',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const get: FolkEndpoints['peopleGet'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.peopleGet.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<PeopleGetResponse>(
		`/people/${encodeURIComponent(parsedInput.personId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FolkEndpointOutputSchemas.peopleGet.parse(response);

	await logEventFromContext(
		ctx,
		'folk.people.get',
		{ personId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const create: FolkEndpoints['peopleCreate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.peopleCreate.parse(input);
	const { idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<PeopleCreateResponse>(
		'/people',
		ctx.key,
		{
			method: 'POST',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.peopleCreate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.people.create',
		{ personId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: FolkEndpoints['peopleUpdate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.peopleUpdate.parse(input);
	const { personId, idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<PeopleUpdateResponse>(
		`/people/${encodeURIComponent(personId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.peopleUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.people.update',
		{ personId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const deletePerson: FolkEndpoints['peopleDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.peopleDelete.parse(input);
	const headers: Record<string, string> = {};
	if (parsedInput.idempotencyKey) {
		headers['Idempotency-Key'] = parsedInput.idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<PeopleDeleteResponse>(
		`/people/${encodeURIComponent(parsedInput.personId)}`,
		ctx.key,
		{
			method: 'DELETE',
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.peopleDelete.parse(response);

	await logEventFromContext(
		ctx,
		'folk.people.delete',
		{ personId: parsed.data.id },
		'completed',
	);

	return parsed;
};
