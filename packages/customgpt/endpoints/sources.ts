import { logEventFromContext } from 'corsair/core';
import type { CustomGPTContext, CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { cacheEntity, fileFormFields, omit } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

/** Mirrors a data source into the `sources` entity cache. */
async function cacheSource(
	ctx: CustomGPTContext,
	projectId: number,
	source: { id?: number } & Record<string, unknown>,
): Promise<void> {
	if (source?.id === undefined || !ctx.db.sources) return;
	await cacheEntity('source', () =>
		ctx.db.sources.upsertByEntityId(String(source.id), {
			...source,
			id: source.id as number,
			project_id: projectId,
			syncedAt: new Date(),
		}),
	);
}

export const listSources: CustomGPTEndpoints['listSources'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['listSources']
	>(`projects/${input.projectId}/sources`, ctx.key, { method: 'GET' });

	// Sources are grouped by origin: `uploads` is a single object, every other
	// key holds an array. Flatten both shapes before caching.
	for (const group of Object.values(response.data ?? {})) {
		for (const source of Array.isArray(group) ? group : [group]) {
			if (source && typeof source === 'object') {
				await cacheSource(ctx, input.projectId, source);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'customgpt.sources.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const addSource: CustomGPTEndpoints['addSource'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['addSource']
	>(`projects/${input.projectId}/sources`, ctx.key, {
		method: 'POST',
		formData: {
			...omit(input, ['projectId', 'file', 'files']),
			...fileFormFields(input),
		},
	});

	await cacheSource(ctx, input.projectId, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.sources.add',
		{ projectId: input.projectId, sitemap_path: input.sitemap_path },
		'completed',
	);
	return response;
};

export const updateSource: CustomGPTEndpoints['updateSource'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['updateSource']
	>(`projects/${input.projectId}/sources/${input.sourceId}`, ctx.key, {
		method: 'PUT',
		body: omit(input, ['projectId', 'sourceId']),
	});

	await cacheSource(ctx, input.projectId, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.sources.update',
		{ projectId: input.projectId, sourceId: input.sourceId },
		'completed',
	);
	return response;
};

export const deleteSource: CustomGPTEndpoints['deleteSource'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['deleteSource']
	>(`projects/${input.projectId}/sources/${input.sourceId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'customgpt.sources.delete',
		{ ...input },
		'completed',
	);
	return response;
};
