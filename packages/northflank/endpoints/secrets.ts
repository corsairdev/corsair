import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	SecretsCreateInput,
	SecretsCreateOutput,
	SecretsGetInput,
	SecretsGetOutput,
	SecretsListInput,
	SecretsListOutput,
	SecretsUpdateInput,
	SecretsUpdateOutput,
} from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const list: NorthflankEndpoint<
	SecretsListInput,
	SecretsListOutput
> = async (ctx, input) => {
	const query: Record<string, unknown> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.cursor !== undefined) query.cursor = input.cursor;

	const res = await makeNorthflankRequest<SecretsListOutput>(
		`projects/${input.projectId}/secrets`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.secrets.list',
		{ projectId: input.projectId },
		'completed',
	);
	return res;
};

export const get: NorthflankEndpoint<
	SecretsGetInput,
	SecretsGetOutput
> = async (ctx, input) => {
	const res = await makeNorthflankRequest<SecretsGetOutput>(
		`projects/${input.projectId}/secrets/${input.secretId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.secrets.get',
		{ projectId: input.projectId, secretId: input.secretId },
		'completed',
	);
	return res;
};

export const create: NorthflankEndpoint<
	SecretsCreateInput,
	SecretsCreateOutput
> = async (ctx, input) => {
	const { projectId, ...body } = input;
	const res = await makeNorthflankRequest<SecretsCreateOutput>(
		`projects/${projectId}/secrets`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	// SECURITY: Never log secret values or secret data payloads
	await logEventFromContext(
		ctx,
		'northflank.secrets.create',
		{ projectId, name: input.name },
		'completed',
	);
	return res;
};

export const update: NorthflankEndpoint<
	SecretsUpdateInput,
	SecretsUpdateOutput
> = async (ctx, input) => {
	const { projectId, secretId, ...body } = input;
	const res = await makeNorthflankRequest<SecretsUpdateOutput>(
		`projects/${projectId}/secrets/${secretId}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	// SECURITY: Never log secret values or updated data payloads
	await logEventFromContext(
		ctx,
		'northflank.secrets.update',
		{ projectId, secretId },
		'completed',
	);
	return res;
};

export const SecretsEndpoints = {
	list,
	get,
	create,
	update,
} as const;
