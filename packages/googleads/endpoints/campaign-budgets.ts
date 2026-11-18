import type { GoogleAdsEndpoints } from '..';
import { customerPathId } from '../client';
import { call } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
} from './types';

/** A campaign budget id is the bare number or the full resource name. */
function budgetResourceName(customerId: string, budgetId: string): string {
	if (budgetId.startsWith('customers/')) {
		if (!/^customers\/\d+\/campaignBudgets\/[^/]+$/.test(budgetId)) {
			throw new Error(
				`Invalid campaign budget resource name "${budgetId}": expected customers/<id>/campaignBudgets/<id>`,
			);
		}
		return budgetId;
	}
	if (!/^\d+$/.test(budgetId)) {
		throw new Error(
			`Invalid campaign budget id "${budgetId}": expected digits or a full resource name`,
		);
	}
	return `customers/${customerId}/campaignBudgets/${budgetId}`;
}

export const create: GoogleAdsEndpoints['campaignBudgetsCreate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'campaignBudgets.create',
			input: Inputs.campaignBudgetsCreate,
			output: Outputs.campaignBudgetsCreate,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/customers/${customerPathId(input.customerId)}/campaignBudgets:mutate`,
			body: {
				operations: [{ create: input.campaignBudget }],
				...(input.validateOnly ? { validateOnly: true } : {}),
			},
		}),
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);

/**
 * A budget change is the way to raise or lower a campaign's spend; the campaign
 * itself never carries an amount.
 */
export const update: GoogleAdsEndpoints['campaignBudgetsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'campaignBudgets.update',
			input: Inputs.campaignBudgetsUpdate,
			output: Outputs.campaignBudgetsUpdate,
		},
		rawInput,
		(input) => {
			const customer = customerPathId(input.customerId);
			return {
				method: 'POST',
				path: `/customers/${customer}/campaignBudgets:mutate`,
				body: {
					operations: [
						{
							update: {
								resourceName: budgetResourceName(
									customer,
									input.campaignBudgetId,
								),
								...input.campaignBudget,
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
