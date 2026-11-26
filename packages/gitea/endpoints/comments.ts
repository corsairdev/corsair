import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const list: GiteaEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/repos/${segment(parsed.owner)}/${segment(parsed.repo)}/issues/${parsed.index}/comments`,
			query: { since: parsed.since, before: parsed.before },
			// This route takes no page or limit on purpose: Gitea returns every
			// matching comment, so there is no page echo either.
			replayable: true,
		}),
		{
			shape: (raw) => ({ comments: raw }),
			log: (_, result) => ({ count: result.comments.length }),
		},
	);

export const create: GiteaEndpoints['commentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentsCreate,
			output: Outputs.commentsCreate,
		},
		input,
		({ owner, repo, index, body }) => ({
			method: 'POST',
			path: `/repos/${segment(owner)}/${segment(repo)}/issues/${index}/comments`,
			body: { body },
			replayable: false,
		}),
		{
			log: ({ index }, result) => ({
				issueNumber: index,
				commentId: result.id,
			}),
		},
	);

export const Comments = { list, create };
