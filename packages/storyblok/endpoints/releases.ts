import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['releasesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.list',
			input: Inputs.releasesList,
			output: Outputs.releasesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/releases', query }),
		{ log: (_, result) => ({ count: result.releases.length }) },
	);

export const get: StoryblokEndpoints['releasesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.get',
			input: Inputs.releasesGet,
			output: Outputs.releasesGet,
		},
		input,
		({ release_id }) => ({
			method: 'GET',
			path: `/releases/${segment(release_id)}`,
		}),
		{ log: ({ release_id }) => ({ releaseId: release_id }) },
	);

export const create: StoryblokEndpoints['releasesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.create',
			input: Inputs.releasesCreate,
			output: Outputs.releasesCreate,
		},
		input,
		(release) => ({ method: 'POST', path: '/releases', body: { release } }),
		{ log: (_, result) => ({ releaseId: result.release.id ?? undefined }) },
	);

/**
 * `do_release` publishes the release in the same call, so an update carrying it
 * is the release action rather than a schedule change.
 */
export const update: StoryblokEndpoints['releasesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.update',
			input: Inputs.releasesUpdate,
			output: Outputs.releasesUpdate,
		},
		input,
		({ release_id, do_release, ...release }) => ({
			method: 'PUT',
			path: `/releases/${segment(release_id)}`,
			body: { release, do_release },
		}),
		{
			log: ({ release_id, do_release }) => ({
				releaseId: release_id,
				doRelease: do_release,
			}),
		},
	);

export const remove: StoryblokEndpoints['releasesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.delete',
			input: Inputs.releasesDelete,
			output: Outputs.releasesDelete,
		},
		input,
		({ release_id }) => ({
			method: 'DELETE',
			path: `/releases/${segment(release_id)}`,
		}),
		{ log: ({ release_id }) => ({ releaseId: release_id }) },
	);
