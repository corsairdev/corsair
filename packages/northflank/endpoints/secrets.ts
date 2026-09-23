import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	SecretsCreateInput,
	SecretsCreateOrUpdateInput,
	SecretsCreateOrUpdateOutput,
	SecretsCreateOutput,
	SecretsGetDetailsInput,
	SecretsGetDetailsOutput,
	SecretsGetInput,
	SecretsGetOutput,
	SecretsListInput,
	SecretsListOutput,
	SecretsPatchInput,
	SecretsPatchOutput,
	SecretsUpdateInput,
	SecretsUpdateOutput,
} from './types';
import {
	SecretsCreateInputSchema,
	SecretsCreateOrUpdateInputSchema,
	SecretsCreateOrUpdateOutputSchema,
	SecretsCreateOutputSchema,
	SecretsGetDetailsInputSchema,
	SecretsGetDetailsOutputSchema,
	SecretsGetInputSchema,
	SecretsGetOutputSchema,
	SecretsListInputSchema,
	SecretsListOutputSchema,
	SecretsPatchInputSchema,
	SecretsPatchOutputSchema,
	SecretsUpdateInputSchema,
	SecretsUpdateOutputSchema,
} from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

type PaginationQuery = {
	page?: number;
	per_page?: number;
	cursor?: string;
};

function toPaginationQuery(input: PaginationQuery): PaginationQuery {
	const query: PaginationQuery = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.cursor !== undefined) query.cursor = input.cursor;
	return query;
}

export const list: NorthflankEndpoint<
	SecretsListInput,
	SecretsListOutput
> = async (ctx, input) => {
	const validatedInput = SecretsListInputSchema.parse(input);

	const res = await makeNorthflankRequest<SecretsListOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}/secrets`,
		ctx.key,
		{ method: 'GET', query: toPaginationQuery(validatedInput) },
	);

	const parsedSecrets = SecretsListOutputSchema.parse(res);
	await logEventFromContext(
		ctx,
		'northflank.secrets.list',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return parsedSecrets;
};

export const get: NorthflankEndpoint<
	SecretsGetInput,
	SecretsGetOutput
> = async (ctx, input) => {
	const validatedInput = SecretsGetInputSchema.parse(input);
	const res = await makeNorthflankRequest<SecretsGetOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}/secrets/${encodeURIComponent(validatedInput.secretId)}`,
		ctx.key,
		{
			method: 'GET',
			query:
				validatedInput.show === undefined ? {} : { show: validatedInput.show },
		},
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

// POST /v1/projects/{projectId}/secrets
// Docs: /docs/v1/api/project/secrets/create-project-secret
export const create: NorthflankEndpoint<
	SecretsCreateInput,
	SecretsCreateOutput
> = async (ctx, input) => {
	const validatedInput = SecretsCreateInputSchema.parse(input);
	const { projectId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<SecretsCreateOutput>(
		`projects/${encodeURIComponent(projectId)}/secrets`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	// SECURITY: Never log secret values or secret content payloads
	await logEventFromContext(
		ctx,
		'northflank.secrets.create',
		{ projectId, name: validatedInput.name },
		'completed',
	);
	return SecretsCreateOutputSchema.parse(res);
};

// PUT /v1/projects/{projectId}/secrets — upsert keyed by name in the body.
// Docs: /docs/v1/api/project/secrets/put-project-secret
export const createOrUpdate: NorthflankEndpoint<
	SecretsCreateOrUpdateInput,
	SecretsCreateOrUpdateOutput
> = async (ctx, input) => {
	const validatedInput = SecretsCreateOrUpdateInputSchema.parse(input);
	const { projectId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<SecretsCreateOrUpdateOutput>(
		`projects/${encodeURIComponent(projectId)}/secrets`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// SECURITY: Never log secret values or secret content payloads
	await logEventFromContext(
		ctx,
		'northflank.secrets.createOrUpdate',
		{ projectId, name: validatedInput.name },
		'completed',
	);
	return SecretsCreateOrUpdateOutputSchema.parse(res);
};

// PATCH /v1/projects/{projectId}/secrets/{secretId}
// Docs: /docs/v1/api/project/secrets/patch-project-secret
export const patch: NorthflankEndpoint<
	SecretsPatchInput,
	SecretsPatchOutput
> = async (ctx, input) => {
	const validatedInput = SecretsPatchInputSchema.parse(input);
	const { projectId, secretId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<SecretsPatchOutput>(
		`projects/${encodeURIComponent(projectId)}/secrets/${encodeURIComponent(secretId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	// SECURITY: Never log secret values or secret content payloads
	await logEventFromContext(
		ctx,
		'northflank.secrets.patch',
		{ projectId, secretId },
		'completed',
	);
	return SecretsPatchOutputSchema.parse(res);
};

// POST /v1/projects/{projectId}/secrets/{secretId}
// Docs: /docs/v1/api/project/secrets/update-project-secret
export const update: NorthflankEndpoint<
	SecretsUpdateInput,
	SecretsUpdateOutput
> = async (ctx, input) => {
	const validatedInput = SecretsUpdateInputSchema.parse(input);
	const { projectId, secretId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<SecretsUpdateOutput>(
		`projects/${encodeURIComponent(projectId)}/secrets/${encodeURIComponent(secretId)}`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	// SECURITY: Never log secret values or secret content payloads
	await logEventFromContext(
		ctx,
		'northflank.secrets.update',
		{ projectId, secretId },
		'completed',
	);
	return SecretsUpdateOutputSchema.parse(res);
};

// GET /v1/projects/{projectId}/secrets/{secretId}/details
// Docs: /docs/v1/api/project/secrets/get-project-secret-details
export const getDetails: NorthflankEndpoint<
	SecretsGetDetailsInput,
	SecretsGetDetailsOutput
> = async (ctx, input) => {
	const validatedInput = SecretsGetDetailsInputSchema.parse(input);
	const res = await makeNorthflankRequest<SecretsGetDetailsOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}/secrets/${encodeURIComponent(validatedInput.secretId)}/details`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.secrets.getDetails',
		{
			projectId: validatedInput.projectId,
			secretId: validatedInput.secretId,
		},
		'completed',
	);
	return SecretsGetDetailsOutputSchema.parse(res);
};

export const SecretsEndpoints = {
	list,
	get,
	create,
	createOrUpdate,
	patch,
	update,
	getDetails,
} as const;
