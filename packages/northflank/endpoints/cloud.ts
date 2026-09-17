import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	CloudNodeTypesListInput,
	CloudNodeTypesListOutput,
	CloudRegionsListInput,
	CloudRegionsListOutput,
} from './types';
import {
	CloudNodeTypesListInputSchema,
	CloudNodeTypesListOutputSchema,
	CloudRegionsListInputSchema,
	CloudRegionsListOutputSchema,
} from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

// GET /v1/cloud-providers/node-types
// Docs: /docs/v1/api/team/cloud-providers/list-provider-node-types
export const listNodeTypes: NorthflankEndpoint<
	CloudNodeTypesListInput,
	CloudNodeTypesListOutput
> = async (ctx, input = {}) => {
	const validatedInput = CloudNodeTypesListInputSchema.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		page: validatedInput?.page,
		per_page: validatedInput?.per_page,
		cursor: validatedInput?.cursor,
		provider: validatedInput?.provider,
		region: validatedInput?.region,
		family: validatedInput?.family,
		maxGenerationAge: validatedInput?.maxGenerationAge,
		hasGpu: validatedInput?.hasGpu,
	};

	const res = await makeNorthflankRequest<CloudNodeTypesListOutput>(
		'cloud-providers/node-types',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.cloudProviders.listNodeTypes',
		{},
		'completed',
	);
	return CloudNodeTypesListOutputSchema.parse(res);
};

// GET /v1/cloud-providers/regions
// Docs: /docs/v1/api/team/cloud-providers/list-provider-regions
export const listRegions: NorthflankEndpoint<
	CloudRegionsListInput,
	CloudRegionsListOutput
> = async (ctx, input = {}) => {
	const validatedInput = CloudRegionsListInputSchema.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		page: validatedInput?.page,
		per_page: validatedInput?.per_page,
		cursor: validatedInput?.cursor,
		provider: validatedInput?.provider,
	};

	const res = await makeNorthflankRequest<CloudRegionsListOutput>(
		'cloud-providers/regions',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.cloudProviders.listRegions',
		{},
		'completed',
	);
	return CloudRegionsListOutputSchema.parse(res);
};

export const CloudProvidersEndpoints = {
	listNodeTypes,
	listRegions,
} as const;
