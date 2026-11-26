import type { LinklyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const list: LinklyEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		input,
		({ workspace_id }) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/domains`,
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				count: result.domains.length,
			}),
		},
	);

export const create: LinklyEndpoints['domainsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.create',
			input: Inputs.domainsCreate,
			output: Outputs.domainsCreate,
		},
		input,
		({ workspace_id, name }) => ({
			method: 'POST',
			path: `/api/v1/workspace/${segment(workspace_id)}/domains`,
			body: { name },
			// A second add of the same name is not documented as a no-op.
			replaySafe: false,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				domainId: result.id ?? undefined,
			}),
		},
	);

export const remove: LinklyEndpoints['domainsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.delete',
			input: Inputs.domainsDelete,
			output: Outputs.domainsDelete,
		},
		input,
		({ workspace_id, domain_id }) => ({
			method: 'DELETE',
			path: `/api/v1/workspace/${segment(workspace_id)}/domains/${segment(domain_id)}`,
			// A repeat finds the domain gone and answers 404; nothing doubles.
			replaySafe: true,
		}),
		{
			log: ({ workspace_id, domain_id }) => ({
				workspaceId: workspace_id,
				domainId: domain_id,
			}),
		},
	);

export const updateFavicon: LinklyEndpoints['domainsUpdateFavicon'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.updateFavicon',
			input: Inputs.domainsUpdateFavicon,
			output: Outputs.domainsUpdateFavicon,
		},
		input,
		({ workspace_id, domain_id, favicon_url }) => ({
			method: 'PATCH',
			path: `/api/v1/workspace/${segment(workspace_id)}/domains/${segment(domain_id)}/favicon`,
			body: { favicon_url },
			// Setting the same URL again leaves the same state.
			replaySafe: true,
		}),
		{
			log: ({ workspace_id, domain_id }) => ({
				workspaceId: workspace_id,
				domainId: domain_id,
			}),
		},
	);
