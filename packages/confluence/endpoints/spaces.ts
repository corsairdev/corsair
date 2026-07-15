import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import type { ConfluenceEndpointOutputs } from './types';
import { SpacesListInputSchema } from './types';

export const list: ConfluenceEndpoints['spacesList'] = async (ctx, input) => {
	const validated = SpacesListInputSchema.parse(input);

	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeConfluenceRequest<
		ConfluenceEndpointOutputs['spacesList']
	>('space', ctx.key, cloudUrl, {
		method: 'GET',
		authType: ctx.options.authType,
		query: {
			...(validated.key && { key: validated.key }),
			...(validated.type && { type: validated.type }),
			...(validated.status && { status: validated.status }),
			...(validated.label && { label: validated.label }),
			...(validated.start !== undefined && { start: validated.start }),
			...(validated.limit !== undefined && { limit: validated.limit }),
			...(validated.expand && { expand: validated.expand }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.spaces.list',
		{ ...validated },
		'completed',
	);

	return result;
};
