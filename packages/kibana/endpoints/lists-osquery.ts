import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec path verified in Kibana OpenAPI spec (kibana.json):
// DELETE /api/lists?query:id (opId DeleteList). The id is a query param,
// not a path segment.
// Spec path verified: DELETE /api/osquery/saved_queries/{id}
// (opId OsqueryDeleteSavedQuery).

export const ListsDeleteInputSchema = z.object({
	id: z.string(),
	deleteReferences: z.boolean().optional(),
	ignoreReferences: z.boolean().optional(),
});
export type ListsDeleteInput = z.infer<typeof ListsDeleteInputSchema>;

export const ListsDeleteResponseSchema = z.record(z.string(), z.unknown());
export type ListsDeleteResponse = z.infer<typeof ListsDeleteResponseSchema>;

type Ctx = Parameters<KibanaEndpoints['listsDelete']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const deleteList: KibanaEndpoints['listsDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const query: Record<string, string | number | boolean | undefined> = {
		id: input.id,
	};
	if (input.deleteReferences !== undefined)
		query.deleteReferences = input.deleteReferences;
	if (input.ignoreReferences !== undefined)
		query.ignoreReferences = input.ignoreReferences;
	const response = await makeKibanaRequest<KibanaEndpointOutputs['listsDelete']>(
		'api/lists',
		baseUrl,
		ctx.key,
		{ method: 'DELETE', query },
	);
	await logEventFromContext(ctx, 'kibana.lists.deleteList', { ...input }, 'completed');
	return response;
};

export const OsquerySavedQueryDeleteInputSchema = z.object({
	id: z.string(),
});
export type OsquerySavedQueryDeleteInput = z.infer<
	typeof OsquerySavedQueryDeleteInputSchema
>;

export const OsquerySavedQueryDeleteResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type OsquerySavedQueryDeleteResponse = z.infer<
	typeof OsquerySavedQueryDeleteResponseSchema
>;

export const deleteSavedQuery: KibanaEndpoints['osquerySavedQueryDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['osquerySavedQueryDelete']
	>(`api/osquery/saved_queries/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'kibana.osquery.deleteSavedQuery',
		{ ...input },
		'completed',
	);
	return response;
};
