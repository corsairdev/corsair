import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { ServicesListInput, ServicesListOutput } from './types';
import { ServicesListInputSchema, ServicesListOutputSchema } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

// GET /v1/projects/{projectId}/services
// Docs: /docs/v1/api/project/services/list-services
export const list: NorthflankEndpoint<
	ServicesListInput,
	ServicesListOutput
> = async (ctx, input) => {
	const validatedInput = ServicesListInputSchema.parse(input);
	const query: { page?: number; per_page?: number; cursor?: string } = {};
	if (validatedInput.page !== undefined) query.page = validatedInput.page;
	if (validatedInput.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput.cursor !== undefined) query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<ServicesListOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}/services`,
		ctx.key,
		{ method: 'GET', query },
	);

	const parsedServices = ServicesListOutputSchema.parse(res);
	await logEventFromContext(
		ctx,
		'northflank.services.list',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return parsedServices;
};

export const ServicesEndpoints = {
	list,
} as const;
