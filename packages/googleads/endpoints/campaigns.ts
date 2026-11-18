import type { GoogleAdsEndpoints } from '..';
import { customerPathId } from '../client';
import { call } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
} from './types';

export const create: GoogleAdsEndpoints['campaignsCreate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/customers/${customerPathId(input.customerId)}/campaigns:mutate`,
			body: {
				operations: [{ create: input.campaign }],
				...(input.validateOnly ? { validateOnly: true } : {}),
			},
		}),
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);

/**
 * A campaign id is either the bare number or its full resource name, and the
 * API takes only the resource name in `update` and `remove`.
 */
function campaignResourceName(customerId: string, campaignId: string): string {
	if (campaignId.startsWith('customers/')) {
		if (!/^customers\/\d+\/campaigns\/[^/]+$/.test(campaignId)) {
			throw new Error(
				`Invalid campaign resource name "${campaignId}": expected customers/<id>/campaigns/<id>`,
			);
		}
		return campaignId;
	}
	if (!/^\d+$/.test(campaignId)) {
		throw new Error(
			`Invalid campaign id "${campaignId}": expected digits or a full resource name`,
		);
	}
	return `customers/${customerId}/campaigns/${campaignId}`;
}

export const update: GoogleAdsEndpoints['campaignsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'campaigns.update',
			input: Inputs.campaignsUpdate,
			output: Outputs.campaignsUpdate,
		},
		rawInput,
		(input) => {
			const customer = customerPathId(input.customerId);
			return {
				method: 'POST',
				path: `/customers/${customer}/campaigns:mutate`,
				body: {
					operations: [
						{
							update: {
								resourceName: campaignResourceName(customer, input.campaignId),
								...input.campaign,
							},
							updateMask: input.updateMask,
						},
					],
					...(input.validateOnly ? { validateOnly: true } : {}),
				},
			};
		},
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);

/**
 * A remove sets the campaign's status to REMOVED. Google keeps the row, so the
 * metrics stay readable for the rest of the account's history.
 */
export const remove: GoogleAdsEndpoints['campaignsRemove'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'campaigns.remove',
			input: Inputs.campaignsRemove,
			output: Outputs.campaignsRemove,
		},
		rawInput,
		(input) => {
			const customer = customerPathId(input.customerId);
			return {
				method: 'POST',
				path: `/customers/${customer}/campaigns:mutate`,
				body: {
					operations: [
						{
							remove: campaignResourceName(customer, input.campaignId),
						},
					],
					...(input.validateOnly ? { validateOnly: true } : {}),
				},
			};
		},
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);
