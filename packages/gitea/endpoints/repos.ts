import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call, pageEcho } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const list: GiteaEndpoints['reposList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'repos.list',
			input: Inputs.reposList,
			output: Outputs.reposList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/user/repos',
			query: { page: parsed.page ?? 1, limit: parsed.limit ?? 50 },
			replayable: true,
		}),
		{
			shape: (raw, parsed) => ({
				repositories: raw,
				...pageEcho(parsed),
			}),
			log: (_, result) => ({ count: result.repositories.length }),
		},
	);

export const get: GiteaEndpoints['reposGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'repos.get',
			input: Inputs.reposGet,
			output: Outputs.reposGet,
		},
		input,
		({ owner, repo }) => ({
			method: 'GET',
			path: `/repos/${segment(owner)}/${segment(repo)}`,
			replayable: true,
		}),
	);

export const create: GiteaEndpoints['reposCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'repos.create',
			input: Inputs.reposCreate,
			output: Outputs.reposCreate,
		},
		input,
		(parsed) => ({
			// The create goes to /user/repos: the new repo is owned by the
			// authenticated user, so the input carries no owner.
			method: 'POST',
			path: '/user/repos',
			body: parsed,
			replayable: false,
		}),
		{ log: (_, result) => ({ repositoryId: result.id }) },
	);

// `delete` is reserved in TypeScript, so the function is named remove and
// registered under the `delete:` key.
export const remove: GiteaEndpoints['reposDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'repos.delete',
			input: Inputs.reposDelete,
			output: Outputs.reposDelete,
		},
		input,
		({ owner, repo }) => ({
			method: 'DELETE',
			path: `/repos/${segment(owner)}/${segment(repo)}`,
			// Destructive and irreversible: the repo, its issues, releases and
			// wiki are gone with no API call to bring them back.
			replayable: false,
		}),
		{
			// The 204 body is empty; the result records what was removed.
			shape: (_, { owner, repo }) => ({ deleted: true, owner, repo }),
			log: ({ owner, repo }) => ({ owner, repo }),
		},
	);

export const Repos = { list, get, create, delete: remove };
