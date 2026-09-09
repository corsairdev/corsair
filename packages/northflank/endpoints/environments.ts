import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	EnvironmentsListPreviewsInput,
	EnvironmentsListPreviewsOutput,
} from './types';
import {
	EnvironmentsListPreviewsInputSchema,
	EnvironmentsListPreviewsOutputSchema,
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
	const validatedInput = EnvironmentsListPreviewsInputSchema.parse(input);
	const query: Record<string, unknown> = {};
	if (validatedInput.page !== undefined) query.page = validatedInput.page;
	if (validatedInput.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput.cursor !== undefined) query.cursor = validatedInput.cursor;

	// Official Northflank route for previews under a preview-blueprint:
	// GET /v1/projects/{projectId}/preview-blueprints/{previewBlueprintId}/previews
	const res = await makeNorthflankRequest<unknown>(
		`projects/${validatedInput.projectId}/preview-blueprints/${validatedInput.previewBlueprintId}/previews`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.environments.listPreviews',
		{
			projectId: validatedInput.projectId,
			previewBlueprintId: validatedInput.previewBlueprintId,
		},
		'completed',
	);
	return EnvironmentsListPreviewsOutputSchema.parse(res);
};

export const EnvironmentsEndpoints = {
	listPreviews,
} as const;
