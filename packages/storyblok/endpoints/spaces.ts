import type { StoryblokEndpoints } from '..';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

/** This route sits above the space, at the region root, so it takes no prefix. */
export const list: StoryblokEndpoints['spacesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'spaces.list',
			input: Inputs.spacesList,
			output: Outputs.spacesList,
		},
		input,
		// Above the space, so the path stands alone.
		(query) => ({ method: 'GET', path: '/spaces', query, scope: 'root' }),
		{ log: (_, result) => ({ count: result.spaces.length }) },
	);

/** `/spaces/:id` is the space root. */
export const get: StoryblokEndpoints['spacesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'spaces.get',
			input: Inputs.spacesGet,
			output: Outputs.spacesGet,
		},
		input,
		// The space root is the prefix with nothing after it.
		() => ({ method: 'GET', path: '', scope: 'space' }),
		{ log: (_, result) => ({ spaceId: result.space.id ?? undefined }) },
	);
