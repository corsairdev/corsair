import type { NeedleEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	NeedleEndpointInputSchemas as Inputs,
	NeedleEndpointOutputSchemas as Outputs,
} from './types';

export const list: NeedleEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		({ cursor, limit, status }) => ({
			method: 'GET',
			path: '/campaigns',
			query: { cursor, limit, status },
		}),
		{
			log: (_, result) => ({
				count: result.campaigns.length,
				hasMore: result.nextCursor != null,
			}),
		},
	);

/**
 * Creates a campaign in `draft`. It does not contact anyone until
 * `campaigns.update` sets `status: 'active'`.
 */
export const create: NeedleEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/campaigns', body }),
		{ log: (_, result) => ({ campaignId: result.campaign.id ?? undefined }) },
	);

export const get: NeedleEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		({ campaignId }) => ({
			method: 'GET',
			path: `/campaigns/${segment(campaignId)}`,
		}),
		{
			log: ({ campaignId }, result) => ({
				campaignId,
				status: result.campaign.status ?? undefined,
			}),
		},
	);

/**
 * Changing `status` to `active` starts sending, and `paused` halts it. Both are
 * writes with real consequences: an active campaign contacts its leads.
 */
export const update: NeedleEndpoints['campaignsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.update',
			input: Inputs.campaignsUpdate,
			output: Outputs.campaignsUpdate,
		},
		input,
		({ campaignId, ...body }) => ({
			method: 'PATCH',
			path: `/campaigns/${segment(campaignId)}`,
			body,
		}),
		{
			log: ({ campaignId }, result) => ({
				campaignId,
				status: result.campaign.status ?? undefined,
			}),
		},
	);

/** Archives the campaign. It stops sending and leaves the active list. */
export const archive: NeedleEndpoints['campaignsArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.archive',
			input: Inputs.campaignsArchive,
			output: Outputs.campaignsArchive,
		},
		input,
		({ campaignId }) => ({
			method: 'DELETE',
			path: `/campaigns/${segment(campaignId)}`,
		}),
		{ log: ({ campaignId }) => ({ campaignId }) },
	);

export const stats: NeedleEndpoints['campaignsStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.stats',
			input: Inputs.campaignsStats,
			output: Outputs.campaignsStats,
		},
		input,
		({ campaignId }) => ({
			method: 'GET',
			path: `/campaigns/${segment(campaignId)}/stats`,
		}),
		{
			log: ({ campaignId }, result) => ({
				campaignId,
				progress: result.stats.progress ?? undefined,
			}),
		},
	);

export const leads: NeedleEndpoints['campaignsLeads'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.leads',
			input: Inputs.campaignsLeads,
			output: Outputs.campaignsLeads,
		},
		input,
		({ campaignId, cursor, limit }) => ({
			method: 'GET',
			path: `/campaigns/${segment(campaignId)}/leads`,
			query: { cursor, limit },
		}),
		{
			log: (_, result) => ({
				count: result.leads.length,
				hasMore: result.nextCursor != null,
			}),
		},
	);

/**
 * Enrolls up to 500 leads. The answer holds one result per lead, so a batch can
 * partly succeed; a skipped lead carries a reason rather than an enrollment id.
 */
export const enroll: NeedleEndpoints['campaignsEnroll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.enroll',
			input: Inputs.campaignsEnroll,
			output: Outputs.campaignsEnroll,
		},
		input,
		({ campaignId, leadIds }) => ({
			method: 'POST',
			path: `/campaigns/${segment(campaignId)}/leads`,
			body: { leadIds },
		}),
		{
			log: ({ campaignId }, result) => ({
				campaignId,
				requested: result.results.length,
				accepted: result.results.filter((entry) => entry.status === 'accepted')
					.length,
			}),
		},
	);

/** Stops leads in the campaign. It does not delete them. */
export const stopLeads: NeedleEndpoints['campaignsStopLeads'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.stopLeads',
			input: Inputs.campaignsStopLeads,
			output: Outputs.campaignsStopLeads,
		},
		input,
		({ campaignId, leadIds }) => ({
			method: 'POST',
			path: `/campaigns/${segment(campaignId)}/leads/bulk-stop`,
			body: { leadIds },
		}),
		{
			log: ({ campaignId }, result) => ({
				campaignId,
				requested: result.results.length,
				stopped: result.results.filter((entry) => entry.status === 'stopped')
					.length,
			}),
		},
	);
