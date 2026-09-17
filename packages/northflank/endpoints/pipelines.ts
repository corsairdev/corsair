import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { PipelinesListInput, PipelinesListOutput } from './types';
import { PipelinesListInputSchema, PipelinesListOutputSchema } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

// GET /v1/projects/{projectId}/pipelines
// Docs: /docs/v1/api/project/pipelines/list-pipelines
export const list: NorthflankEndpoint<
	PipelinesListInput,
	PipelinesListOutput
> = async (ctx, input) => {
	const validatedInput = PipelinesListInputSchema.parse(input);
	const query: { page?: number; per_page?: number; cursor?: string } = {};
	if (validatedInput.page !== undefined) query.page = validatedInput.page;
	if (validatedInput.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput.cursor !== undefined) query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<PipelinesListOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}/pipelines`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.pipelines.list',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return PipelinesListOutputSchema.parse(res);
};

export const PipelinesEndpoints = {
	list,
} as const;
