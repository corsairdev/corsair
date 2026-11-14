import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import { makeFolkRequest } from '../client';
import type {
	InteractionsCreateResponse,
	InteractionsDeleteResponse,
	InteractionsGetResponse,
	InteractionsListPastResponse,
	InteractionsListResponse,
	InteractionsListUpcomingResponse,
	InteractionsUpdateResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['interactionsList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.interactionsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		'entity.id': parsedInput.entityId,
		timeframe: parsedInput.timeframe,
	};
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<InteractionsListResponse>(
		'/interactions',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.interactionsList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.list',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const listPast: FolkEndpoints['interactionsListPast'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FolkEndpointInputSchemas.interactionsListPast.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		'entity.id': parsedInput.entityId,
	};
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<InteractionsListPastResponse>(
		'/interactions/past',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.interactionsListPast.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.listPast',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const listUpcoming: FolkEndpoints['interactionsListUpcoming'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FolkEndpointInputSchemas.interactionsListUpcoming.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		'entity.id': parsedInput.entityId,
	};
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown =
		await makeFolkRequest<InteractionsListUpcomingResponse>(
			'/interactions/upcoming',
			ctx.key,
			{
				method: 'GET',
				query,
			},
		);

	const parsed =
		FolkEndpointOutputSchemas.interactionsListUpcoming.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.listUpcoming',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const get: FolkEndpoints['interactionsGet'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.interactionsGet.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<InteractionsGetResponse>(
		`/interactions/${encodeURIComponent(parsedInput.interactionId)}`,
		ctx.key,
		{ method: 'GET', query: { 'entity.id': parsedInput.entityId } },
	);

	const parsed = FolkEndpointOutputSchemas.interactionsGet.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.get',
		{ interactionId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const create: FolkEndpoints['interactionsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.interactionsCreate.parse(input);
	const { idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<InteractionsCreateResponse>(
		'/interactions',
		ctx.key,
		{
			method: 'POST',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.interactionsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.create',
		{ interactionId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: FolkEndpoints['interactionsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.interactionsUpdate.parse(input);
	const { interactionId, idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<InteractionsUpdateResponse>(
		`/interactions/${encodeURIComponent(interactionId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.interactionsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.update',
		{ interactionId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const deleteInteraction: FolkEndpoints['interactionsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.interactionsDelete.parse(input);
	const headers: Record<string, string> = {};
	if (parsedInput.idempotencyKey) {
		headers['Idempotency-Key'] = parsedInput.idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<InteractionsDeleteResponse>(
		`/interactions/${encodeURIComponent(parsedInput.interactionId)}`,
		ctx.key,
		{
			method: 'DELETE',
			query: { 'entity.id': parsedInput.entityId },
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.interactionsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'folk.interactions.delete',
		{ interactionId: parsed.data.id },
		'completed',
	);

	return parsed;
};
