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
import {
	SecretsCreateInputSchema,
	SecretsCreateOutputSchema,
	SecretsGetInputSchema,
	SecretsGetOutputSchema,
	SecretsListInputSchema,
	SecretsListOutputSchema,
	SecretsUpdateInputSchema,
	SecretsUpdateOutputSchema,
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
	const validatedInput = SecretsListInputSchema.parse(input);
	const query: Record<string, unknown> = {};
	if (validatedInput.page !== undefined) query.page = validatedInput.page;
	if (validatedInput.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput.cursor !== undefined) query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<unknown>(
		`projects/${validatedInput.projectId}/secrets`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.secrets.list',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return SecretsListOutputSchema.parse(res);
};

export const get: NorthflankEndpoint<
	SecretsGetInput,
	SecretsGetOutput
> = async (ctx, input) => {
	const validatedInput = SecretsGetInputSchema.parse(input);
	const res = await makeNorthflankRequest<unknown>(
		`projects/${validatedInput.projectId}/secrets/${validatedInput.secretId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.secrets.get',
		{
			projectId: validatedInput.projectId,
			secretId: validatedInput.secretId,
		},
		'completed',
	);
	return SecretsGetOutputSchema.parse(res);
};

export const create: NorthflankEndpoint<
	SecretsCreateInput,
	SecretsCreateOutput
> = async (ctx, input) => {
	const validatedInput = SecretsCreateInputSchema.parse(input);
	const { projectId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<unknown>(
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
		{ projectId, name: validatedInput.name },
		'completed',
	);
	return SecretsCreateOutputSchema.parse(res);
};

export const update: NorthflankEndpoint<
	SecretsUpdateInput,
	SecretsUpdateOutput
> = async (ctx, input) => {
	const validatedInput = SecretsUpdateInputSchema.parse(input);
	const { projectId, secretId, ...body } = validatedInput;
	// Official Northflank project-secret update uses POST /v1/projects/{projectId}/secrets/{secretId}
	const res = await makeNorthflankRequest<unknown>(
		`projects/${projectId}/secrets/${secretId}`,
		ctx.key,
		{
			method: 'POST',
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
	return SecretsUpdateOutputSchema.parse(res);
};

export const SecretsEndpoints = {
	list,
	get,
	create,
	update,
} as const;
