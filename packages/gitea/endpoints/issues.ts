import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call, pageEcho } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const list: GiteaEndpoints['issuesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.list',
			input: Inputs.issuesList,
			output: Outputs.issuesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/repos/${segment(parsed.owner)}/${segment(parsed.repo)}/issues`,
			query: {
				state: parsed.state,
				labels: parsed.labels,
				q: parsed.q,
				type: parsed.type,
				milestones: parsed.milestones,
				since: parsed.since,
				before: parsed.before,
				created_by: parsed.created_by,
				assigned_by: parsed.assigned_by,
				mentioned_by: parsed.mentioned_by,
				page: parsed.page ?? 1,
				limit: parsed.limit ?? 50,
			},
			replayable: true,
		}),
		{
			// Pull requests come back on this list too; `type: 'issues'` filters
			// them and `Issue.pull_request` marks each one.
			shape: (raw, parsed) => ({ issues: raw, ...pageEcho(parsed) }),
			log: (_, result) => ({ count: result.issues.length }),
		},
	);

export const get: GiteaEndpoints['issuesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.get',
			input: Inputs.issuesGet,
			output: Outputs.issuesGet,
		},
		input,
		({ owner, repo, index }) => ({
			method: 'GET',
			path: `/repos/${segment(owner)}/${segment(repo)}/issues/${index}`,
			replayable: true,
		}),
	);

export const create: GiteaEndpoints['issuesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.create',
			input: Inputs.issuesCreate,
			output: Outputs.issuesCreate,
		},
		input,
		({ owner, repo, ...body }) => ({
			method: 'POST',
			path: `/repos/${segment(owner)}/${segment(repo)}/issues`,
			body,
			replayable: false,
		}),
		{ log: (_, result) => ({ issueNumber: result.number }) },
	);

export const update: GiteaEndpoints['issuesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.update',
			input: Inputs.issuesUpdate,
			output: Outputs.issuesUpdate,
		},
		input,
		({ owner, repo, index, ...body }) => ({
			// Close and reopen both go through state: closed / open.
			method: 'PATCH',
			path: `/repos/${segment(owner)}/${segment(repo)}/issues/${index}`,
			body,
			replayable: false,
		}),
		{
			log: ({ index }, result) => ({
				issueNumber: index,
				state: result.state ?? undefined,
			}),
		},
	);

export const Issues = { list, get, create, update };
