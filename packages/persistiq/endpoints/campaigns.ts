import type { PersistiqEndpoints } from '..';
import { call, segment } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersistiqEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/campaigns', query }),
		{
			log: (_, page) => ({
				count: page.campaigns.length,
				hasMore: page.has_more ?? undefined,
			}),
		},
	);

export const create: PersistiqEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/campaigns', body }),
		{ log: (_, campaign) => ({ campaignId: campaign.id }) },
	);

export const duplicate: PersistiqEndpoints['campaignsDuplicate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.duplicate',
			input: Inputs.campaignsDuplicate,
			output: Outputs.campaignsDuplicate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/campaigns/duplicate', body }),
		{ log: (_, campaign) => ({ campaignId: campaign.id }) },
	);

export const listLeads: PersistiqEndpoints['campaignsListLeads'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.listLeads',
			input: Inputs.campaignsListLeads,
			output: Outputs.campaignsListLeads,
		},
		input,
		({ campaignId, ...query }) => ({
			method: 'GET',
			path: `/v1/campaigns/${segment(campaignId)}/leads`,
			query,
		}),
		{
			log: (_, page) => ({
				count: page.campaign_leads.length,
				hasMore: page.has_more ?? undefined,
			}),
		},
	);

export const addLead: PersistiqEndpoints['campaignsAddLead'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.addLead',
			input: Inputs.campaignsAddLead,
			output: Outputs.campaignsAddLead,
		},
		input,
		({ campaignId, ...body }) => ({
			method: 'POST',
			path: `/v1/campaigns/${segment(campaignId)}/leads`,
			body,
		}),
		{
			log: (_, result) => ({
				campaignLeadId: result.campaign_lead?.id ?? undefined,
			}),
		},
	);

export const removeLead: PersistiqEndpoints['campaignsRemoveLead'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.removeLead',
			input: Inputs.campaignsRemoveLead,
			output: Outputs.campaignsRemoveLead,
		},
		input,
		({ campaignId, leadId }) => ({
			method: 'DELETE',
			path: `/v1/campaigns/${segment(campaignId)}/leads/${segment(leadId)}`,
		}),
		{
			shape: (raw, { leadId }) => {
				// The spec documents a 200 with no body. An empty container
				// ([] or {}) is not that, so only a missing body or an explicit
				// status "success" confirms the removal.
				const status =
					raw === undefined || raw === null || raw === ''
						? 'success'
						: Array.isArray(raw)
							? undefined
							: // unknown: raw is the untouched response body; only the
								// status flag is read.
								(raw as { status?: unknown }).status;
				if (status !== 'success') {
					throw new Error(
						'PersistIQ campaigns.removeLead: the answer did not confirm the removal',
					);
				}
				return { status: 'success', leadId };
			},
			log: (_parsed, result) => ({ leadId: result.leadId }),
		},
	);

export const listReplies: PersistiqEndpoints['campaignsListReplies'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.listReplies',
			input: Inputs.campaignsListReplies,
			output: Outputs.campaignsListReplies,
		},
		input,
		({ campaignId, ...query }) => ({
			method: 'GET',
			path: `/v1/campaigns/${segment(campaignId)}/replies`,
			query,
		}),
		{
			log: (_, page) => ({
				count: page.replies.length,
				hasMore: page.has_more ?? undefined,
			}),
		},
	);

export const replyToMessage: PersistiqEndpoints['campaignsReplyToMessage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.replyToMessage',
			input: Inputs.campaignsReplyToMessage,
			output: Outputs.campaignsReplyToMessage,
		},
		input,
		({ campaignId, ...body }) => ({
			method: 'POST',
			path: `/v1/campaigns/${segment(campaignId)}/replies`,
			body,
		}),
		{ log: (_, result) => ({ status: result.status ?? undefined }) },
	);
