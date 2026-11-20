import type { PersistiqEndpoints } from '..';
import { call } from './call';
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
		() => ({ method: 'GET', path: '/v1/campaigns' }),
		{ log: (_, page) => ({ count: page.data.length }) },
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
		{ log: (_, page) => ({ campaignId: page.data[0]?.id ?? undefined }) },
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
		{ log: (_, page) => ({ count: page.data.length }) },
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
		({ campaignId }) => ({
			method: 'GET',
			path: `/v1/campaigns/${encodeURIComponent(campaignId)}/leads`,
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
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
			path: `/v1/campaigns/${encodeURIComponent(campaignId)}/leads`,
			body,
		}),
		{ log: (_, result) => ({ success: result.status === 'success' }) },
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
			path: `/v1/campaigns/${encodeURIComponent(campaignId)}/leads/${encodeURIComponent(leadId)}`,
		}),
		{
			shape: (raw, { leadId }) => {
				// The delete answers { status: "success" }; anything else is a
				// failure the caller must see rather than a fabricated success.
				// unknown: raw is the untouched response body; only the status
				// flag is inspected before the output schema parses it.
				const record = (raw ?? {}) as { status?: unknown };
				if (record.status !== 'success') {
					throw new Error(
						`PersistIQ campaigns.removeLead: unexpected answer ${JSON.stringify(raw)}`,
					);
				}
				return { status: 'success', leadId };
			},
			log: (_parsed, result) => ({ leadId: String(result.leadId) }),
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
		({ campaignId }) => ({
			method: 'GET',
			path: `/v1/campaigns/${encodeURIComponent(campaignId)}/replies`,
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
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
			path: `/v1/campaigns/${encodeURIComponent(campaignId)}/replies`,
			body,
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
