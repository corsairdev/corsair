import type { GoogleAdsEndpoints } from '..';
import { customerPathId, entityResourceName } from '../client';
import { call } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
} from './types';

export const create: GoogleAdsEndpoints['adGroupsCreate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'adGroups.create',
			input: Inputs.adGroupsCreate,
			output: Outputs.adGroupsCreate,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/customers/${customerPathId(input.customerId)}/adGroups:mutate`,
			body: {
				operations: [{ create: input.adGroup }],
				...(input.validateOnly ? { validateOnly: true } : {}),
			},
		}),
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);

/** Pausing an ad group is the usual way to stop its ads without removing them. */
export const update: GoogleAdsEndpoints['adGroupsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'adGroups.update',
			input: Inputs.adGroupsUpdate,
			output: Outputs.adGroupsUpdate,
		},
		rawInput,
		(input) => {
			const customer = customerPathId(input.customerId);
			return {
				method: 'POST',
				path: `/customers/${customer}/adGroups:mutate`,
				body: {
					operations: [
						{
							update: {
								resourceName: entityResourceName(
									customer,
									input.adGroupId,
									'adGroups',
								),
								...input.adGroup,
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
