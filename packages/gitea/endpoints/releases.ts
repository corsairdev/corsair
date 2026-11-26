import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call, pageEcho } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const list: GiteaEndpoints['releasesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.list',
			input: Inputs.releasesList,
			output: Outputs.releasesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/repos/${segment(parsed.owner)}/${segment(parsed.repo)}/releases`,
			query: {
				draft: parsed.draft,
				// The API names this query parameter with a hyphen.
				'pre-release': parsed.pre_release,
				tag_filter: parsed.tag_filter,
				page: parsed.page ?? 1,
				limit: parsed.limit ?? 50,
			},
			replayable: true,
		}),
		{
			shape: (raw, parsed) => ({ releases: raw, ...pageEcho(parsed) }),
			log: (_, result) => ({ count: result.releases.length }),
		},
	);

export const create: GiteaEndpoints['releasesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'releases.create',
			input: Inputs.releasesCreate,
			output: Outputs.releasesCreate,
		},
		input,
		({ owner, repo, ...body }) => ({
			method: 'POST',
			path: `/repos/${segment(owner)}/${segment(repo)}/releases`,
			body,
			// A release for a tag that already has one answers 409, so a retry
			// after an unresolved outcome could conflict with the first attempt.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				releaseId: result.id,
				tagName: result.tag_name ?? undefined,
			}),
		},
	);

export const Releases = { list, create };
