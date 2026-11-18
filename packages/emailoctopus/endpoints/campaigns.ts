import type { EmailOctopusEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EmailOctopusEndpointInputSchemas as Inputs,
	EmailOctopusEndpointOutputSchemas as Outputs,
} from './types';

export const list: EmailOctopusEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		({ limit, starting_after }) => ({
			method: 'GET',
			path: '/campaigns',
			query: { limit, starting_after },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const get: EmailOctopusEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		({ campaign_id }) => ({
			method: 'GET',
			path: `/campaigns/${segment(campaign_id)}`,
		}),
		{ log: ({ campaign_id }) => ({ campaignId: campaign_id }) },
	);

export const reportContacts: EmailOctopusEndpoints['campaignsReportContacts'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'campaigns.reportContacts',
				input: Inputs.campaignsReportContacts,
				output: Outputs.campaignsReportContacts,
			},
			input,
			({ campaign_id, status, limit, starting_after }) => ({
				method: 'GET',
				path: `/campaigns/${segment(campaign_id)}/reports`,
				query: { status, limit, starting_after },
			}),
			{
				log: ({ campaign_id, status }, result) => ({
					campaignId: campaign_id,
					status,
					count: result.data?.length ?? 0,
				}),
			},
		);

export const reportLinks: EmailOctopusEndpoints['campaignsReportLinks'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.reportLinks',
			input: Inputs.campaignsReportLinks,
			output: Outputs.campaignsReportLinks,
		},
		input,
		({ campaign_id }) => ({
			method: 'GET',
			path: `/campaigns/${segment(campaign_id)}/reports/links`,
		}),
		{
			log: ({ campaign_id }, result) => ({
				campaignId: campaign_id,
				count: result.data?.length ?? 0,
			}),
		},
	);

export const reportSummary: EmailOctopusEndpoints['campaignsReportSummary'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.reportSummary',
			input: Inputs.campaignsReportSummary,
			output: Outputs.campaignsReportSummary,
		},
		input,
		({ campaign_id }) => ({
			method: 'GET',
			path: `/campaigns/${segment(campaign_id)}/reports/summary`,
		}),
		{ log: ({ campaign_id }) => ({ campaignId: campaign_id }) },
	);
