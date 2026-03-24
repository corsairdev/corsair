import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const create: FigmaEndpoints['devResourcesCreate'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['devResourcesCreate']>(
		`v1/dev_resources`,
		ctx.key,
		{
			method: 'POST',
			body: {
				dev_resources: input.dev_resources,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.devResources.create', { ...input }, 'completed');
	return result;
};

export const deleteDevResource: FigmaEndpoints['devResourcesDelete'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['devResourcesDelete']>(
		`v1/files/${input.file_key}/dev_resources/${input.dev_resource_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'figma.devResources.delete', { ...input }, 'completed');
	return result;
};

export const get: FigmaEndpoints['devResourcesGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['devResourcesGet']>(
		`v1/files/${input.file_key}/dev_resources`,
		ctx.key,
		{
			method: 'GET',
			query: { node_ids: input.node_ids },
		},
	);

	await logEventFromContext(ctx, 'figma.devResources.get', { ...input }, 'completed');
	return result;
};

export const update: FigmaEndpoints['devResourcesUpdate'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['devResourcesUpdate']>(
		`v1/dev_resources`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				dev_resources: input.dev_resources,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.devResources.update', { ...input }, 'completed');
	return result;
};
