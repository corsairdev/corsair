import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call, pageEcho } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

// These operations manage webhook REGISTRATIONS through the API. Gitea's
// deliveries are not received or verified by this plugin: Corsair exposes no
// inbound handler for them, so a caller who wants the events points `config.url`
// at their own receiver.

export const list: GiteaEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/repos/${segment(parsed.owner)}/${segment(parsed.repo)}/hooks`,
			query: { page: parsed.page ?? 1, limit: parsed.limit ?? 50 },
			replayable: true,
		}),
		{
			shape: (raw, parsed) => ({ hooks: raw, ...pageEcho(parsed) }),
			log: (_, result) => ({ count: result.hooks.length }),
		},
	);

export const create: GiteaEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ owner, repo, ...body }) => ({
			method: 'POST',
			path: `/repos/${segment(owner)}/${segment(repo)}/hooks`,
			body,
			replayable: false,
		}),
		{ log: (_, result) => ({ hookId: result.id }) },
	);

// `delete` is reserved in TypeScript, so the function is named remove and
// registered under the `delete:` key.
export const remove: GiteaEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ owner, repo, id }) => ({
			method: 'DELETE',
			path: `/repos/${segment(owner)}/${segment(repo)}/hooks/${id}`,
			replayable: false,
		}),
		{
			// The 204 body is empty; the result records what was removed.
			shape: (_, { id }) => ({ deleted: true, id }),
			log: ({ id }) => ({ hookId: id }),
		},
	);

export const Webhooks = { list, create, delete: remove };
