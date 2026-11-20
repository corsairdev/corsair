import type { GoogleAdsEndpoints } from '..';
import { customerPathId, entityResourceName } from '../client';
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
								resourceName: entityResourceName(
									customer,
									input.campaignId,
									'campaigns',
								),
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
							remove: entityResourceName(
								customer,
								input.campaignId,
								'campaigns',
							),
						},
					],
					...(input.validateOnly ? { validateOnly: true } : {}),
				},
			};
		},
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);
