import type { WoodpeckerCoEndpoints } from '..';
import { call } from './call';
import {
	WoodpeckerCoEndpointInputSchemas as Inputs,
	WoodpeckerCoEndpointOutputSchemas as Outputs,
	ProspectsRawResponseSchema,
	WOODPECKERCO_DEFAULT_PER_PAGE,
} from './types';

export const addToCampaign: WoodpeckerCoEndpoints['prospectsAddToCampaign'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'prospects.addToCampaign',
			input: Inputs.prospectsAddToCampaign,
			output: Outputs.prospectsAddToCampaign,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/add_prospects_campaign',
			body,
		}),
		{
			log: ({ campaign, prospects }, result) => ({
				campaignId: campaign.campaign_id,
				submitted: prospects.length,
				rejected: result.prospects.filter((p) => p.status === 'ERROR').length,
			}),
		},
	);

export const listInCampaigns: WoodpeckerCoEndpoints['prospectsListInCampaigns'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'prospects.listInCampaigns',
				input: Inputs.prospectsListInCampaigns,
				output: Outputs.prospectsListInCampaigns,
			},
			input,
			({ campaigns_id, id, ...query }) => ({
				method: 'GET',
				path: '/v1/prospects',
				query: {
					...query,
					campaigns_id: campaigns_id.join(','),
					id: id?.join(','),
				},
			}),
			{
				shape: (raw, { page = 1, per_page }) => {
					const pageSize = per_page ?? WOODPECKERCO_DEFAULT_PER_PAGE;
					const body = ProspectsRawResponseSchema.parse(raw ?? []);
					const prospects = Array.isArray(body) ? body : [];
					return {
						prospects,
						page,
						per_page: pageSize,
						// A prospect in several campaigns, or a CLICKED row per link,
						// is one row each, so a page can only be judged by its size.
						next_page: prospects.length >= pageSize ? page + 1 : null,
						message: Array.isArray(body) ? undefined : body.message,
					};
				},
				log: ({ campaigns_id }, result) => ({
					campaigns: campaigns_id.length,
					page: result.page,
					count: result.prospects.length,
				}),
			},
		);
