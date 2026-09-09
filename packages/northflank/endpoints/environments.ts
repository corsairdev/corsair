import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	EnvironmentsListPreviewsInput,
	EnvironmentsListPreviewsOutput,
} from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const listPreviews: NorthflankEndpoint<
	EnvironmentsListPreviewsInput,
	EnvironmentsListPreviewsOutput
> = async (ctx, input) => {
	const query: Record<string, unknown> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.cursor !== undefined) query.cursor = input.cursor;

	const res = await makeNorthflankRequest<EnvironmentsListPreviewsOutput>(
		`projects/${input.projectId}/preview-blueprints/${input.previewBlueprintId}/preview-environments`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.environments.listPreviews',
		{
			projectId: input.projectId,
			previewBlueprintId: input.previewBlueprintId,
		},
		'completed',
	);
	return res;
};

export const EnvironmentsEndpoints = {
	listPreviews,
} as const;
