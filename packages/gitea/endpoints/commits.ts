import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call, pageEcho } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const list: GiteaEndpoints['commitsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'commits.list',
			input: Inputs.commitsList,
			output: Outputs.commitsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/repos/${segment(parsed.owner)}/${segment(parsed.repo)}/commits`,
			query: {
				sha: parsed.sha,
				path: parsed.path,
				since: parsed.since,
				until: parsed.until,
				stat: parsed.stat,
				verification: parsed.verification,
				files: parsed.files,
				not: parsed.not,
				page: parsed.page ?? 1,
				limit: parsed.limit ?? 50,
			},
			replayable: true,
		}),
		{
			// A repo with no commits answers 409 "empty repository" and stays an
			// error on purpose: the caller cannot tell an empty history from a
			// wrong owner or repo name if it were mapped to [].
			shape: (raw, parsed) => ({ commits: raw, ...pageEcho(parsed) }),
			log: (_, result) => ({ count: result.commits.length }),
		},
	);

export const Commits = { list };
