import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['storiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.list',
			input: Inputs.storiesList,
			output: Outputs.storiesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/stories', query }),
		{
			log: (_, result) => ({ count: result.stories.length }),
		},
	);

export const get: StoryblokEndpoints['storiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.get',
			input: Inputs.storiesGet,
			output: Outputs.storiesGet,
		},
		input,
		({ story_id }) => ({
			method: 'GET',
			path: `/stories/${segment(story_id)}`,
		}),
		{ log: ({ story_id }) => ({ storyId: story_id }) },
	);

export const create: StoryblokEndpoints['storiesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.create',
			input: Inputs.storiesCreate,
			output: Outputs.storiesCreate,
		},
		input,
		({ publish, release_id, ...story }) => ({
			method: 'POST',
			path: '/stories',
			body: { story, publish, release_id },
		}),
		{
			log: (parsed, result) => ({
				storyId: result.story.id ?? undefined,
				slug: parsed.slug,
			}),
		},
	);

export const update: StoryblokEndpoints['storiesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.update',
			input: Inputs.storiesUpdate,
			output: Outputs.storiesUpdate,
		},
		input,
		({ story_id, publish, release_id, lang, force_update, ...story }) => ({
			method: 'PUT',
			path: `/stories/${segment(story_id)}`,
			body: { story, publish, release_id, lang, force_update },
		}),
		{ log: ({ story_id }) => ({ storyId: story_id }) },
	);

/**
 * Publish and unpublish are GETs on Storyblok's side, which is unusual enough to
 * be worth stating: both change published state, so both are writes here.
 */
export const publish: StoryblokEndpoints['storiesPublish'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.publish',
			input: Inputs.storiesPublish,
			output: Outputs.storiesPublish,
		},
		input,
		({ story_id, release_id }) => ({
			method: 'GET',
			path: `/stories/${segment(story_id)}/publish`,
			query: { release_id },
		}),
		{
			log: ({ story_id, release_id }) => ({
				storyId: story_id,
				releaseId: release_id,
			}),
		},
	);

export const unpublish: StoryblokEndpoints['storiesUnpublish'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.unpublish',
			input: Inputs.storiesUnpublish,
			output: Outputs.storiesUnpublish,
		},
		input,
		({ story_id }) => ({
			method: 'GET',
			path: `/stories/${segment(story_id)}/unpublish`,
		}),
		{ log: ({ story_id }) => ({ storyId: story_id }) },
	);

export const remove: StoryblokEndpoints['storiesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.delete',
			input: Inputs.storiesDelete,
			output: Outputs.storiesDelete,
		},
		input,
		({ story_id }) => ({
			method: 'DELETE',
			path: `/stories/${segment(story_id)}`,
		}),
		{ log: ({ story_id }) => ({ storyId: story_id }) },
	);
